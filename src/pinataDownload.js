const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const stream = require('stream');
const pipeline = promisify(stream.pipeline);

// Define the CID and the base URL
const cid = "bafybeift56mrglsgnouga7ufhniomqr6ibecu6nryzxiwmexiyiercnyp4";
const baseURL = `https://silver-odd-bee-580.mypinata.cloud/ipfs/${cid}/`;

// Create an array of filenames from 1.json to 5000.json
const files = Array.from({ length: 5000 }, (_, i) => `${i + 1}.json`);

// Create a directory to save the files
const downloadDir = path.join(__dirname, '/metadata/updatedStage2');

if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir);
}

// Function to download a file
async function downloadFile(fileName) {
  const fileUrl = baseURL + fileName;
  const filePath = path.join(downloadDir, fileName);

  try {
    const response = await axios({
      url: fileUrl,
      method: 'GET',
      responseType: 'stream'
    });

    await pipeline(response.data, fs.createWriteStream(filePath));

    console.log(`${fileName} downloaded`);
  } catch (error) {
    console.error(`Failed to download ${fileName}: ${error.message}`);
  }
}

// // Download files concurrently
// (async () => {
//     const concurrencyLimit = 10;
//     const chunks = [];
  
//     for (let i = 0; i < files.length; i += concurrencyLimit) {
//       chunks.push(files.slice(i, i + concurrencyLimit));
//     }
  
//     for (const chunk of chunks) {
//       await Promise.all(chunk.map(downloadFile));
//     }
  
//     console.log('All files downloaded');
//   })();