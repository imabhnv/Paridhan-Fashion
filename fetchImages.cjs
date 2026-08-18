const fs = require('fs');
const https = require('https');
const path = require('path');

const images = [
  { name: 'hero_lehenga.jpg', prompt: 'beautiful indian bride wearing heavy red and gold designer bridal lehenga high fashion photography studio lighting' },
  { name: 'hero_tuxedo.jpg', prompt: 'handsome man wearing perfectly tailored luxury black tuxedo high fashion editorial photography sharp' },
  { name: 'hero_party.jpg', prompt: 'glamorous woman wearing chic sequined party cocktail dress night out high fashion studio lighting' },
  { name: 'hero_designer.jpg', prompt: 'beautiful indian woman wearing modern designer saree high fashion editorial style elegant luxury' },
  { name: 'deco_cat1.jpg', prompt: 'close up of intricate gold zari embroidery on royal blue velvet fabric luxury texture high fashion' },
  { name: 'deco_cat2.jpg', prompt: 'beautiful sheer silk dupatta fabric blowing in wind ethereal fashion pastel colors' },
  { name: 'deco_boutique1.jpg', prompt: 'close up of woman hands wearing traditional indian gold bangles and mehendi elegant lighting' },
  { name: 'deco_boutique2.jpg', prompt: 'close up ornate jeweled buttons on premium silk sherwani traditional indian fashion detail' },
  { name: 'deco_trust1.jpg', prompt: 'luxury high heels next to clutch bag on marble table high fashion studio lighting' },
  { name: 'deco_trust2.jpg', prompt: 'luxurious jeweled evening clutch purse held by woman high fashion editorial close up' },
  { name: 'deco_step1.jpg', prompt: 'beautiful indian kundan necklace jewelry on velvet display elegant lighting high fashion' },
  { name: 'deco_step2.jpg', prompt: 'close up luxury fabric draping elegant folds silk fashion texture' },
  { name: 'deco_step3.jpg', prompt: 'fashion sketch of elegant evening gown on paper luxury design' }
];

const downloadImage = (filename, prompt) => {
  return new Promise((resolve, reject) => {
    const encodedPrompt = encodeURIComponent(prompt);
    // Add random seed to avoid caching
    const seed = Math.floor(Math.random() * 100000);
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=400&height=500&nologo=true&seed=${seed}`;
    const filepath = path.join(__dirname, 'public', 'assets', filename);
    const file = fs.createWriteStream(filepath);

    https.get(url, (response) => {
      if (response.statusCode === 200 || response.statusCode === 302 || response.statusCode === 301) {
        // Pollinations might redirect, but typically returns 200 JPEG directly.
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

async function fetchAll() {
  console.log('Starting image downloads...');
  const promises = images.map(img => {
    console.log(`Downloading ${img.name}...`);
    return downloadImage(img.name, img.prompt).then(() => console.log(`Finished ${img.name}`));
  });
  
  try {
    await Promise.all(promises);
    console.log('All images downloaded successfully!');
  } catch (error) {
    console.error('Error downloading images:', error);
  }
}

fetchAll();
