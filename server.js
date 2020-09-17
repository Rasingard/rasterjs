var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path')
http.createServer(
    function (request, response) {
        pathName = url.parse(request.url).pathname;
        if(path.extname(request.url) === '') pathName += '.js';
        fs.readFile(__dirname + pathName, function (err, data) {
            if (err) {
                response.writeHead(404, { 'Content-type': 'text/plan' });
                response.write('Page Was Not Found');
                response.end();
            } else {
                var mime;

                switch(path.extname(request.url)) {
                    case '.html':
                        mime = 'text/html';
                        break;
                    case '.js':
                    case '.obj':
                        mime = 'text/javascript';
                        break;
                    case '.jpg':
                    case '.png':
                        mime = 'text/javascript';
                        break;
                    default: mime = 'text/javascript';
                }

                response.writeHead(200, {"Content-Type": mime});
                response.write(data);
                response.end();
            }
        });
    }
).listen(8080);