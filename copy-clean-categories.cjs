const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'public', 'assets');

const copies = [
  { src: 'cat_designer_sarees_1787056158750.jpg', dest: 'designer_sarees.jpg' },
  { src: 'cat_sherwanis_1787056047869.jpg', dest: 'sherwanis_clean.jpg' }
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
console.log('Category asset copies completed!');
