const http = require('http');
const fs = require('fs');
const ejs = require('ejs');

const index_page = fs.readFileSync('./index.ejs', 'utf8');

let server = http.createServer(getFromClient);

server.listen(3000);
console.log('Server running on port 3000.');

// ここまでメインプログラム

 // createServerの処理
function getFromClient(req, res) {
    let content = ejs.render(index_page);
    res.writeHead(200, { 'Content-type': 'text/html' });
    res.write(content);
    res.end();
}