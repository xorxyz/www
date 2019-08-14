var fse = require('fs-extra')

const { DIR } = require('./constants.js')

module.exports = copyAssets

function copyAssets () {
  fse.copySync(DIR.public,  DIR.dist)
}
