const fs = require('fs');
const https = require('https');
const path = require('path');

const newAssets = [
  { id: '1583391733956-3750e0ff4e8b', filename: 'runway_lehenga_detail.jpg' },
  { id: '1610030470298-40b8a1c22d15', filename: 'runway_saree_gold.jpg' },
  { id: '1598808503746-f34c53b9323e', filename: 'runway_bride_portrait.jpg' },
  { id: '1597983073493-88cd35cf93b0', filename: 'runway_sherwani_wedding.jpg' },
  { id: '1621184455862-c163dfb30e0f', filename: 'runway_gown_red.jpg' },
  { id: '1617627143750-d86bc21e42bb', filename: 'runway_lehenga_spin.jpg' },
  { id: '1618220179428-22790b461013', filename: 'runway_jewelry_gold.jpg' },
  { id: '1593030761757-71fae45fa0e7', filename: 'runway_suit_layout.jpg' }
];

const downloadImage = (id, filename) => {
  return new Promise((resolve, reject) => {
    const url = `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&h=800&q=80`;
    const filepath = path.join(__dirname, 'public', 'assets', filename);
    const file = fs.createWriteStream(filepath);

    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      } else {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      fs.unlink(filepath, () => reject(err));
    });
  });
};

async function main() {
  console.log('Downloading high-quality runway assets...');
  for (const asset of newAssets) {
    try {
      console.log(`Downloading ${asset.filename}...`);
      await downloadImage(asset.id, asset.filename);
      console.log(`Success: ${asset.filename}`);
    } catch (err) {
      console.error(`Failed to download ${asset.filename}:`, err);
    }
  }
  console.log('All downloads completed!');
}

main();
