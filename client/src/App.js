//0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

import { useEffect, useState } from "react";
import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import { ethers } from "ethers";
import FileUpload from "./Components/FileUpload";
import Display from "./Components/Display";
import Modal from "./Components/Modal";
import "./App.css";
import Navbar from "./Components/Navbar";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });

        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        let contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
        const contract = new ethers.Contract(contractAddress, Upload.abi, signer);

        setContract(contract);
        setProvider(provider);
      } else {
        console.error("Metamask is not installed");
      }
    };

    provider && loadProvider();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 dark:from-[#0B1120] dark:to-[#0B1120] text-gray-900 dark:text-white px-4 sm:px-8">
      <Navbar account={account} />

      {/* File Upload Section */}
      <div className="mt-10 flex flex-col items-center justify-center">
        <div className="bg-white dark:bg-[#111827] rounded-2xl shadow-lg px-6 py-8 max-w-md w-full">
          <h2 className="text-2xl font-semibold mb-4 text-center">Upload File</h2>
          <FileUpload account={account} contract={contract} provider={provider} />
        </div>
      </div>

      {/* View and Share Section */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">📂 View Section</h2>
          <Display account={account} contract={contract} />
        </div>

        <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">🔗 Share Access</h2>
          <Modal account={account} contract={contract} />
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-12 text-sm text-gray-500 dark:text-gray-400">
        <p>Connected Wallet: <span className="font-mono">{account}</span></p>
      </div>
    </div>
  );
}

export default App;