#Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

To start the project 

-> install required NPM Files on Decentralized Folder, Client and Server ```using npm i```

On Decentralized Folder run the following commands
 ```shell
npx hardhat node
npx hardhat run --network localhost scripts/deploy.js
```
On Server Folder run the following command
```shell
node index.js
```
On CLient Folder Run the following Command
```shell
npm start
```
Pinata Setup (IPFS Integration)
To enable decentralized file storage using IPFS via Pinata, follow these steps:

1. Create a Pinata Account
 Go to https://www.pinata.cloud and sign up.
Verify your email to activate the account.

2. Generate API Keys
 After logging in, navigate to the API Keys section in your dashboard.
 Click "New Key", give it a name, and choose the required permissions (Admin for full access).
 Copy the API Key and Secret API Key and store them securely. You’ll need them in your environment variables.

3. Install Pinata SDK
Install the Pinata SDK in your Node.js project:
```shell
npm install @pinata/sdk
```

4. Configure Environment Variables
   Go to Server/.env
   ```shell
   PINATA_API_KEY=your_api_key_here
   PINATA_SECRET_API_KEY=your_secret_key_here
   ```


**✋❗️❕ Crypto Wallet is strictly necessary ❕❗️✋**
1. Install MetaMask
   Install the MetaMask browser extension from https://metamask.io/.
   Create a wallet or import an existing one using your seed phrase.

2. Start Your Local Blockchain
    Use Hardhat to run a local blockchain.
    Start your local node:
   ```shell
   npx hardhat node
   ```
   It will run on http://127.0.0.1:8545 and provide you with test accounts and private keys.
Start a workspace. Note the RPC URL (e.g., http://127.0.0.1:7545) and accounts.

3. Connect MetaMask to Local Network
   Open MetaMask and click the network dropdown (top center).
   Click "Add Network" → "Add a network manually".
   Fill in the following fields:
   ```shell
    Network Name: Localhost 8545
    New RPC URL: http://127.0.0.1:8545
    Chain ID: 31337
    Currency Symbol: ETH
   ```
4. Import Test Account into MetaMask 
   MetaMask won’t automatically recognize local accounts. You must import one manually:
   Copy a private key from the Hardhat/Ganache terminal.
   In MetaMask, click the account icon → Import Account.
   Paste the private key and click Import.
   Now your MetaMask is connected to your local test network and funded with test ETH!
#   B l o c k c h a i n - B a s e d - D e c e n t r a l i z e d - C l o u d - s t o r a g e 
 
