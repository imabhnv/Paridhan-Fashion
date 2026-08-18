const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'public', 'assets');

const copies = [
  { src: 'cat_anarkalis_1787056519153.jpg', dest: 'anarkalis.jpg' },
  { src: 'cat_kurta_sets_1787056591991.jpg', dest: 'kurta_sets.jpg' },
  { src: 'cat_indo_western_1787056646925.jpg', dest: 'indo_western.jpg' },
  { src: 'cat_accessories_1787056661975.jpg', dest: 'accessories.jpg' },
  
  { src: 'runway_sherwani_wedding.jpg', dest: 'runway_3.jpg' },
  { src: 'runway_bride_portrait.jpg', dest: 'deco_1.jpg' },
  { src: 'runway_gown_red.jpg', dest: 'deco_2.jpg' },
  { src: 'runway_suit_layout.jpg', dest: 'deco_3.jpg' },
  { src: 'runway_suit_blue.jpg', dest: 'deco_4.jpg' }
];

copies.forEach(item => {
  const srcPath = path.join(assetsDir, item.src);
  const destPath = path.join(assetsDir, item.dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${item.src} -> ${item.dest}`);
  } else {
    console.error(`Source not found: ${srcPath}`);
  }
});
console.log('Renaming and copies completed!');
