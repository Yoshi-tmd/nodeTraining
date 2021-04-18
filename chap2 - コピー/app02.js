const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const url = require('url');

const index_page = fs.readFileSync('./index.ejs', 'utf8');
const other_page = fs.readFileSync('./other.ejs', 'utf8');
const style_css = fs.readFileSync('./style.css', 'utf8');

let server = http.createServer(getFormClient);

server.listen(3000);
console.log('Server running on port 3000.');

// createServerの処理
function getFormClient(req, res){
    console.log(req.url);
    let url_parts = url.parse(req.url);
    console.log(url_parts);

    switch (url_parts.pathname){

        case '/':
            let content = ejs.render(index_page, {
                title: "Index",
                content: "これはテンプレートを使ったサンプルページです。",
            });
            res.writeHead(200, { 'Content-type': 'text/html' });
            res.write(content);
            res.end();
            break;

        case '/other':
            let content2 = ejs.render(other_page, {
                title: "Ohter",
                content: "これは新しく用意したページです。",
            });
            res.writeHead(200, { 'Content-type': 'text/html' });
            res.write(content2);
            res.end();
            break;

        // case '/style.css':
        //     res.writeHead(200, { 'Content-type': 'text/css' });
        //     res.write(style_css);
        //     res.end();
        //     break;

        default:
            res.writeHead(200, { 'Content-type': 'text/plain' });
            res.end('No page...');
            break;
    }
        

}