node-container
===
Create a docker container from a node app and run it, because we're hipster like that.

## WIP don't use for serious apps yet!

## Installation

`npm install node-container`

## Usage

Give it the path of your node app...it'll do the rest (ideally).
_Note:__ The docker daemon needs to run somewhere accessible.

You can do `npm test` to see it in action.

```javascript
var containerize = require('node-container')
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
```

## What does it do exactly?

1. It `npm pack`s your app, so you get all the npm goodies you expect
2. Copies over our Dockerfile
3. Build an image from our Dockerfile with your app in it. The image provides
  - a stable, updated ubuntu 12.04 base system
  - the latest stable node version
  - the mon process monitor (`visionmedia/mon`) to keep your app running
  - and runs `npm install --production` for your app
4. Runs a container from the image
  - which runs `npm start` for your app
  - and monitors it with `mon`

## What do I need to do?

1. If your app listens to a port, it has to get it from `process.env.PORT`
2. If you want to listen to a specific port, you can specify it in your package.json with `port: 1234` otherwhise it defaults to `3000`. If you don't want to expose it to the world you can set `port: false`
3. Your app needs to be runnable with `npm start`

Take a look add the test app.

## Wishlist

* use node version as specified in package.json
* persistent volume support
* be more flexible wrt docker run options etc
* evaluate if it's possible to run apps as non-root user

## Contributing

If you find a bug, have a feature request or any kind of question, please open
an issue or submit a pull request. I'm open for discussing any kind of idea for node-container.
