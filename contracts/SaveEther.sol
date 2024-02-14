// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SaveEther {
    mapping(address => uint256) savings;

    event SavingSuccessful(address indexed user, uint256 indexed amount);

    function deposit() external payable {
        require(msg.sender != address(0), "wrong account");

        require(msg.value > 0, "This amount is too small");

        savings[msg.sender] = savings[msg.sender] + msg.value;

        emit SavingSuccessful(msg.sender, msg.value);
    }

    function witwhdraw() external {
        require(msg.sender != address(0), "wrong account");

        uint256 _userSavings = savings[msg.sender];

        require(_userSavings > 0, "You do not have nough balance");

        savings[msg.sender] -= _userSavings;

        payable(msg.sender).transfer(_userSavings);
    }

    function checkSavings(address _user) external view returns (uint256) {
        return savings[_user];
    }

    function sendOutEther(address _reciever, uint256 _amount) external {
        require(msg.sender != address(0), "wrong account");

        require(_amount > 0, "Insufficient balance");

        require(savings[msg.sender] >= _amount);

        savings[msg.sender] = savings[msg.sender] - _amount;

        payable(_reciever).transfer(_amount);
    }

    function checkBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
