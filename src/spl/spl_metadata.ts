/*

*/

import {  createSignerFromKeypair, publicKey, signerIdentity } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import wallet from "../../devnet_wallet.json";
// import { createKeyPairSignerFromBytes } from "@solana/kit";


const mint = publicKey("BfjqkEKWfFXGvkQ1Php3iLuCWCWa9TpeV1bQ2Xto5QuG");

const umi = createUmi(process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com");


const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));

const signer = createSignerFromKeypair(umi,keypair);
umi.use(signerIdentity(signer));

(async()=>{
    
})();