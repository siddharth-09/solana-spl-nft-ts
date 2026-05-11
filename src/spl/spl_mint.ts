import { publicKey } from "@metaplex-foundation/umi";
import { address, appendTransactionMessageInstructions, assertIsTransactionMessageWithBlockhashLifetime, assertIsTransactionWithBlockhashLifetime, createKeyPairSignerFromBytes, createSolanaRpc, createSolanaRpcSubscriptions, createTransactionMessage, getSignatureFromTransaction, sendAndConfirmTransactionFactory, setTransactionMessageFeePayerSigner, setTransactionMessageLifetimeUsingBlockhash, signAndSendTransactionMessageWithSigners, signTransactionMessageWithSigners,  } from "@solana/kit";
import wallet from '../../devnet_wallet.json';
import { findAssociatedTokenPda, getCreateAssociatedTokenInstructionAsync, getMintToInstruction, TOKEN_PROGRAM_ADDRESS } from "@solana-program/token";

const rpc = createSolanaRpc(process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com");
const rpcSubscriptions = createSolanaRpcSubscriptions(process.env.SOLANA_WS_URL ?? "wss://api.devnet.solana.com");

const mint = address("BfjqkEKWfFXGvkQ1Php3iLuCWCWa9TpeV1bQ2Xto5QuG");
const token_decimal = 1_000_000n;
(async () =>{
    const signer = await createKeyPairSignerFromBytes(
        new Uint8Array(wallet)
    );

    const [ata] = await findAssociatedTokenPda(
        {
            mint,
            owner : signer.address,
            tokenProgram : TOKEN_PROGRAM_ADDRESS
        }
    )

    console.log(`${[ata]}`);

    const mintToIx = getMintToInstruction({
        mint,
        token: ata,
        mintAuthority: signer,
        amount: 1n * token_decimal
    });
    // console.log(`minttx = ${mintToIx.accounts[1].address}`);

    const createAtaIx = await getCreateAssociatedTokenInstructionAsync({
        payer: signer,
        mint,
        owner: signer.address
    });

    const {value: latestBlockhash} = await rpc.getLatestBlockhash().send();
    
    const msg = createTransactionMessage({version:0});
    const msgWithPayer = setTransactionMessageFeePayerSigner(signer,msg);

    const msgWithLifeTime = setTransactionMessageLifetimeUsingBlockhash(
        latestBlockhash,
        msgWithPayer
    )
    //remove createAtaIx when minting again cause it will again create ata error will popup due to exisitng ata
    const tx = appendTransactionMessageInstructions([createAtaIx,mintToIx],msgWithLifeTime);

    const signTx = await signTransactionMessageWithSigners(tx);
    assertIsTransactionWithBlockhashLifetime(signTx);
    const signature = getSignatureFromTransaction(signTx);

    const sendAndConfirm = sendAndConfirmTransactionFactory({
        rpc,rpcSubscriptions
    });

    await sendAndConfirm(signTx, {commitment: "confirmed"});

    console.log(`Mint Signature : ${signature} `);

})();