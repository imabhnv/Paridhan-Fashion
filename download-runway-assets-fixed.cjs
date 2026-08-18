const fs = require('fs');
const https = require('https');
const path = require('path');

const assets = [
  { id: '1607345366928-199ea26cfe3e', filename: 'runway_sherwani_wedding.jpg' },
  { id: '1610030469983-98e550d6193c', filename: 'runway_2.jpg' },
  { id: '1615887023516-9b6bcd559e87', filename: 'runway_4.jpg' }
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
            console.log(`Successfully downloaded ${item.filename}`);
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
  for (const asset of assets) {
    await download(asset);
  }
  console.log('All downloads finished!');
}

start();
