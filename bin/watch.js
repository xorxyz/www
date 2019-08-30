var path = require('path')
var budo = require('budo')
var slashes = require('connect-slashes')
var build = require('./build')

runBuild()

var b = budo('./src/index.js', {
  live: false,
  port: 8000,
  pushstate: true,
  dir: path.join(__dirname, '../dist'),
  watchGlob: ['!dist/**', '**/*.{md,pug,styl,yml,png}'],
  staticOptions: {
    extensions: [ 'html' ]
  }
}).on('connect', e => {
  console.log('Listening on 8000')
}).on('watch', e => {
  runBuild()
  b.reload()
})

function runBuild () {
  try {
    build()
  } catch (err) {
    console.log('build failed:', err)
  }
}
