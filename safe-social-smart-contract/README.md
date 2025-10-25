# SafeSocial Smart Contracts

## Overview
This repo implements the core secure data registry and post system for SafeSocial, designed to support NIST/ISO-aligned, privacy-compliant data storage and sharing on the BlockDAG blockchain. The architecture uses two primary smart contracts:

- `DataVault.sol`: Secure per-file registry and access control for encrypted content (IPFS, Pinata, etc). Only owner and explicitly authorized users (wallets) can access associated decryption keys and IPFS hashes.
- `PostRegistry.sol`: Social-media style post registry, where each post references a securely registered file in DataVault, allowing for paid, public/private, and subscriber-only posts.

## Key Features
- **Zero trust**: All sensitive content is encrypted off-chain before upload; smart contracts only store IPFS hashes/cids and encrypted keys.
- **Per-wallet granular access**: Data owners can grant/revoke file access to individual wallet addresses.
- **Event logs/audit trails**: Every access/grant is recorded for compliance.
- **Post monetization and access**: Onchain post creation, per-post pricing, and access control via subscriptions or DataVault sharing logic.
- **Compliance-ready**: Designed to meet technical requirements for NIST/ISO/cybersecurity standards (data minimization, access audit, explicit consent).

---

## Contract Architecture

### DataVault.sol
Manages onchain file registration and access:
- `registerFile(bytes32 fileId, string ipfsHash, string metaCid)`: Registers an encrypted file to a user's wallet, stores IPFS/content hash.
- `grantAccess(bytes32 fileId, address receiver, string encryptedKey)`: Owner grants a recipient access to the key for a file.
- `revokeAccess(bytes32 fileId, address receiver)`: Owner revokes access.
- `checkAccess(bytes32 fileId, address user)`: True if user is owner or access granted.
- `getFile(fileId)`: Returns IPFS hash if access, logs access event.
- `getEncryptedKey(fileId, requester)`: Returns encrypted key for requester if permitted.
- `getAccessHistory(fileId, start, limit)`: Returns access logs for auditing.

### PostRegistry.sol
Creates posts that reference DataVault files:
- `createPost(bytes32 fileId, string description, uint256 price, bool isPublic)`: Onchain social/content post; only fileId (no raw data) stored.
- `setSubscriptionDetails(price, duration)`: Creators set paid subscription parameters.
- `subscribe(creator)`: User pays to subscribe, gets access to posts per subs logic.
- `canUserAccessPost(postId, user)`: Checks full access logic (public, owner, subscription, DataVault sharing).
- `updatePostContent(postId, newFileId)`: Post owner can update post's file.

## Quickstart
1. **Deploy DataVault**, then **deploy PostRegistry** with DataVault's address.
2. Encrypt content client-side, upload to IPFS/Pinata.
3. Register file with DataVault to generate onchain reference/fileId.
4. Call PostRegistry to create a post referencing the fileId (add price, access parameters as desired).
5. Optionally, subscribe/pay for access via PostRegistry and be granted access in DataVault.
6. Only explicitly authorized wallets can access file keys/data, supporting secure use in any sector (health, legal, social, etc).

## Testing
- Run `npx hardhat test` to execute a comprehensive test suite for both contracts (covers registration, posts, paid access, edge cases, granularity of access, and audit log).

## Security Architecture / Compliance Notes
- All files must be encrypted before upload. Contracts never see plaintext or decryption keys.
- On-chain access control logs and per-user key grants satisfy audit and explicit consent requirements aligned with NIST 800-53, ISO 27001, and sector policies.
- Fast extensibility for "emergency override" or org-governed access via future upgrades (multi-sig, authority smart contracts, etc).

## License
MIT
