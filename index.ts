import { SDK, Auth, TEMPLATES } from "@infura/sdk";
import { config as loadEnv } from "dotenv";

loadEnv();

(async () => {
  console.log("Wallet address:", process.env.WALLET_PUBLIC_ADDRESS);
  //  -------- SDK Setup ---------
  const acc = new Auth({
    privateKey: process.env.WALLET_PRIVATE_KEY,
    projectId: process.env.INFURA_PROJECT_ID,
    secretId: process.env.INFURA_PROJECT_SECRET,
    rpcUrl: process.env.EVM_RPC_URL,
    chainId: 5,
  });

  const sdk = new SDK(acc);

  // ------- Deploy a new contract --------
  const newContract = await sdk.deploy({
    template: TEMPLATES.ERC721Mintable,
    params: {
      name: "myContract",
      symbol: "TOC",
      contractURI: "ipfs:/Qmdb5PC8RLvx7pVs5EF8iCWKSQpDsbw8TRiuosN18jRJX8",
    },
  });

  console.log("contract address: \n", newContract.contractAddress);

  // ---------- Mint a NFT1 --------------
  const nft1 = await newContract.mint({
    publicAddress:
      process.env.WALLET_PUBLIC_ADDRESS ??
      "0x3bE0Ec232d2D9B3912dE6f1ff941CB499db4eCe7",
    tokenURI: "ipfs://QmUrDwbA9XBvhRsc5LDQUz3pxEHypUESNy6jxLXw1UgaTS",
  });

  const minted_nft1 = await nft1.wait();
  console.log("Mint nft1 TX Status", minted_nft1.status);

  // --------- Mint a NFT2 -----------------
  const nft2 = await newContract.mint({
    publicAddress:
      process.env.WALLET_PUBLIC_ADDRESS ??
      "0x3bE0Ec232d2D9B3912dE6f1ff941CB499db4eCe7",
    tokenURI: "ipfs://QmUrDwbA9XBvhRsc5LDQUz3pxEHypUESNy6jxLXw1UgaTS",
  });

  const minted_nft2 = await nft2.wait();
  console.log("Mint nft2 TX Status", minted_nft2.status);

  // --------- Transfer NFT1 ---------------
  const txHash = await newContract.baseERC721.transfer({
    from:
      process.env.WALLET_PUBLIC_ADDRESS ??
      "0x3bE0Ec232d2D9B3912dE6f1ff941CB499db4eCe7",
    to: "0x1eb754DD7d3D5469a78967e83AA477e27B83e4ED",
    tokenId: 1,
  });

  const tx = await txHash.wait();

  console.log("Transfer NFT1 Tx Status:", tx.status);
})();
