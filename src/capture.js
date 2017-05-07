// require modules
const http = require('http');
const Camera = require('./camera.js');
// comment out on or the other to test out different ways of configuration
const config = require('./config-cli-parser.js');
// const config = require('./config-file-parser.js');
// create camera
const camera = new Camera(config);
// create server
const server = http.createServer((req, res) => {
  // serve the HTML page showing our picture
  if (req.url === '/') {
    res.writeHead(200, {
      'Content-Type': 'text/html;charset=utf-8'
    });
    res.write(`<!doctype html>
    <html>
    <head>
      <title>Raspberry Pi Camera</title>
      <meta charset="utf-8">
    </head>
    <body>
      <img src="static.jpg">
    </body>
    </html>`);
    res.end();
  }
  // server the picture itself
  if (req.url === '/static.jpg') {
    camera.capture()
      .then((frame) => {
        res.writeHead(200, {
          'Content-Type': 'image/jpeg',
          'Expires': 'Thu, Jan 01 1970 00:00:00 GMT',
          'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
          'Pragma': 'no-cache'
        });
        res.write(Buffer(frame));
        res.end();
      })
      .catch((e) => {
        res.writeHead(500, 'Server Error');
        res.write(e.message);
        res.end();
      });
  }
});
// start the HTTP server
server.listen(config.port, config.address);
// disconnect the camera when closing the script
process.on('exit', () => camera.destroy());
// let's tell the users where to connect
console.log(`Server listening at http://${config.address}:${config.port}`);