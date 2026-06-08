const https = require('https');

https.get('https://the-readers-index.onrender.com/api/products', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const products = JSON.parse(data);
    const missingPrice = products.filter(p => p.price === undefined || p.price === null);
    console.log('Products missing price:', missingPrice.length);
  });
});

https.get('https://the-readers-index.onrender.com/api/orders', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const orders = JSON.parse(data);
    const missingAmount = orders.filter(o => o.totalAmount === undefined || o.totalAmount === null);
    console.log('Orders missing totalAmount:', missingAmount.length);
  });
});
