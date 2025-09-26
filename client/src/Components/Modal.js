import React, { useEffect, useState } from 'react';
import ReqInput from './ReqInput';
import Table from './Table';

const Modal = ({ account, contract }) => {
  const [access, setAccess] = useState([]);
  const [requests, setRequests] = useState([]); // 🔥 New: access requests

  // Grant access
  const share = async (address) => {
    await contract.allow(address);
    console.log(`Access granted to ${address}`);
    fetchRequests(); // refresh after approval
  };

  // Fetch who you've shared access with
  useEffect(() => {
    const sharedAccounts = async () => {
      const data = await contract.shareAccess();
      const newAccessElement = [];

      for (let i = 0; i < data.length; i++) {
        if (data[i].access === true) {
          let element = data[i].user;
          if (!newAccessElement.includes(element)) {
            newAccessElement.push(element);
          }
        }
      }

      setAccess(newAccessElement);
    };

    account && sharedAccounts();
  }, [account]);

  // 🔥 Fetch requests made to this account
  const fetchRequests = async () => {
    try {
      const req = await contract.viewRequests();
      setRequests(req);
    } catch (err) {
      console.error("Error fetching requests", err);
    }
  };

  useEffect(() => {
    account && fetchRequests();
  }, [account]);

  return (
    <div>
      <div className='flex justify-center border border-r-0 border-l-0 border-gray-900 bg-gray-900'>
        <h2 className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl dark:text-white">
          <span className="text-gray-100 dark:text-gray-100 mt-1">Share</span>
        </h2>
      </div>

      {/* Requesting access input */}
      <ReqInput account={account} />

      {/* View who you've shared with */}
      <Table account={account} contract={contract} />

      {/* 🔥 Show access requests */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Incoming Access Requests</h3>
        {requests.length === 0 ? (
          <p className="text-sm text-gray-500">No pending requests</p>
        ) : (
          <ul className="space-y-3">
            {requests.map((addr, index) => (
              <li key={index} className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                <span className="font-mono text-sm">{addr}</span>
                <button
                  onClick={() => share(addr)}
                  className="px-4 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Approve
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Modal;
