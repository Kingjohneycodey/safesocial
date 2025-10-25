// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IDataVault {
    function grantAccess(bytes32 fileId, address receiver, string calldata encryptedKey) external;
    function grantAccessByRegistry(bytes32 fileId, address receiver, string calldata encryptedKey, address fileOwner) external;
    function revokeAccess(bytes32 fileId, address receiver) external;
    function checkAccess(bytes32 fileId, address user) external view returns (bool);
}

contract PostRegistry {
    uint256 public nextPostId;
    IDataVault public dataVault;

    struct Post {
        address owner;
        string description;
        bytes32 fileId;
        uint256 price; // new field
        bool isPublic;
        uint64 createdAt;
        uint64 updatedAt;
        bool exists;
    }

    struct Creator {
        uint256 subscriptionPrice;
        uint32 subscriptionDuration;
    }

    mapping(uint256 => Post) public posts;
    mapping(address => Creator) public creators;
    mapping(address => mapping(address => uint256)) public subscriptions;

    event PostCreated(uint256 indexed postId, address indexed owner, bytes32 fileId, uint256 price, bool isPublic, uint64 createdAt);
    event PostUpdated(uint256 indexed postId, address indexed owner, bytes32 fileId, uint64 updatedAt);
    event CreatorUpdated(address indexed creator, uint256 price, uint32 duration);
    event NewSubscription(address indexed creator, address indexed subscriber, uint256 expiresAt);
    event AccessRequested(uint256 indexed postId, address indexed requester, uint256 amount, uint256 timestamp);

    modifier onlyPostOwner(uint256 postId) {
        require(posts[postId].owner == msg.sender, "Caller is not the owner");
        require(posts[postId].exists, "Post does not exist");
        _;
    }

    constructor(address dataVaultAddress) {
        dataVault = IDataVault(dataVaultAddress);
    }

    function setSubscriptionDetails(uint256 price, uint32 duration) external {
        creators[msg.sender] = Creator(price, duration);
        emit CreatorUpdated(msg.sender, price, duration);
    }

    function subscribe(address creator) external payable {
        Creator memory c = creators[creator];
        require(c.subscriptionPrice > 0, "This creator does not offer subscriptions");
        require(msg.value == c.subscriptionPrice, "Incorrect subscription fee paid");
        uint256 currentSubscriptionEnd = subscriptions[creator][msg.sender];
        uint256 newExpiry;
        if (currentSubscriptionEnd < block.timestamp) {
            newExpiry = block.timestamp + c.subscriptionDuration;
        } else {
            newExpiry = currentSubscriptionEnd + c.subscriptionDuration;
        }
        subscriptions[creator][msg.sender] = newExpiry;

        (bool success, ) = creator.call{value: msg.value}("");
        require(success, "Failed to send payment to creator");
        emit NewSubscription(creator, msg.sender, newExpiry);
    }

    function isSubscribed(address creator, address user) public view returns (bool) {
        return subscriptions[creator][user] >= block.timestamp;
    }

    function createPost(bytes32 fileId, string calldata description, uint256 price, bool isPublic) external returns (uint256) {
        nextPostId++;
        uint256 postId = nextPostId;
        uint64 currentTime = uint64(block.timestamp);
        posts[postId] = Post({
            owner: msg.sender,
            description: description,
            fileId: fileId,
            price: price,
            isPublic: isPublic,
            createdAt: currentTime,
            updatedAt: currentTime,
            exists: true
        });
        emit PostCreated(postId, msg.sender, fileId, price, isPublic, currentTime);
        return postId;
    }

    function updatePostContent(uint256 postId, bytes32 newFileId) external onlyPostOwner(postId) {
        uint64 currentTime = uint64(block.timestamp);
        posts[postId].fileId = newFileId;
        posts[postId].updatedAt = currentTime;
        emit PostUpdated(postId, msg.sender, newFileId, currentTime);
    }

    function getPost(uint256 postId) external view returns (Post memory) {
        return posts[postId];
    }

    // Integrated permission check
    function canUserAccessPost(uint256 postId, address user) public view returns (bool) {
        Post storage post = posts[postId];
        if (!post.exists) return false;
        if (post.isPublic) return true;
        if (post.owner == user) return true;
        if (isSubscribed(post.owner, user)) return true;
        return dataVault.checkAccess(post.fileId, user);
    }

    // Payment + Access: for paid posts, allow atomic pay-to-unlock
    function payAndGrantAccess(uint256 postId, string calldata encryptedKey) external payable {
        Post storage post = posts[postId];
        require(post.exists, "Post does not exist");
        require(!post.isPublic, "Post is public");
        require(msg.sender != post.owner, "Owner doesn't pay");
        require(!canUserAccessPost(postId, msg.sender), "Already has access");
        require(post.price > 0, "Post is not paid");
        require(msg.value == post.price, "Incorrect payment amount");
        
        // Transfer payment to post owner
        (bool sent, ) = post.owner.call{value: msg.value}("");
        require(sent, "Payment transfer failed");
        
        // Grant DataVault access using the new function
        dataVault.grantAccessByRegistry(post.fileId, msg.sender, encryptedKey, post.owner);
        
        // Emit event for access request tracking
        emit AccessRequested(postId, msg.sender, msg.value, block.timestamp);
    }
}
