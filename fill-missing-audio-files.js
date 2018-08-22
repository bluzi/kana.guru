// export GOOGLE_APPLICATION_CREDENTIALS="/Users/eliran/Downloads/My First Project-81b5649d2274.json"

const fs = require('fs-extra');
const textToSpeech = require('@google-cloud/text-to-speech');
const dic = require('./src/assets/dictionary');
const path = require('path');
const wanakana = require('wanakana');

process.env['GOOGLE_APPLICATION_CREDENTIALS'] = '/Users/eliran/Downloads/My First Project-81b5649d2274.json';

const client = new textToSpeech.TextToSpeechClient();

(async () => {
    for (const word of dic) {
        if (!word.romaji) word.romaji = wanakana.toRomaji(word.hiragana);

        const audioFilePath = `./public/audio/${word.romaji}.mp3`;

        if (await fs.exists(audioFilePath)) continue;

        const request = {
            "audioConfig": {
                "audioEncoding": "LINEAR16",
                "pitch": "0.00",
                "speakingRate": "1.00"
            },
            "input": {
                "text": word.hiragana
            },
            "voice": {
                "languageCode": "ja-JP",
                "name": "ja-JP-Wavenet-A",
                "audioEncoding": 'MP3'
            }
        };

        const response = await new Promise((resolve, reject) => client.synthesizeSpeech(request, (err, response) => err ? reject(err) : resolve(response)));

        await fs.writeFile(audioFilePath, response.audioContent, 'binary');

        console.log(`Audio content written to file: ${audioFilePath}`);
    }

    await fs.writeFile('./src/assets/dictionary.json', JSON.stringify(dic, null, 4));

})();


// Construct the request


// Performs the Text-to-Speech request
