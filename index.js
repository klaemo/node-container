var path = require('path')
var fs = require('fs')

var Docker = require('dockerode')
var archiver = require('archiver')
var FN = require('fstream-npm')
var rimraf = require('rimraf')

var TMPDIR = require('os').tmpdir() || '/tmp'

module.exports = function containerize (conf, dir, done) {
  conf.run = 'run' in conf ? conf.run : true

  var docker = new Docker(conf)
  var pkg = require(path.resolve(dir, 'package.json'))

  // build image from Dockerfile
  build(pkg, function (err, tag, tmp) {
    if (err) return done(err)
    
    // remove temp dir
    rimraf(tmp, function (err) {
      if (err) return done(err)
      
      // run the container
      if (conf.run)
        run(tag, pkg, done)
      else
        done(null, {})
    })
  })

  function build (pkg, cb) {
    var tag = pkg.name + ':' + pkg.version
    if (conf.prefix) tag = conf.prefix + '/' + tag
    
    npmpack(dir, pkg.name, function (err, src) {
      if (err) return cb(err)

      var tar = pack(src)
      tar.finalize()
      tar.on('error', cb)
    
      docker.buildImage(tar, { t: tag, rm: true }, function (err, stream) {
        if (err) return cb(err)
        
        stream.on('data', function (chunk) {
          if (process.env.DEBUG) {
            console.log(JSON.parse(chunk).stream)
          }
        })

        stream.on('error', cb)
        stream.on('end', function () {
          cb(null, tag, src)
        })
      })
    })
  }

  function run (image, pkg, cb) {
    var name = conf.prefix ? 'taco-' + pkg.name : pkg.name
    
    docker.createContainer({
      Image: image,
      name: name,
      Env: [ 'PORT=3000' ]
    }, function (err, container) {
      if (err && err.statusCode == 409) {
        clean(name, function (err, data) {
          if (err) return cb(err)
          run(image, pkg, cb)
        })
        return
      }
      if (err) return cb(err)

      container.start(function (err, data) {
        if (err) return console.error(err)
        cb(null, container)
      })
    })
  }

  function clean (name, cb) {
    var container = docker.getContainer(name)
    container.stop(function (err, data) {
      if (err) return cb(err)
      container.remove(cb)
    })
  }
}

function npmpack (dir, name, cb) {
  var p = path.resolve(TMPDIR, name)
  var packer = FN({ path: dir })
  packer.on('error', cb)
  
  var writer = require('fstream').Writer({
    path: p,
    type: "Directory"
  })
  writer.on('error', cb)

  packer.pipe(writer)

  writer.on('end', function () {
    cp(p, function (err) {
      cb(err, p)
    })
  })
}

function pack (src) {
  var archive = archiver('tar')
  archive.bulk([{ expand: true, cwd: src, src: '**' } ])
  return archive
}

/**
 * Copy Dockerfile into temp dir
 * @param  {string}   target Path of temp dir
 * @param  {Function} cb     Callback
 */
function cp (target, cb) {
  fs.createReadStream(path.resolve(__dirname, 'Dockerfile'))
    .on('error', cb)
    .pipe(fs.createWriteStream(path.resolve(target, 'Dockerfile')))
    .on('error', cb)
    .on('finish', cb)
}

var opts = {
  "Hostname":"",
  "User":"",
  "Memory":0,
  "MemorySwap":0,
  "AttachStdin":false,
  "AttachStdout":true,
  "AttachStderr":true,
  "PortSpecs":null,
  "Tty":false,
  "OpenStdin":false,
  "StdinOnce":false,
  "Env":null,
  "Cmd":[
    "date"
  ],
  "Dns":null,
  "Image":"base",
  "Volumes":{
    "/tmp": {}
  },
  "VolumesFrom":"",
  "WorkingDir":"",
  "ExposedPorts":{
    "22/tcp": {}
  }
}