const http = require('http');
const https = require('https');
const { URL } = require('url');

http.createServer((req, res) => {
    if (req.url.startsWith('/')) {
        const targetUrl = `https:${req.url}`; // Konstruksi URL target dari permintaan
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
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
}).listen(process.env.PORT || 3000);
