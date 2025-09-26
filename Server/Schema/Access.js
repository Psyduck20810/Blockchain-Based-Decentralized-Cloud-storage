// access.js

// Function to create a new access request object
function createAccessRequest({ requester, requested, fileHash }) {
  if (!requester || !requested || !fileHash) {
    throw new Error("Missing required fields: requester, requested, or fileHash");
  }

  return {
    requester: requester.toLowerCase(),
    requested: requested.toLowerCase(),
    accessGranted: false,
    fileHash,
    timestamp: new Date().toISOString(),
    status: 'pending'
  };
}

// Function to detect duplicate access requests
function isDuplicateRequest(existingRequests = [], newRequest) {
  return existingRequests.some(req =>
    req.requester === newRequest.requester &&
    req.requested === newRequest.requested &&
    req.fileHash === newRequest.fileHash
  );
}

module.exports = {
  createAccessRequest,
  isDuplicateRequest
};
