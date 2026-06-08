const https = require('https');

https.get('https://the-readers-index.onrender.com/api/orders', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const orders = JSON.parse(data);
    const missingStatus = orders.filter(o => !o.status);
    console.log('Orders missing status:', missingStatus.length);
    if(missingStatus.length > 0) {
      console.log('Missing status examples:', missingStatus.slice(0, 2));
    }
  });
});
