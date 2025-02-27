
// import { execSync } from 'child_process';
import { getObjects } from './util.js'

// const command = 'sui client faucet'
// ls ../move/volo_local
// try {
//     const output = execSync(command, { encoding: 'utf8' });
//     console.log(output);
// } catch (error) {
//     console.error(`Error: ${error}`);
// }

let a = getObjects("../move/volo_local/publish.json")

let b = getObjects("../move/paramx/publish.json")

// ../move/volo_local/publish.json

let final_hson = {
    "ParamXPackageAddress": b["published"],
    "VoloLiquidStakingPackageAddress": a["published"],
    "VoloNativePoolObjectId": a[a["published"]+"::native_pool::NativePool"],
    "VoloMetaDataObjectId": a[a["published"]+"::cert::Metadata<"+a["published"]+"::cert::CERT>"]
}
import * as fs from "fs";

// Convert JSON object to a string
const jsonString = JSON.stringify(final_hson, null, 2);

// Write to the file
fs.writeFileSync("../../frontend/src/constants.json", jsonString, "utf8");

console.log(final_hson);

