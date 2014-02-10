var containerize = require('..')
var conf = {
  // docker config
  host: 'http://localhost',
  port: 4243,
  // socketPath: '',
  
  // prefix for images and containers
  prefix: 'taco',
  run: true //wether to run the container or not (defaults to true)
}

containerize(conf, __dirname + '/testrepo', function (err, container) {
  if (err) throw err
  console.log(container)
})