require('dotenv').config()

var recreateDist = require('./build/mkdir.js')
var copyAssets = require('./build/copy-assets.js')
var loadData = require('./build/load-data.js')
var buildHTML = require('./build/build-html.js')
var buildCSS = require('./build/build-css.js')
var feed = require('./build/build-feed.js')

if (require.main === module) {
  build()
} else {
  module.exports = build
}

function build () {
  var data = loadData()

  recreateDist()
  copyAssets()
  buildHTML(data, feed)
  buildCSS()

  feed.build()
}

