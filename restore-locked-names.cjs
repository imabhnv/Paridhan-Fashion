const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'public', 'assets');

const restorations = [
  { src: 'designer_sarees.jpg', dest: 'cat_designer_sarees_1787056158750.jpg' },
  { src: 'sherwanis_clean.jpg', dest: 'sherwanis.jpg' }
];

restorations.forEach(item => {
  const srcPath = path.join(assetsDir, item.src);
  const destPath = path.join(assetsDir, item.dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Restored ${item.dest} from ${item.src}`);
  } else {
    console.error(`Source not found for restoration: ${srcPath}`);
  }
});
