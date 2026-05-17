const http = require('node:http');

const post = (path, body, token) => new Promise((res, rej) => {
  const data = JSON.stringify(body);
  const opts = {
    hostname: 'localhost', port: 5000, path: '/api' + path, method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data),
      ...(token ? { Authorization: 'Bearer ' + token } : {})
    }
  };
  const req = http.request(opts, r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => { try { res(JSON.parse(d)); } catch(e) { res(d); } });
  });
  req.on('error', rej); req.write(data); req.end();
});

const get = (path, token) => new Promise((res, rej) => {
  const opts = {
    hostname: 'localhost', port: 5000, path: '/api' + path, method: 'GET',
    headers: { Authorization: 'Bearer ' + token }
  };
  const req = http.request(opts, r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => { try { res(JSON.parse(d)); } catch(e) { res(d); } });
  });
  req.on('error', rej); req.end();
});

async function run() {
  // 1. Login user
  const uLogin = await post('/users/login', { username: 'fauzan_arfa', password: 'FAUZAN123@ganteng' });
  const uToken = uLogin.data && uLogin.data.token;
  console.log('1. User login:', uLogin.success, '| Token OK:', !!uToken);

  // 2. Create order header
  const order = await post('/users/orders',
    { user_id: 1, restaurant_id: 1, order_amount: 30000, order_status: 'ordered', location: 'Jl. Test No. 1' },
    uToken);
  console.log('2. Order:', JSON.stringify(order));
  const orderId = order.data && order.data.order_id;

  // 3. Add item
  if (orderId) {
    const item = await post('/users/orders/detail',
      { order_id: orderId, food_id: 2, quantity: 2, total_harga_food: 30000 },
      uToken);
    console.log('3. Item:', JSON.stringify(item));
  }

  // 4. Restaurant login
  const rLogin = await post('/restaurants/login', { username: 'admin_preksu', password: 'FAUZAN123@ganteng' });
  console.log('4. Restaurant login:', rLogin.success, rLogin.message);
  if (rLogin.success) {
    const rToken = rLogin.data.token;
    const orders = await get('/restaurants/orders/all/1', rToken);
    console.log('5. Restaurant sees:', JSON.stringify(orders.data));
  }
}

run().catch(console.error);
