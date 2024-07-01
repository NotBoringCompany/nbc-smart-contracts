const fs = require('fs');
const path = require('path');

// Create a directory to save the modified files
const downloadDir = path.join(__dirname, '/metadata/updatedStage2');

// Function to read, modify, and save the JSON file
async function modifyJsonFile(fileName) {
  const filePath = path.join(downloadDir, fileName);

  try {
    // Read the file
    const data = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(data);

    // Modify the name field
    if (json.name && json.name.startsWith('Key Of Salvation')) {
      json.name = json.name.replace('Key Of Salvation', 'Wonder Key');
    }

    // Write the modified JSON back to the file
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
    console.log(`${fileName} modified`);
  } catch (error) {
    console.error(`Failed to modify ${fileName}: ${error.message}`);
  }
}

// List of filenames to modify
const files = Array.from({ length: 5000 }, (_, i) => `${i + 1}.json`);

// Modify each file
(async () => {
  for (const fileName of files) {
    await modifyJsonFile(fileName);
  }
  console.log('All files modified');
})();