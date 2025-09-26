// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Upload {
    struct Access {
        address user;
        bool access; // true or false
    }

    mapping(address => string[]) values;
    mapping(address => Access[]) accessList;
    mapping(address => mapping(address => bool)) ownership;
    mapping(address => mapping(address => bool)) previousState;

    // 🔥 New: Store access requests
    mapping(address => address[]) public requests;

    // Add a new file to a user's storage
    function add(address _user, string memory url) external {
        values[_user].push(url);
    }

    // View someone's files if you have access
    function display(address _user) external view returns (string[] memory) {
        require(
            _user == msg.sender || ownership[_user][msg.sender],
            "You don't have access"
        );
        return values[_user];
    }

    // Grant access to a user
    function allow(address user) external {
        ownership[msg.sender][user] = true;

        if (previousState[msg.sender][user]) {
            for (uint i = 0; i < accessList[msg.sender].length; i++) {
                if (accessList[msg.sender][i].user == user) {
                    accessList[msg.sender][i].access = true;
                }
            }
        } else {
            accessList[msg.sender].push(Access(user, true));
            previousState[msg.sender][user] = true;
        }

        // 🔥 Remove from request list after approval
        address[] storage userRequests = requests[msg.sender];
        for (uint i = 0; i < userRequests.length; i++) {
            if (userRequests[i] == user) {
                userRequests[i] = userRequests[userRequests.length - 1];
                userRequests.pop();
                break;
            }
        }
    }

    // Revoke access from a user
    function disallow(address user) public {
        ownership[msg.sender][user] = false;

        for (uint i = 0; i < accessList[msg.sender].length; i++) {
            if (accessList[msg.sender][i].user == user) {
                accessList[msg.sender][i].access = false;
            }
        }
    }

    // View all accounts current user has granted access to
    function shareAccess() public view returns (Access[] memory) {
        return accessList[msg.sender];
    }

    // 🔥 Request access from another user
    function requestAccess(address _owner) external {
        require(_owner != msg.sender, "Can't request access from yourself");

        // prevent duplicate requests
        address[] storage userRequests = requests[_owner];
        for (uint i = 0; i < userRequests.length; i++) {
            require(userRequests[i] != msg.sender, "Request already sent");
        }

        userRequests.push(msg.sender);
    }

    // 🔥 View requests sent to me
    function viewRequests() public view returns (address[] memory) {
        return requests[msg.sender];
    }
}
