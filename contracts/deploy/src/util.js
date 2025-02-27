import { execSync } from 'child_process'
import { readFileSync } from 'fs'

export function getObjects(json_path) {
    try {
        const data = readFileSync(json_path); // Read JSON file
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

export function getSuiCoin(amount){
    
    // sui client gas --json
    const command = 'sui client gas --json'
    try {
        const jsono = execSync(command, { encoding: 'utf8' }); // Run command synchronously
        const json = JSON.parse(jsono);
        
        const coinId = json[0]['gasCoinId'];
        if (amount == undefined){
            return coinId
        } else{
            for(const coin in json){
                if(coin['mistBalance'] <= amount - 200000000){
                    continue;
                }
                // // sui client split-coin --coin-id <> --amounts <> --json
                const command = `sui client split-coin --coin-id ${coinId} --amounts ${amount} --json`
                const jsono = execSync(command, { encoding: 'utf8' }); // Run command synchronously
                // console.log(jsono)
                const json = JSON.parse(jsono);
                const objects = json['objectChanges']
                for(const obj of objects){
                    if(obj['type']== 'created'){
                        return obj['objectId']
                    }
                }
                break;
            }
        }
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}


export function getMidnightGMTEpoch(date) {
    // Create a new Date object set to the provided date in GMT (UTC)
    const midnightGMT = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59));
    
    // Return the epoch time in milliseconds
    return midnightGMT.getTime();
}


export function getFirstObject(objectType){
    // sui client gas --json
    const command = 'sui client objects --json'
    try {
        const jsono = execSync(command, { encoding: 'utf8' }); // Run command synchronously
        const json = JSON.parse(jsono);

        for(const obj of json) {
            const data = obj['data']
            if(data['type'] == objectType){
                return data['objectId'];
            }
        }
        // return 
    } catch (error) {
        console.error(`Error: ${error}`);
    }
    return null
}

export function getAllObjects(objectType){
    // sui client gas --json
    const command = 'sui client objects --json'
    try {
        const jsono = execSync(command, { encoding: 'utf8' }); // Run command synchronously
        const json = JSON.parse(jsono);
        let result = []
        for(const obj of json) {
            const data = obj['data']
            if(data['type'] == objectType){
                result.push(data['objectId']);
            }
        }
        // return 
        return result
    } catch (error) {
        console.error(`Error: ${error}`);
    }
    return null
}


// export function 
export function extractPxType(objectId) {
    // 0x343d6e4dafed8ac4c579e2700a742febc36cc756db12205b8e906fa97d707513
    const command = `sui client object ${objectId} --json`
    try {
        const jsono = execSync(command, { encoding: 'utf8' }); // Run command synchronously
        const json = JSON.parse(jsono);
        return json['content']['fields']['token_type']
        // return 
    } catch (error) {
        console.error(`Error: ${error}`);
    }
    return null

}

export function getMapping(data) {
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
}