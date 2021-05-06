const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const url = require('url');
const qs = require('querystring');

const index_page = fs.readFileSync('./index.ejs', 'utf8');
const other_page = fs.readFileSync('./other.ejs', 'utf8');
const phoneList_page = fs.readFileSync('./phoneList.ejs', 'utf8');
const easyBBS_page = fs.readFileSync('./easybbs.ejs', 'utf8');
const style_css = fs.readFileSync('./style.css', 'utf8');

let server = http.createServer(getFormClient);

server.listen(3000);
console.log('Server running on port 3000.');

let phoneNumlist = {
    'Yoshinori': '090-1234-5678',
    'Moe': '080-9876-5432',
    'Oden': '090-1357-2468',
    'Daifuku': '090-9753-8642'
};

let phoneNumlist2 = {
    'Taro': ['tar@gmail', '000-3523-9999', 'Tokyo'],
    'Hanako': ['han@gmail', '000-6294-9274', 'Osaka'],
    'Kenji': ['ken@gmail', '000-0174-2748', 'Nagoya'],
    'Jiro': ['jir@gmail', '000-9999-0055', 'Fukuoka'],
};

let data = { msg: 'no message...' };

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
        
        case '/phoneList':
            responsePhoneList(req, res);
            break;

        case '/easybbs':
            responseEasyBBS(req, res);
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

// phoneListのアクセス処理
function responsePhoneList(req, res){
    let text = "電話番号のリストです。";
    let content = ejs.render(phoneList_page, {
        title: "Phone Number List",
        content: text,
        data: phoneNumlist2,
        filename: 'data_item'
    });
    res.writeHead(200, { 'Content-type': 'text/html' });
    res.write(content);
    res.end();
}

// easyBBSのアクセス処理
function responseEasyBBS(req, res){
    // POST アクセス時の処理
    if (req.method == 'POST'){
        let body = '';

        // データ受信のイベント処理
        req.on('data', (data) => {
            body += data;
        });

        // データ受信終了のイベント処理
        req.on('end', () => {
            data = qs.parse(body);
            // クッキーの保存
            setCookie('msg', data.msg, res);
            write_easyBBS(req, res);
        });
    } else {
        write_easyBBS(req, res);
    }
}

function write_easyBBS(req, res){
    let msg = "Show message.";
    let cookie_data = getCookie('msg', req);
    let content = ejs.render(easyBBS_page, {
        title: "Easy BBS",
        content: msg,
        data: data,
        cookie_data: cookie_data,
    })
    res.writeHead(200, { 'Content-type': 'text/html' });
    res.write(content);
    res.end();
}

// クッキーの値を設定
function setCookie(key, value, res){
    let cookie = escape(value);
    res.setHeader('Set-Cookie', [key + '=' + cookie]);
}

// クッキーの値を取得
function getCookie(key, req){
    let cookie_data = req.headers.cookie != undefined ? req.headers.cookie : '';
    let data = cookie_data.split(';');
    for(let i in data){
        if(data[i].trim().startsWith(key + '=')){
            let result = data[i].trim().substring(key.length + 1);
            return unescape(result);
        }
    }
    return '';
}