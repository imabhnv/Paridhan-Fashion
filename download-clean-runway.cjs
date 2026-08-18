const fs = require('fs');
const https = require('https');
const path = require('path');

const assets = [
  { id: '1610030469983-98e550d6193c', filename: 'runway_bride_portrait.jpg' },
  { id: '1583391733956-3750e0ff4e8b', filename: 'runway_lehenga_detail.jpg' },
  { id: '1566174053879-31528523f8ae', filename: 'runway_gown_purple.jpg' },
  { id: '1607345366928-199ea26cfe3e', filename: 'runway_sherwani_wedding.jpg' },
  { id: '1594938298603-c8148c4dae35', filename: 'runway_suit_blue.jpg' },
  { id: '1595777457583-95e059d581b8', filename: 'runway_2.jpg' },
  { id: '1597983073453-e96e5794553f', filename: 'runway_3.jpg' },
  { id: '1567401893930-ac9d900fd291', filename: 'runway_4.jpg' }
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
  console.log('Downloading 8 clean unique runway assets...');
  for (const asset of assets) {
    await download(asset);
  }
  console.log('Clean runway assets ready!');
}

start();
