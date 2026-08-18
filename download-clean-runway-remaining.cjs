const fs = require('fs');
const https = require('https');
const path = require('path');

const assets = [
  { id: '1565345717-b7159fba11b8', filename: 'runway_3.jpg' },
  { id: '1558769132-cb1aea458c5e', filename: 'runway_4.jpg' }
];

const download = (item) => {
  return new Promise((resolve) => {
    const url = `https://images.unsplash.com/photo-${item.id}?auto=format&fit=crop&w=600&h=800&q=80`;
    const filepath = path.join(__dirname, 'public', 'assets', item.filename);
    const file = fs.createWriteStream(filepath);

    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close(() => {
            console.log(`Downloaded: ${item.filename}`);
            resolve();
          });
        });
      } else {
        console.error(`Failed ${item.filename}: ${response.statusCode}`);
        resolve();
      }
    }).on('error', (err) => {
      console.error(`Error ${item.filename}:`, err);
      resolve();
    });
  });
};

async function start() {
  console.log('Downloading missing 2 assets...');
  for (const asset of assets) {
    await download(asset);
  }
  console.log('Done!');
}

start();
