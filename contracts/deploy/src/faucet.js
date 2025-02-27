// import { getFaucetHost, requestSuiFromFaucetV0 } from '@mysten/sui/faucet';
// import dotenv from "dotenv";

// dotenv.config();

// async function requestFunds() {
//     await requestSuiFromFaucetV0({
//         host: getFaucetHost("testnet"),
//         recipient: process.env.LOCAL_ADDRESS ?? "0x0",
//     });
// }

// requestFunds();


import { execSync } from 'child_process';

const command = 'sui client faucet'
// ls ../move/volo_local
try {
    const output = execSync(command, { encoding: 'utf8' });
    console.log(output);
} catch (error) {
    console.error(`Error: ${error}`);
}