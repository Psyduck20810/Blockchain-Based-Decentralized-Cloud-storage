import React, { useState } from "react";
import axios from "axios";

const FileUpload = ({ account, contract, provider }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("No file selected");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) return alert("Please select a file first.");
    if (!account || !contract || !provider) {
      return alert("Missing account, contract, or provider.");
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const resFile = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            pinata_api_key: "1dbbf7a2303f8621eab9",
            pinata_secret_api_key:
              "533e1e60828cf6c10ef4e8064ed101cfdf2a412b049904860bad949bcd501f00",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
      console.log("Image uploaded to IPFS:", ImgHash);

      const signer = provider.getSigner();
      const contractWithSigner = contract.connect(signer);

      const tx = await contractWithSigner.add(account, ImgHash);
      console.log("Transaction sent:", tx.hash);

      await tx.wait();
      console.log("Transaction confirmed.");

      alert("File uploaded and added to blockchain.");
      setFile(null);
      setFileName("No file selected");
      document.getElementById("inputFile").value = "";
    } catch (error) {
      console.error("Upload or contract error:", error);
      alert("Upload failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const retrieveData = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setFileName(selectedFile.name);
    console.log("File selected:", selectedFile.name);
  };

  return (
    <div className="p-4 border rounded-md bg-white dark:bg-[#111827] shadow">
      <form
        onSubmit={handleSubmit}
        className="flex flex-row flex-nowrap items-center gap-4 overflow-hidden"
      >
        {/* Hidden File Input */}
        <input
          disabled={!account}
          type="file"
          id="inputFile"
          className="hidden"
          onChange={retrieveData}
        />

        {/* Choose File Button */}
        <label
          htmlFor="inputFile"
          className={`px-4 py-2 text-sm font-semibold rounded bg-indigo-600 text-white cursor-pointer hover:bg-indigo-700 transition ${
            !account ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Choose File
        </label>

        {/* File Name Display */}
        <span className="text-sm font-mono text-gray-700 dark:text-gray-300 truncate max-w-[180px]">
          {fileName}
        </span>

        {/* Upload Button */}
        <button
          type="submit"
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded bg-green-600 hover:bg-green-700 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Uploading..." : "Upload"}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
