# Solana SPL NFT

A TypeScript-based toolkit for working with Solana SPL tokens and NFTs — including initialization, minting, metadata management, and token transfers on the Solana blockchain.

---

## 📁 Project Structure

```
solana-spl-nft/
├── src/
│   └── spl/
│       ├── spl_init.ts          # Initialize SPL token mint
│       ├── spl_metadata.ts      # Attach on-chain metadata to tokens
│       ├── spl_mint.ts          # Mint tokens to an associated token account
│       └── spl_transfer.ts      # Transfer tokens between wallets
├── Screenshots/
│   ├── spl_init.png
│   ├── spl_metadata.png
│   ├── spl_mint.png
│   └── spl_transfer.png
├── pic/
├── .env                         # Environment variables (wallet keys, RPC URL)
├── devnet_wallet.json           # Devnet wallet keypair
├── spl-metadata.json            # Token metadata configuration
├── index.ts                     # Entry point
├── tsconfig.json
├── package.json
└── bun.lock
```

---

## ⚙️ Prerequisites

- [Bun](https://bun.sh/) (used as runtime & package manager)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools) (optional, for wallet management)
- A Solana devnet wallet with some SOL (use `solana airdrop 2` on devnet)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/siddharth-09/solana-spl-nft-ts.git
cd solana-spl-nft
```

### 2. Install dependencies

```bash
bun install
```

### 3. Configure environment

Create a `.env` file in the root directory:

```env
RPC_URL=https://api.devnet.solana.com
WALLET_PATH=./devnet_wallet.json
```

### 4. Set up your wallet

Place your Solana devnet keypair at `devnet_wallet.json`, or generate a new one:

```bash
solana-keygen new --outfile devnet_wallet.json
solana airdrop 2 --keypair devnet_wallet.json --url devnet
```

---

## 🛠️ Scripts

All scripts are run via `bun run`:

### Initialize a Token Mint

Creates a new SPL token mint on devnet.

```bash
bun run spl:init
# or
bun run src/spl/spl_init.ts
```

### Attach Metadata

Attaches on-chain metadata (name, symbol, URI) to the token using the Metaplex Token Metadata program.

```bash
bun run spl:metadata
# or
bun run src/spl/spl_metadata.ts
```

### Mint Tokens

Mints a specified amount of tokens to an associated token account (ATA).

```bash
bun run spl:mint
# or
bun run src/spl/spl_mint.ts
```

### Transfer Tokens

Transfers tokens from one wallet's ATA to another.

```bash
bun run spl:transfer
```

**Example output:**

```
fromATA : GAEic66KLtASaGYZatSPHvGfAaYdn23mV9o11vNqo6no
toATA   : EEYov4jAxTnA7KVBuSoUQAjMMuYLQnvdPEoZAwya6HGd
Signature : 2en3GXPLpf5QgxKMVABsua4EFawJ2yFdBytkV5MqRTpFMkCLZkpLczVN3CYUHc67R5mmrcULRDnA9rwn6LX61usG
```

---

## 🪙 Token Metadata

Configure your token's metadata in `spl-metadata.json`:

```json
{
  "name": "My SPL Token",
  "symbol": "MST",
  "uri": "https://arweave.net/your-metadata-uri"
}
```

---

## 📸 Screenshots

| Operation | Preview |
|-----------|---------|
| Init      | ![spl_init](Screenshots/spl_init.png) |
| Metadata  | ![spl_metadata](Screenshots/spl_metadata.png) |
| Mint      | ![spl_mint](Screenshots/spl_mint.png) |
| Transfer  | ![spl_transfer](Screenshots/spl_transfer.png) |

---

## 🔗 References

- [Solana Docs](https://docs.solana.com/)
- [SPL Token Program](https://spl.solana.com/token)
- [Metaplex Token Metadata](https://docs.metaplex.com/programs/token-metadata/overview)
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)

