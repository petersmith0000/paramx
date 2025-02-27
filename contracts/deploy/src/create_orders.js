

import { execSync } from 'child_process';
import {getObjects, getSuiCoin, getMidnightGMTEpoch, getMapping, getFirstObject, extractPxType, getAllObjects} from './util.js';

async function limit_bid_pt(apy_rate, maturity_date) {
    const paramxPackageId = (await getObjects(`../move/paramx/publish.json`))['published'];
    const maturity_ms = getMidnightGMTEpoch(maturity_date);
    const epochTime_ms = Date.now();
    const annual_rate = apy_rate/(365*24*60*60*1000/(maturity_ms-epochTime_ms));
    const t_amount = 10000000000;
    const sui_amount = Math.round(t_amount/(annual_rate+1.0));
    const sui_coin = getSuiCoin(sui_amount);
    const type = 0; // PT
    // const t_amount = 10000000000;
    const command = `sui client call --package ${paramxPackageId} --module market --function limit_bid --args ${sui_coin} ${type} ${t_amount} ${maturity_ms} --json`;

    try {
        const data = execSync(command, { encoding: 'utf8' });
        return getMapping(data);
    } catch (error) {
        console.error(`Error: ${error}`);
        return null;
    }
}

async function limit_bid_yt(apy_rate, maturity_date) {
    const paramxPackageId = (await getObjects(`../move/paramx/publish.json`))['published'];
    const maturity_ms = getMidnightGMTEpoch(maturity_date); // 10 min from now
    const epochTime_ms = Date.now();
    const annual_rate = apy_rate/(365*24*60*60*1000/(maturity_ms-epochTime_ms));
    const t_amount = 10000000000;
    const sui_amount = Math.round(t_amount*annual_rate)

    const sui_coin = getSuiCoin(sui_amount);
    const type = 1; // YT
    
    const command = `sui client call --package ${paramxPackageId} --module market --function limit_bid --args ${sui_coin} ${type} ${t_amount} ${maturity_ms} --json`;
    
    try {
        const data = execSync(command, { encoding: 'utf8' });
        return getMapping(data);
    } catch (error) {
        console.error(`Error: ${error}`);
        return null;
    }
}

async function limit_offer_yt(apy_rate, maturity_date) {
    const paramxPackageId = (await getObjects(`../move/paramx/publish.json`))['published'];
    const tokens = getAllObjects(`${paramxPackageId}::yield_trading_protocol::PxToken`)
    let token;
    let type = 1; // YT
    for(const itoken of tokens) {
        if(extractPxType(itoken) == type){
            token = itoken;
            break;        
        }
    }
    const maturity_ms = getMidnightGMTEpoch(maturity_date); // 10 min from now
    const epochTime_ms = Date.now();

    const annual_rate = apy_rate/(365*24*60*60*1000/(maturity_ms-epochTime_ms));
    const t_amount = 10000000000;
    const sui_amount = Math.round(t_amount*annual_rate)
    

    const command = `sui client call --package ${paramxPackageId} --module market --function limit_offer --args ${token} ${sui_amount} --json`;

    try {
        const data = execSync(command, { encoding: 'utf8' });
        return getMapping(data);
    } catch (error) {
        console.error(`Error: ${error}`);
        return null;
    }
}

async function limit_offer_pt(apy_rate, maturity_date) {
    const paramxPackageId = (await getObjects(`../move/paramx/publish.json`))['published'];
    const tokens = getAllObjects(`${paramxPackageId}::yield_trading_protocol::PxToken`)
    let token;
    let type = 0; // PT
    for(const itoken of tokens) {
        if(extractPxType(itoken) == type){
            token = itoken;
            break;        
        }
    }


    const maturity_ms = getMidnightGMTEpoch(maturity_date); // 10 min from now
    const epochTime_ms = Date.now();
    const annual_rate = apy_rate/(365*24*60*60*1000/(maturity_ms-epochTime_ms));
    const t_amount = 10000000000;
    const sui_amount = Math.round(t_amount/(annual_rate+1.0));
    

    const command = `sui client call --package ${paramxPackageId} --module market --function limit_offer --args ${token} ${sui_amount} --json`;

    try {
        const data = execSync(command, { encoding: 'utf8' });
        return getMapping(data);
    } catch (error) {
        console.error(`Error: ${error}`);
        return null;
    }
}

async function main() {
    // (0.05,new Date(2025, 2, 31))
    console.log(await limit_bid_pt());
    console.log(await limit_bid_yt());

    console.log(await limit_offer_yt());
    console.log(await limit_offer_pt());
    
}


main();














// sui client call --package $PARAMX --module market --function limit_offer_yt --args $YTTOKEN $SUI_AMOUNT
// sui client call --package $PARAMX --module market --function limit_offer_pt --args $PTTOKEN $SUI_AMOUNT



