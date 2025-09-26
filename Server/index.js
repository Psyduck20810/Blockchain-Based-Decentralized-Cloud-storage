const express = require('express');
const cors = require('cors');
const multer = require('multer');
const PinataSDK = require('@pinata/sdk');
require('dotenv').config();
const { createAccessRequest, isDuplicateRequest } = require('./schema/Access.js');


const app = express();
app.use(express.json());
app.use(cors());
app.listen(4000, () => {
    console.log(`🚀 Server Started at 4000`);
});

// Initialize Pinata
const pinata = new PinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_API_KEY);
const storage = multer.memoryStorage();
const upload = multer({ storage });

// In-memory storage
let accessRequests = [];  // Each entry: { requester, requested, access }

// Write pending request to memory + Pinata
app.post('/writePending', async (req, res) => {
    const { requester, requested } = req.body;

    if (!requester || !requested) {
        return res.status(400).json({ message: "Missing requester or requested address" });
    }

    const entry = { requester, requested, access: false };
    accessRequests.push(entry);

    try {
        const result = await pinata.pinJSONToIPFS(entry);
        res.status(201).json({ ipfsHash: result.IpfsHash, message: "Request stored on IPFS" });
    } catch (error) {
        console.error("Pinata Error:", error);
        res.status(500).json({ message: "Failed to store on IPFS", error: error.message });
    }
});

// Get pending requests received by 'requested' account
app.post('/getPending', (req, res) => {
    const { requested } = req.body;
    if (!requested) return res.status(400).json({ message: "Requested address missing" });

    const pending = accessRequests.filter(item => item.requested === requested);
    res.status(200).json(pending);
});

// Get granted access (as requester)
app.post('/grantList', (req, res) => {
    const { requester } = req.body;
    if (!requester) return res.status(400).json({ message: "Requester address missing" });

    const granted = accessRequests.filter(item => item.requester === requester && item.access === true);
    res.status(200).json(granted);
});

// Grant access
app.put('/grant', async (req, res) => {
    const { requester, requested } = req.body;
    if (!requester || !requested) return res.status(400).json({ message: "Missing fields" });

    const index = accessRequests.findIndex(item => item.requester === requester && item.requested === requested);
    if (index === -1) return res.status(404).json({ message: "Request not found" });

    accessRequests[index].access = true;

    try {
        const result = await pinata.pinJSONToIPFS(accessRequests[index]);
        res.status(200).json({ message: "Access granted and updated on IPFS", ipfsHash: result.IpfsHash });
    } catch (err) {
        res.status(500).json({ message: "Failed to pin update", error: err.message });
    }
});

// Revoke access
app.delete('/revoke', async (req, res) => {
    const { requester, requested } = req.body;
    if (!requester || !requested) return res.status(400).json({ message: "Missing fields" });

    const index = accessRequests.findIndex(item => item.requester === requester && item.requested === requested);
    if (index === -1) return res.status(404).json({ message: "Request not found" });

    accessRequests.splice(index, 1);  // remove it

    try {
        const result = await pinata.pinJSONToIPFS({ requester, requested, revoked: true });
        res.status(200).json({ message: "Access revoked and updated on IPFS", ipfsHash: result.IpfsHash });
    } catch (err) {
        res.status(500).json({ message: "Failed to pin revoke", error: err.message });
    }
});
