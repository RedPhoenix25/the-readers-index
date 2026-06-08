const https = require('https');

https.get('https://the-readers-index.onrender.com/api/products', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const products = JSON.parse(data);
    const missingCat = products.filter(p => !p.category || !p.title);
    console.log('Products missing category or title:', missingCat.length);
    if(missingCat.length > 0) {
      console.log('Missing cat examples:', missingCat.slice(0, 2));
    }
  });
});
