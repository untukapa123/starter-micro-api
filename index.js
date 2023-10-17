const http = require('http');
const httpProxy = require('http-proxy');

// Konfigurasi target URL
const target = 'https://d3j4fjrwclc3o8.cloudfront.net/CH1/indexCH1.m3u8';

const proxy = httpProxy.createProxyServer({});

http.createServer((req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        // Handle preflight requests
        res.writeHead(200);
        res.end();
    } else {
        // Proxy the request to the target URL
        proxy.web(req, res, { target });
    }
}).listen(process.env.PORT || 3000);
