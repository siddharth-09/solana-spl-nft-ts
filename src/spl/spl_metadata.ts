/*

*/
import bs58 from 'bs58';
import {  createSignerFromKeypair, publicKey, signerIdentity } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import wallet from "../../devnet_wallet.json";
import { createMetadataAccountV3, type CreateMetadataAccountV3InstructionAccounts, type CreateMetadataAccountV3InstructionArgs, type DataV2Args } from "@metaplex-foundation/mpl-token-metadata";
import { base58 } from "@metaplex-foundation/umi/serializers";
// import { createKeyPairSignerFromBytes } from "@solana/kit";


const mint = publicKey("BfjqkEKWfFXGvkQ1Php3iLuCWCWa9TpeV1bQ2Xto5QuG");

const umi = createUmi(process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com");


const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));

const signer = createSignerFromKeypair(umi,keypair);
umi.use(signerIdentity(signer));

(async()=>{
    const accounts : CreateMetadataAccountV3InstructionAccounts = {
        mint,
        mintAuthority : signer
    }

    const data: DataV2Args = {
            name: "ShinChan",
            symbol: "BURI-BURI",
            uri: "https://scarlet-impressed-macaw-700.mypinata.cloud/ipfs/bafkreigbvcys6ncj77tyn2rhtfxfomakezkkk5d4okc3dij25rgsf7qzgu",
            sellerFeeBasisPoints: 1,
            creators: null,
            collection: null,
            uses: null
        };
    
    const args : CreateMetadataAccountV3InstructionArgs = {
        data,
        isMutable : true,
        collectionDetails : null
    };

    const tx = createMetadataAccountV3(umi,{
        ...accounts,
        ...args
    });

    const result = await tx.sendAndConfirm(umi);

    console.log("Signature : " , bs58.encode(Buffer.from(result.signature)));
})();