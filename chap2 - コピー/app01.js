const { response } = require('express');
const http = require('http');

let server = http.createServer(
    (request, response) => {
        response.end('Hello!');
    }
);

console.log('Server running on port 3000.');
server.listen(3000);