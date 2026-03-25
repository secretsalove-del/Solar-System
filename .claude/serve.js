const http = require('http');
const fs   = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2'
};

http.createServer((req, res) => {
  let filePath = path.join(root, req.url === '/' ? '/index.html' : req.url);
  if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) filePath += '.html';
  if (!fs.existsSync(filePath)) {
    // fallback to first html file in root
    const html = fs.readdirSync(root).find(f => f.endsWith('.html'));
    if (html) filePath = path.join(root, html);
    else { res.writeHead(404); return res.end('Not found'); }
  }
  const ext = path.extname(filePath);
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
}).listen(3000, () => console.log('Serving on http://localhost:3000'));
