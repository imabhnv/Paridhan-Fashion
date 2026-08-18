const fs = require('fs');
const https = require('https');
const path = require('path');

const url = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&h=800&q=80';
const filepath = path.join(__dirname, 'public', 'assets', 'accessories.jpg');
const file = fs.createWriteStream(filepath);

https.get(url, (response) => {
  if (response.statusCode === 200) {
    response.pipe(file);
    file.on('finish', () => {
      file.close(() => console.log('Successfully downloaded accessories.jpg'));
    });
  } else {
    console.error(`Failed: ${response.statusCode}`);
  }
}).on('error', (err) => {
  fs.unlink(filepath, () => console.error(err));
});
