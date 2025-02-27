import { execSync } from 'child_process';
import {getObjects, getSuiCoin} from './util.js';

async function mint_volo() {
    const json_path = `../move/volo_local/publish.json`;
    const objects = await getObjects(json_path);
    // console.log(objects)
    const packageId = objects['published'];
    // console.log(packageId)
    const native_pool_key = packageId+"::native_pool::NativePool";
    const native_pool_objId = objects[native_pool_key];
    
    const certMetaData = `${packageId}::cert::Metadata<${packageId}::cert::CERT>`;
    const cet_meta_data_objId = objects[certMetaData];

    const SUI_SYSTEM = "0x0000000000000000000000000000000000000000000000000000000000000005";

    const sui_coin = getSuiCoin(10000000000);

    const command = `sui client call --package ${packageId} --module native_pool --function stake --args ${native_pool_objId} ${cet_meta_data_objId} ${SUI_SYSTEM} ${sui_coin} --json`;
    console.log(command)
    try {
        const data = execSync(command, { encoding: 'utf8' });
        // console.log(data)
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
    const objects = await mint_volo()
    console.log(objects);
}


main();

