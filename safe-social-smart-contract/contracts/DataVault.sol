// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DataVault {
    struct FileRecord {
        string ipfsHash;
        string metaCid;
        address owner;
        uint256 createdAt;
    }
    struct AccessLogEntry {
        address accessor;
        uint256 timestamp;
    }
    mapping(bytes32 => FileRecord) private files;
    mapping(bytes32 => mapping(address => bool)) private accessList;
    mapping(bytes32 => mapping(address => string)) private encryptedKeys;
    mapping(address => bytes32[]) private ownerFiles;
    mapping(bytes32 => AccessLogEntry[]) private accessHistory;
    event FileRegistered(bytes32 indexed fileId, address indexed owner, string ipfsHash, string metaCid);
    event AccessGranted(bytes32 indexed fileId, address indexed receiver, string encryptedKey);
    event AccessRevoked(bytes32 indexed fileId, address indexed receiver);
    event Accessed(bytes32 indexed fileId, address indexed receiver, uint256 timestamp);

    function registerFile(bytes32 fileId, string calldata ipfsHash, string calldata metaCid) external {
        FileRecord storage rec = files[fileId];
        require(rec.owner == address(0), "File already exists");
        rec.ipfsHash = ipfsHash;
        rec.metaCid = metaCid;
        rec.owner = msg.sender;
        rec.createdAt = block.timestamp;
        ownerFiles[msg.sender].push(fileId);
        emit FileRegistered(fileId, msg.sender, ipfsHash, metaCid);
    }
    function grantAccess(bytes32 fileId, address receiver, string calldata encryptedKey) external {
        FileRecord storage rec = files[fileId];
        require(rec.owner == msg.sender, "Not owner");
        accessList[fileId][receiver] = true;
        encryptedKeys[fileId][receiver] = encryptedKey;
        emit AccessGranted(fileId, receiver, encryptedKey);
    }
    
    // Allow PostRegistry to grant access on behalf of file owner
    function grantAccessByRegistry(bytes32 fileId, address receiver, string calldata encryptedKey, address fileOwner) external {
        FileRecord storage rec = files[fileId];
        require(rec.owner == fileOwner, "Not file owner");
        accessList[fileId][receiver] = true;
        encryptedKeys[fileId][receiver] = encryptedKey;
        emit AccessGranted(fileId, receiver, encryptedKey);
    }
    function revokeAccess(bytes32 fileId, address receiver) external {
        FileRecord storage rec = files[fileId];
        require(rec.owner == msg.sender, "Not owner");
        require(accessList[fileId][receiver], "Access not granted");
        accessList[fileId][receiver] = false;
        delete encryptedKeys[fileId][receiver];
        emit AccessRevoked(fileId, receiver);
    }
    function checkAccess(bytes32 fileId, address user) public view returns (bool) {
        FileRecord storage rec = files[fileId];
        if (rec.owner == user) return true;
        return accessList[fileId][user];
    }
    function getFile(bytes32 fileId) external returns (string memory) {
        require(checkAccess(fileId, msg.sender), "Access denied");
        accessHistory[fileId].push(AccessLogEntry(msg.sender, block.timestamp));
        emit Accessed(fileId, msg.sender, block.timestamp);
        return files[fileId].ipfsHash;
    }
    function getEncryptedKey(bytes32 fileId, address requester) external view returns (string memory) {
        require(checkAccess(fileId, msg.sender), "Access denied");
        return encryptedKeys[fileId][requester];
    }
    function getFilesByOwner(address owner, uint256 start, uint256 limit) external view returns (
        bytes32[] memory fileIds,
        string[] memory ipfsHashes,
        string[] memory metaCids,
        uint256[] memory createdAts
    ) {
        bytes32[] storage all = ownerFiles[owner];
        uint256 total = all.length;
        if (start >= total) {
            return (new bytes32[](0), new string[](0), new string[](0), new uint256[](0));
        }
        uint256 end = start + limit;
        if (end > total) end = total;
        uint256 outLen = end - start;
        fileIds = new bytes32[](outLen);
        ipfsHashes = new string[](outLen);
        metaCids = new string[](outLen);
        createdAts = new uint256[](outLen);
        for (uint256 i = 0; i < outLen; i++) {
            bytes32 id = all[start + i];
            FileRecord storage rec = files[id];
            fileIds[i] = id;
            ipfsHashes[i] = rec.ipfsHash;
            metaCids[i] = rec.metaCid;
            createdAts[i] = rec.createdAt;
        }
        return (fileIds, ipfsHashes, metaCids, createdAts);
    }
    function getAccessHistoryLength(bytes32 fileId) external view returns (uint256) {
        return accessHistory[fileId].length;
    }
    function getAccessHistory(bytes32 fileId, uint256 start, uint256 limit) external view returns (
        address[] memory accessors, uint256[] memory timestamps
    ) {
        AccessLogEntry[] storage logs = accessHistory[fileId];
        uint256 total = logs.length;
        if (start >= total) {
            return (new address[](0), new uint256[](0));
        }
        uint256 end = start + limit;
        if (end > total) end = total;
        uint256 outLen = end - start;
        accessors = new address[](outLen);
        timestamps = new uint256[](outLen);
        for (uint256 i = 0; i < outLen; i++) {
            accessors[i] = logs[start + i].accessor;
            timestamps[i] = logs[start + i].timestamp;
        }
        return (accessors, timestamps);
    }
    
    // Debug function to check file info
    function getFileInfo(bytes32 fileId) external view returns (
        string memory ipfsHash,
        string memory metaCid,
        address owner,
        uint256 createdAt
    ) {
        FileRecord storage rec = files[fileId];
        return (rec.ipfsHash, rec.metaCid, rec.owner, rec.createdAt);
    }
}
