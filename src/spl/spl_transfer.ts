import { address, appendTransactionMessageInstructions, assertIsTransactionWithBlockhashLifetime, createKeyPairSignerFromBytes, createSolanaRpc, createSolanaRpcSubscriptions, createTransactionMessage, getSignatureFromTransaction, sendAndConfirmTransactionFactory, setTransactionMessageFeePayer, setTransactionMessageLifetimeUsingBlockhash, signAndSendTransactionMessageWithSigners, signTransactionMessageWithSigners } from "@solana/kit";
import wallet from "../../devnet_wallet.json";
import { findAssociatedTokenPda, getCreateAssociatedTokenInstruction, getCreateAssociatedTokenInstructionAsync, getTransferCheckedInstruction, TOKEN_PROGRAM_ADDRESS, tokenProgram } from "@solana-program/token";


const mint = address("BfjqkEKWfFXGvkQ1Php3iLuCWCWa9TpeV1bQ2Xto5QuG");

const rpc = createSolanaRpc(process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com");

const rpcSubscriptions = createSolanaRpcSubscriptions(process.env.SOLANA_WS_URL ?? "wss://api.devnet.solana.com");

const to = address("7sE3psJHPuEWjYyvNicq1ZmCDcHVqNBU4JRkmxGKZFGa");

(async()=>{
    const signer = await createKeyPairSignerFromBytes(
        new Uint8Array(wallet)
    );

    const sendAndConfirm = await sendAndConfirmTransactionFactory({
        rpc, rpcSubscriptions
    })

    const [fromATa] = await findAssociatedTokenPda({
        mint,
        owner : signer.address,
        tokenProgram : TOKEN_PROGRAM_ADDRESS
    })
    console.log(`fromATa : ${fromATa}`);
    
    const [toATa] = await findAssociatedTokenPda({
        mint,
        owner : to,
        tokenProgram : TOKEN_PROGRAM_ADDRESS
    });
    console.log(`toATa : ${toATa}`);

    const createAtaIx = await getCreateAssociatedTokenInstructionAsync({
        payer : signer,
        mint,
        owner : to
    });

    const transferToATa = await getTransferCheckedInstruction({
        source : fromATa,
        mint,
        destination : toATa,
        authority : signer,
        decimals : 6,
        amount : 1_000_000n,
    })

    const {value : latestBlockhash} = await rpc.getLatestBlockhash().send();

    const msg = createTransactionMessage({version : 0});

    const msgWithPayer = setTransactionMessageFeePayer(signer.address,msg);
    
    const msgWithLifeTime = setTransactionMessageLifetimeUsingBlockhash(
        latestBlockhash,
        msgWithPayer
    );

    const tx = appendTransactionMessageInstructions([createAtaIx,transferToATa],msgWithLifeTime);

    const signTx = await signTransactionMessageWithSigners(tx);
    assertIsTransactionWithBlockhashLifetime(signTx);
    const signature = getSignatureFromTransaction(signTx);
    await sendAndConfirm(signTx,{commitment : "confirmed"})

    console.log(`Signautre : ${signature}`)
})();
