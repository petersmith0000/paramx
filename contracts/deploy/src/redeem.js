

import { execSync } from 'child_process';
import {getObjects, getSuiCoin, getMidnightGMTEpoch, getMapping, getFirstObject} from './util.js';


// sui client call --package $PARAMX --module yield_trading_protocol --function redeem_YT --args $YTTOKEN $VAULT $NATIVE_POOL $Metadata $clock
// sui client call --package $PARAMX --module yield_trading_protocol --function redeem_PT --args $PTTOKEN $VAULT $NATIVE_POOL $Metadata $clock



async function redeem_YT(order) {
    const paramXMapping = await getObjects(`../move/paramx/publish.json`)
    const paramxPackageId = paramXMapping['published'];
    const token = getFirstObject(`${paramxPackageId}::yield_trading_protocol::YTToken`)
    const vault_key = paramxPackageId+"::yield_trading_protocol::Vault";
    const vault_objId = paramXMapping[vault_key];


    const json_path = `../move/volo_local/publish.json`;
    const objects = await getObjects(json_path);
    const packageId = objects['published'];

    const native_pool_key = packageId+"::native_pool::NativePool";
    const native_pool_objId = objects[native_pool_key];
    
    const certMetaData = `${packageId}::cert::Metadata<${packageId}::cert::CERT>`;
    const cet_meta_data_objId = objects[certMetaData];

    
    // const vault = getFirstObject(`${paramxPackageId}::yield_trading_protocol::Vault`)

    const command = `sui client call --package ${paramxPackageId} --module yield_trading_protocol --function redeem_YT --args ${token} ${vault_objId} ${native_pool_objId} ${cet_meta_data_objId} $clock --json`;

    try {
        const data = execSync(command, { encoding: 'utf8' });
        return getMapping(data);
    } catch (error) {
        console.error(`Error: ${error}`);
        return null;
    }
}


async function main() {
    console.log(await redeem_YT());
    // console.log(await redeem_PT());
}


main();
// console.log(getSuiCoin(10000000000));