import React, { useState } from "react";

const ShareAccess = ({ account, contract, provider }) => {
  const [addressToShare, setAddressToShare] = useState("");
  const [loading, setLoading] = useState(false);

  const handleShare = async () => {
    if (!addressToShare) {
      alert("Please enter a valid Ethereum address.");
      return;
    }

    try {
      setLoading(true);
      const signer = provider.getSigner();
      const contractWithSigner = contract.connect(signer);

      const tx = await contractWithSigner.allow(addressToShare);
      await tx.wait();

      alert(`Access shared successfully with ${addressToShare}`);
      setAddressToShare("");
    } catch (err) {
      console.error("Error sharing access:", err);
      alert("Failed to share access. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Share Access</h2>
      <input
        type="text"
        value={addressToShare}
        onChange={(e) => setAddressToShare(e.target.value)}
        placeholder="Enter address to share access"
        className="border p-2 rounded w-full mb-2 text-black"
      />
      <button
        onClick={handleShare}
        disabled={loading}
        className={`px-4 py-2 rounded text-white ${
          loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Sharing..." : "Share Access"}
      </button>
    </div>
  );
};

export default ShareAccess;
