var http = require('http')
var hat = require('hat')

if (!process.env.PORT) {
  console.log('No one can see me so I crash :(')
  process.exit(1)
}

http.createServer(function(req, res) { res.end('num: ' + hat()) }).listen(process.env["PORT"])