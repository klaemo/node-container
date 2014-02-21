var containerize = require('..')
var config = {
  // docker config
  host: 'http://localhost',
  port: 4243,
  // socketPath: '',
  
  // prefix for images and containers, eg 'prefix-appname' or 'prefix/imagename'
  prefix: 'tests',
  run: true //wether to run the container or not (defaults to true)
}

// pass it the directory of your node app, config is optional
containerize(__dirname + '/testrepo', config, function (err, container) {
  if (err) throw err
  console.log('DONE')
  console.log(container)
})