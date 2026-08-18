const fs = require('fs');
const https = require('https');
const path = require('path');

const newAssets = [
  { id: '1610030469983-98e550d6193c', filename: 'bridal_wear.jpg' },
  { id: '1583391733956-3750e0ff4e8b', filename: 'designer_lehenga.jpg' },
  { id: '1595777457583-95e059d581b8', filename: 'party_wear.jpg' },
  { id: '1605518216938-7c31b7b14ad0', filename: 'ethnic_wear.jpg' },
  { id: '1594938298603-c8148c4dae35', filename: 'tuxedos.jpg' },
  { id: '1566174053879-31528523f8ae', filename: 'luxury_gowns.jpg' },
  { id: '1607345366928-199ea26cfe3e', filename: 'sherwanis.jpg' },
  { id: '1615887023516-9b6bcd559e87', filename: 'designer_sarees.jpg' },
  { id: '1591348278863-a8bf3a6c4293', filename: 'anarkalis.jpg' },
  { id: '1614031679201-9257d0793664', filename: 'kurta_sets.jpg' },
  { id: '1585468273295-8bc681b9e115', filename: 'indo_western.jpg' },
  { id: '1606001257497-2a420b92dbb3', filename: 'accessories.jpg' },
  
  { id: '1507679799987-c73779587ccf', filename: 'hero_1.jpg' },
  { id: '1593030761757-71fae45fa0e7', filename: 'hero_2.jpg' },
  { id: '1490481651871-ab68de25d43d', filename: 'hero_3.jpg' },
  { id: '1483985988355-763728e1935b', filename: 'hero_4.jpg' },

  { id: '1534126511673-b6899657816a', filename: 'runway_1.jpg' },
  { id: '1441984904996-e0b6ba687e04', filename: 'runway_2.jpg' },
  { id: '1565345717-b7159fba11b8', filename: 'runway_3.jpg' },
  { id: '1441986300917-64674bd600d8', filename: 'runway_4.jpg' },
  { id: '1479064555552-3ef4979f8908', filename: 'runway_5.jpg' },
  
  { id: '1601614760451-248a33990666', filename: 'deco_1.jpg' },
  { id: '1572804013309-59a88b11cb33', filename: 'deco_2.jpg' },
  { id: '1511216335778-8cb5f988c7a3', filename: 'deco_3.jpg' },
  { id: '1621319223797-1588667a4ef9', filename: 'deco_4.jpg' }
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
  console.log('Downloading 25 high-quality, unique fashion assets...');
  for (const asset of newAssets) {
    let success = false;
    let attempts = 0;
    while (!success && attempts < 3) {
      try {
        attempts++;
        console.log(`Downloading ${asset.filename} (Attempt ${attempts})...`);
        await downloadImage(asset.id, asset.filename);
        console.log(`Success: ${asset.filename}`);
        success = true;
      } catch (err) {
        console.error(`Failed to download ${asset.filename}:`, err.message);
        if (attempts >= 3) {
          console.error(`Giving up on ${asset.filename}`);
        }
      }
    }
  }
  console.log('All downloads completed!');
}

main();
