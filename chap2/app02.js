const http = require('http');
const fs = require('fs');
const { response } = require('express');

let server = http.createServer(
    (request, response) => {
        fs.readFile('./index.html', 'UTF-8', 
        (error, data) => {
            response.writeHead(200, { 'Content-type': 'text/html' });
            response.write(data);
            response.end();
        });
    }
);

server.listen(3000);
console.log('Server running on port 3000.');