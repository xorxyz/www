// @ts-nocheck

// The MIT License (MIT) Copyright (c) 2015 Matt DesLauriers

// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var onResHeaders = require('on-headers')
var onResFinished = require('on-finished')

module.exports = simpleHttpLoggerMiddleware
function simpleHttpLoggerMiddleware (opts) {
  opts = opts || {}

  var httpLogger = function simpleHttpLogger (req, res, next) {
    if (httpLogger.ignores.indexOf(req.url) >= 0) return next()
    if (!req.url) return next()

    // request data
    req._startAt = undefined

    // response data
    res._startAt = undefined

    // record request start
    recordStartTime.call(req)

    var byteLength = 0
    var logRequest = function () {
      if (!req._startAt || !res._startAt) {
        // missing request and/or response start time
        return
      }
    }

    var isAlreadyLogging = res._simpleHttpLogger
    res._simpleHttpLogger = true

    if (!isAlreadyLogging) {
      // record response start
      onResHeaders(res, recordStartTime)

      // log when response finished
      onResFinished(res, logRequest)

      var writeFn = res.write

      // catch content-length of payload
      res.write = function (payload) {
        if (payload) byteLength += payload.length
        return writeFn.apply(res, arguments)
      }
    }

    next()
  }

  httpLogger.ignores = [].concat(opts.ignores).filter(Boolean)
  httpLogger.type = 'static'
  return httpLogger
}

function recordStartTime () {
  this._startAt = process.hrtime()
}