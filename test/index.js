var assert = require('assert')

var containerize = require('..')
var config = {
  // docker config
  host: 'http://localhost',
  port: 4243,
  // socketPath: '',
  
  // prefix for images and containers, eg 'prefix-appname' or 'prefix/imagename'
  prefix: 'test',
  monitor: false, // whether to monitor the node process or not (defaults to true)
  run: true // whether to run the container or not (defaults to true)
}

configTest()

function configTest () {
  process.env.DOCKER_HOST = 'tcp://192.168.13.37:4243'

  // empty, with DOCKER_HOST
  var conf = containerize._setup()
  assert.equal(conf.port, 4243)
  assert.equal(conf.host, 'tcp://192.168.13.37')
  assert(conf.monitor)

  // empty, without DOCKER_HOST
  process.env.DOCKER_HOST = null
  conf = containerize._setup(function() {})
  assert(!conf.port)
  assert(!conf.host)
  assert(conf.run)

  // with stuff
  conf = containerize._setup(config)
  assert.equal(conf.port, config.port)
  assert.equal(conf.host, config.host)
  assert.equal(conf.prefix, config.prefix)
  assert(conf.run)

  conf = containerize._setup({ run: false, monitor: false })
  assert.strictEqual(conf.run, false)
  assert.strictEqual(conf.monitor, false)
}

// pass it the directory of your node app, config is optional
containerize(__dirname + '/testrepo', config, function (err, container) {
  if (err) throw err
  console.log(container)
  console.log('DONE')
})

// whithout config
// containerize(__dirname + '/testrepo', function (err, container) {
//   if (err) throw err
//   console.log('DONE')
//   console.log(container)
// })