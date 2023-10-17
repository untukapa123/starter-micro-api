const http = require('http');
const https = require('https');
const { URL } = require('url');

http.createServer((req, res) => {
    const requestUrl = req.url;
    const urlParts = requestUrl.split('/');

    if (urlParts.length < 3) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid URL format');
        return;
    }

    const targetUrl = urlParts.slice(2).join('/'); // Mengambil URL target
    console.log(`Proxying request to: ${targetUrl}`);

    const options = new URL(targetUrl);
    const requestOptions = {
        hostname: options.hostname,
        path: options.pathname + options.search,
        method: req.method,
        headers: req.headers
    };

    const proxyReq = https.request(requestOptions, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
    });

    req.pipe(proxyReq, { end: true });

    proxyReq.on('error', (error) => {
        console.error('Error:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    });
}).listen(process.env.PORT || 3000);
