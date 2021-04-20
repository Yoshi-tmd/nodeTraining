const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const url = require('url');
const qs = require('querystring');

const index_page = fs.readFileSync('./index.ejs', 'utf8');
const other_page = fs.readFileSync('./other.ejs', 'utf8');
const style_css = fs.readFileSync('./style.css', 'utf8');

let server = http.createServer(getFormClient);

server.listen(3000);
console.log('Server running on port 3000.');

// createServerの処理
function getFormClient(req, res){
    let url_parts = url.parse(req.url, true);

    switch (url_parts.pathname){
        case '/':
            responseIndex(req, res);
            break;

        case '/other':
            responseOther(req, res);
            break;

        case '/style.css':
            res.writeHead(200, { 'Content-type': 'text/css' });
            res.write(style_css);
            res.end();
            break;

        default:
            res.writeHead(200, { 'Content-type': 'text/plain' });
            res.end('No page...');
            break;
    }
}

// indexのアクセス処理
function responseIndex(req, res){
    let text = "これはIndexページです。";
    let content = ejs.render(index_page, {
        title: "Index",
        content: text,
    });
    res.writeHead(200, { 'Content-type': 'text/html' });
    res.write(content);
    res.end();
}

// otherのアクセス処理
function responseOther(req, res){
    let text = "これはOtherページです。";

    // POST アクセス時の処理
    if (req.method == 'POST'){
        let body = '';

        // データ受信のイベント処理
        req.on('data', (data) => {
            body += data;
        });

        // データ受信終了のイベント処理
        req.on('end', () => {
            let post_data = qs.parse(body);     // データのパース
            text +=  "あなたは、「" + post_data.msg + "」と送りました。";
            let content = ejs.render(other_page, {
                title: "Ohter",
                content: text,
            });
            res.writeHead(200, { 'Content-type': 'text/html' });
            res.write(content);
            res.end();

        });
    } else {
        // GETアクセス時の処理
        let text = "ページがありません。";
        let content = ejs.render(other_page, {
            title: "Ohter",
            content: text,
        });
        res.writeHead(200, { 'Content-type': 'text/html' });
        res.write(content);
        res.end();
    }
}