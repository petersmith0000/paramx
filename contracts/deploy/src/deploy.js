const { execSync } = require('child_process');
const { readFile } = require('fs').promises;

async function publish(path_to_package) {
    const command = `cd ${path_to_package} && rm publish.json && sui client publish --json >> publish.json`;
    try {
        execSync(command, { encoding: 'utf8' }); // Run command synchronously
        const json_path = `${path_to_package}/publish.json`;
        const data = await readFile(json_path, 'utf8'); // Read JSON file
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

async function publishAll() {
    const objects = await publish("../move/volo_local")
    console.log(objects);

    const objects_paramx = await publish("../move/paramx")
    console.log(objects_paramx);
}


publishAll();

