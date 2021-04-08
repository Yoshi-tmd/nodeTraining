const http = require('http');
const fs = require('fs');

let server = http.createServer(getFromClient);

server.listen(3000);
console.log('Server running on port 3000.');

// ここまでメインプログラム

 // createServerの処理
function getFromClient(req, res) {
    fs.readFile('./index.html', 'UTF-8', 
        (error, data) => {
            res.writeHead(200, { 'Content-type': 'text/html' });
            res.write(data);
            res.end();
    });
}