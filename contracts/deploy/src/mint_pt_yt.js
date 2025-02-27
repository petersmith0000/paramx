import { execSync } from 'child_process';
import {getObjects, getFirstObject, getMidnightGMTEpoch} from './util.js';

async function mint_pt_yt(maturity_date) {
    const paramxPackageId = (getObjects(`../move/paramx/publish.json`))['published'];

    const json_path = `../move/volo_local/publish.json`;
    const objects = await getObjects(json_path);
    const packageId = objects['published'];

    const native_pool_key = packageId+"::native_pool::NativePool";
    const native_pool_objId = objects[native_pool_key];
    
    const certMetaData = `${packageId}::cert::Metadata<${packageId}::cert::CERT>`;
    const cet_meta_data_objId = objects[certMetaData];

    const maturity_ms = getMidnightGMTEpoch(maturity_date);

    const cert_coin = getFirstObject(`0x2::coin::Coin<${packageId}::cert::CERT>`)

    const command = `sui client call --package ${paramxPackageId} --module yield_trading_protocol --function mint_PT_YT --args ${cert_coin} ${native_pool_objId} ${cet_meta_data_objId} ${maturity_ms} --json`;
    
    try {
        const data = execSync(command, { encoding: 'utf8' });
        const json = JSON.parse(data);

        const objectChanges = json['objectChanges'];
        const mapping = {};

        for (const obj of objectChanges) {
            if (obj['type'] === 'created' || obj['type'] === 'mutated') {
                mapping[obj['objectType']] = obj['objectId'];
            } 
            if (obj['type'] === 'published') {
                mapping['published'] = obj['packageId'];
            }
        }

        return mapping;


    } catch (error) {
        console.error(`Error: ${error}`);
        return null;
    }
}

async function main() {
    const objects = await mint_pt_yt(new Date(2025, 2, 31))
    console.log(objects);
    
}


main();





