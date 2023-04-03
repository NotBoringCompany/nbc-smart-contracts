require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const rfs = require('recursive-fs');
const basePathConverter = require('base-path-converter');
const JWT = `Bearer ${process.env.PINATA_JWT}`;
// const got = require('got');
const pinataSDK = require('@pinata/sdk');
const pinata = new pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);

pinata.testAuthentication().then((res) => console.log(res));

const pin = async () => {
    const src = 'src/metadata/stage1';
    const options = {
        pinataOptions: {
            cidVersion: 1,
            wrapWithDirectory: false,
        }
    };

    pinata.pinFromFS(src, options).then((res) => {
        console.log(res);
    }).catch((err) => {
        console.log(err);
    })
}

pin();