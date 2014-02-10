var http = require('http')
var hat = require('hat')
http.createServer(function(req, res) { res.end('num: ' + hat()) }).listen(process.env["PORT"])