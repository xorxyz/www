var rimraf = require('rimraf')
var mkdirp = require('mkdirp')

const { DIR } = require('./constants')

module.exports = recreateDist

function recreateDist () {
  rimraf.sync(DIR.dist)
  mkdirp.sync(DIR.dist)
}
