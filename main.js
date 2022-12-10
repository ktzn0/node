const http = require("http");

http.createServer((req, res) =>
{
    res.writeHead(200);
    res.end("hi");
}).listen(80);