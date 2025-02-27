

import { execSync } from 'child_process';
import {getObjects, getSuiCoin, getMidnightGMTEpoch, getMapping, getFirstObject} from './util.js';


// sui client call --package $PARAMX --module market --function close_bid_pt --args $ORDER $PTTOKEN 
// sui client call --package $PARAMX --module market --function close_bid_yt --args $ORDER $YTTOKEN


// sui client call --package $PARAMX --module market --function close_offer_yt --args $ORDER $SUI_COIN
// sui client call --package $PARAMX --module market --function close_offer_pt --args $ORDER $SUI_COIN

async function close_bid_pt(order) {
    const paramxPackageId = (await getObjects(`../move/paramx/publish.json`))['published'];
    // const order = getFirstObject(`${paramxPackageId}::market::BidOrderPT`)
    const token = getFirstObject(`${paramxPackageId}::yield_trading_protocol::PTToken`)
    const command = `sui client call --package ${paramxPackageId} --module market --function close_bid_pt --args ${order} ${token} --json`;

    try {
        const data = execSync(command, { encoding: 'utf8' });
        return getMapping(data);
    } catch (error) {
        console.error(`Error: ${error}`);
        return null;
    }
}
async function close_bid_yt(order) {
    const paramxPackageId = (await getObjects(`../move/paramx/publish.json`))['published'];
    // const order = getFirstObject(`${paramxPackageId}::market::BidOrderYT`)
    const token = getFirstObject(`${paramxPackageId}::yield_trading_protocol::YTToken`)
    const command = `sui client call --package ${paramxPackageId} --module market --function close_bid_yt --args ${order} ${token} --json`;

    try {
        const data = execSync(command, { encoding: 'utf8' });
        return getMapping(data);
    } catch (error) {
        console.error(`Error: ${error}`);
        return null;
    }
}


async function close_offer_pt(order) {
    const paramxPackageId = (await getObjects(`../move/paramx/publish.json`))['published'];
    // const order = getFirstObject(`${paramxPackageId}::market::OfferOrderPT`)
    const sui = getSuiCoin(1000000000)
    const command = `sui client call --package ${paramxPackageId} --module market --function close_offer_pt --args ${order} ${sui} --json`;
    console.log(command)
    try {
        const data = execSync(command, { encoding: 'utf8' });
        return getMapping(data);
    } catch (error) {
        console.error(`Error: ${error}`);
        return null;
    }
}

async function close_offer_yt(order) {
    const paramxPackageId = (await getObjects(`../move/paramx/publish.json`))['published'];
    // const order = getFirstObject(`${paramxPackageId}::market::OfferOrderYT`)
    const sui = getSuiCoin(1000000000)
    const command = `sui client call --package ${paramxPackageId} --module market --function close_offer_yt --args ${order} ${sui} --json`;
    try {
        const data = execSync(command, { encoding: 'utf8' });
        return getMapping(data);
    } catch (error) {
        console.error(`Error: ${error}`);
        return null;
    }
}

async function main() {
    // console.log(await close_bid_pt());
    // console.log(await close_bid_yt());

    console.log(await close_offer_yt('0x93294bf84be3fc87fdbe51c0f14f7c724d2b9d44aa204c5a9fe8c4fb45748317'));
    console.log(await close_offer_pt('0x1bfc49bf2d88645e40100807184a5879879c9fe3a563cc4acdd48215941642af'));
    
}


main();
// console.log(getSuiCoin(10000000000));