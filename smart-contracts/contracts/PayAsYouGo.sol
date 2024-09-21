// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/// @title Pay-As-You-Go Electricity dApp
/// @notice This contract enables users to top up electricity credits and IoT meters to deduct credits based on electricity usage.
/// @dev The contract is designed for the Arbitrum network for low transaction fees. Custom errors are used for optimized gas consumption.

contract  PayAsYouGoElectricity{
    // Custom errors for efficient gas usage
    error Unauthorized();
    error InsufficientBalance(uint256 available, uint256 required);
    error InvalidAmount();
    error TopUpFailed();
    error MeterNotRegistered();
    error AlreadyRegistered();

    /// @notice The owner of the contract (deployer)
    address public owner;
    
    /// @notice Stores user details including balance and registration status
    struct User {
        uint256 balance; // Electricity credits in tokens
        bool isRegistered;
    }
    
    // Mapping of user addresses to their data (balance and registration status)
    mapping(address => User) public users;
    
    // Mapping of registered IoT meters
    mapping(address => bool) public registeredMeters;

    // Events to track top-ups and electricity usage
    event TopUp(address indexed user, uint256 amount);
    event ElectricityUsed(address indexed user, uint256 amount);

    /// @dev Contract constructor, sets the deployer as the contract owner.
    constructor() {
        owner = msg.sender;
    }

    /// @notice Registers a new user to the system
    /// @dev Only the contract owner can register users
    /// @param _user The address of the user to register
    function registerUser(address _user) external {
        _onlyOwner();
        if (users[_user].isRegistered) revert AlreadyRegistered();
        users[_user] = User({balance: 0, isRegistered: true});
    }

    /// @notice Registers a new IoT meter to the system
    /// @dev Only the contract owner can register IoT meters
    /// @param _meter The address of the IoT meter to register
    function registerMeter(address _meter) external {
        _onlyOwner();
        if (registeredMeters[_meter]) revert AlreadyRegistered();
        registeredMeters[_meter] = true;
    }

    /// @notice Allows registered users to top up their electricity credits
    /// @dev The amount sent with the transaction is added to the user's balance
    function topUp() external payable {
        _onlyRegisteredUser();
        if (msg.value == 0) revert InvalidAmount();
        users[msg.sender].balance += msg.value;
        emit TopUp(msg.sender, msg.value);
    }

    /// @notice Deducts electricity credits based on usage reported by IoT meters
    /// @dev Only registered meters can call this function to deduct a user's credits
    /// @param _user The address of the user whose credits are to be deducted
    /// @param _amount The amount of electricity credits to be deducted
    function useElectricity(address _user, uint256 _amount) external {
        _onlyRegisteredMeter();
        User storage user = users[_user];
        if (user.balance < _amount) revert InsufficientBalance(user.balance, _amount);
        user.balance -= _amount;
        emit ElectricityUsed(_user, _amount);
    }

    /// @notice Allows the contract owner to withdraw all contract funds
    /// @dev Only the contract owner can call this function
    function withdraw() external {
        _onlyOwner();
        (bool success, ) = owner.call{value: address(this).balance}("");
        if (!success) revert TopUpFailed();
    }

    /// @dev Internal function to check if the caller is the owner
    function _onlyOwner() private view {
        if (msg.sender != owner) revert Unauthorized();
    }

    /// @dev Internal function to check if the caller is a registered user
    function _onlyRegisteredUser() private view {
        if (!users[msg.sender].isRegistered) revert Unauthorized();
    }

    /// @dev Internal function to check if the caller is a registered IoT meter
    function _onlyRegisteredMeter() private view {
        if (!registeredMeters[msg.sender]) revert MeterNotRegistered();
    }
}