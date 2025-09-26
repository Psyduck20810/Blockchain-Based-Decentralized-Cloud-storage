import React, { useState, useEffect } from 'react';

export default function ReqInput(props) {
  const [requester, setRequester] = useState(props.account);
  const [requested, setRequested] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRequester(props.account);
  }, [props.account]);

  const handleSubmit = async () => {
    if (requested.toLowerCase() === requester.toLowerCase()) {
      alert('You cannot request access to your own account');
      setRequested('');
      return;
    }

    if (!requested) {
      alert('Please enter an address');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/writePending', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requester,
          requested
        })
      });

      const result = await response.json();

      if (response.ok) {
        alert('Access request sent!');
        if (props.onRequestSent) props.onRequestSent(); // optional parent callback
      } else {
        alert(result.message || 'Failed to send request');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while sending the request.');
    } finally {
      setLoading(false);
      setRequested('');
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter Address"
        value={requested}
        onChange={(e) => setRequested(e.target.value)}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm mt-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className={`inline-flex items-center mt-2 rounded-md px-3 mx-3 py-2 text-sm font-semibold text-white ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-black hover:bg-black/80'}`}
      >
        {loading ? 'Requesting...' : 'Request Access'}
        {!loading && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-2 h-4 w-4"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        )}
      </button>
    </div>
  );
}
