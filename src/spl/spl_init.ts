/*
    the flow of spl initialize 
    We initialize a empty account and attach mint to it 
    1) create empty solana account 

    2) pay rent and give space( getMintSize() ) in it 

    3) now create a empty message container (msg) : createTransactionMessage() verison:0 ('legacy' | 0 | 1)

    4) attach signer with message container who will pay the fee msgWithPayer: setTransactionMessageFeePayerSigner(signer, msg);

    5) attach latestBlockhash and msgWithPayer (messageWithLifetime) : setTransactionMessageLifetimeUsingBlockhash(latestBlockhash and msgWithPayer);

    6) now append the append instructions in tx :  appendTransactionMessageInstructions([],messageWithLifetime);

    7) Sign the tx : signTransactionMessageWithSigners(tx)
    8) assertIsTransactionWithBlockhashLifetime(signTx);

    9) get signature from tx : getSignatureFromTransaction(signTx)
    10) send and confirm (signTx);

*/

import { appendTransactionMessageInstructions, assertIsTransactionWithBlockhashLifetime, createKeyPairSignerFromBytes, createSolanaRpc, createSolanaRpcSubscriptions, createTransactionMessage, generateKeyPairSigner, getSignatureFromTransaction, sendAndConfirmTransactionFactory, setTransactionMessageFeePayerSigner, setTransactionMessageLifetimeUsingBlockhash, signTransactionMessageWithSigners } from "@solana/kit";
import wallet from "../../devnet_wallet.json";
import { getInitializeMintInstruction, getMintSize, TOKEN_PROGRAM_ADDRESS, tokenProgram } from "@solana-program/token";
import { getCreateAccountInstruction } from "@solana-program/system";

const rpc = createSolanaRpc(process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com");
const rpcSubscriptions = createSolanaRpcSubscriptions(process.env.SOLANA_WS_URL ?? "wss://api.devnet.solana.com");

(async ()=> {
    const signer = await createKeyPairSignerFromBytes(
        new Uint8Array(wallet)
    );
    // console.log( (await rpc.getBalance(signer.address).send()).value);

    const mint = await generateKeyPairSigner();
    const space = BigInt(getMintSize());

    //recent blockhash value
    const {value : latestBlockhash }  = await rpc.getLatestBlockhash().send();


    
    //helper functions : returns a function that helps sending block based tx to network and wait for confirmation 
    const sendAndConfirm = sendAndConfirmTransactionFactory({
        rpc,rpcSubscriptions
    });

    //empty message container
    const msg = createTransactionMessage({version:0});
    // console.log(msg);

    //message fee payer
    const messageWithPayer = setTransactionMessageFeePayerSigner(signer,msg); 

    //message lifetime 
    const messageWithLifetime = setTransactionMessageLifetimeUsingBlockhash(latestBlockhash,messageWithPayer);


    //rent 
    const rent = await rpc.getMinimumBalanceForRentExemption(space).send();

    //append instructions in tx 
    const txMessage = appendTransactionMessageInstructions([
        getCreateAccountInstruction({
            payer : signer,
            programAddress : TOKEN_PROGRAM_ADDRESS,
            newAccount : mint,
            lamports : rent,
            space
        }),

        getInitializeMintInstruction({
            mint : mint.address,
            decimals : 6,
            mintAuthority : signer.address
        })
    ],
    messageWithLifetime);

    const signedTx = await signTransactionMessageWithSigners(txMessage);
    assertIsTransactionWithBlockhashLifetime(signedTx);

    const signature = getSignatureFromTransaction(signedTx);

    await sendAndConfirm(signedTx,{commitment : "confirmed"})
    console.log(`Mint Address ${mint.address}. TranscationSignature : ${signature}`);

})();