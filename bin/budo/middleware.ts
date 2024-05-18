// @ts-nocheck

// The MIT License (MIT) Copyright (c) 2015 Matt DesLauriers

// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var fs = require('fs')
var path = require('path')
var stacked = require('stacked')
var serveStatic = require('serve-static')
var liveReload = require('inject-lr-script')
var escapeHtml = require('escape-html')
var logger = require('./simple-http-logger')

var bundledReloadClientFile = path.resolve(__dirname, 'bundled-livereload-client.js')

// Patch 'wasm' since send has not yet been updated to latest 'mime' module
serveStatic.mime.types['wasm'] = 'application/wasm'

export function createMiddleware (opts = {}) {
  var staticPaths = [].concat(opts.dir).filter(Boolean)
  if (staticPaths.length === 0) {
    staticPaths = [ process.cwd() ]
  }

  var live = true
  var cors = opts.cors
  var handler = stacked()
  var middlewares = [].concat(opts.middleware).filter(Boolean)

  // Everything is logged except favicon.ico
  var ignoreLog = [].concat(opts.ignoreLog).filter(Boolean)
  var logHandler = logger({
    ignores: [ '/favicon.ico' ].concat(ignoreLog)
  })
  handler.use(function (req, res, next) {
    if (cors) {
      res.setHeader('Access-Control-Allow-Headers', 'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With')
      res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST')
      res.setHeader('Access-Control-Allow-Origin', '*')
    }
    logHandler(req, res, next)
  })

  // User middleware(s) can override others
  middlewares.forEach(function (middleware) {
    if (typeof middleware !== 'function') {
      throw new Error('middleware options must be functions')
    }
    handler.use(function (req, res, next) {
      logHandler.type = 'middleware'
      middleware(req, res, next)
    })
  })

  // Inject liveReload snippet on response
  var liveInjector = liveReload({
    local: true
  })
  // this is lazily set and cannot be changed dynamically
  var liveScriptUrl
  // By default, attempt to optimize the response
  var shouldUseBundledLiveReload = true
  // Cache the client by default to optimize the response
  var liveReloadClient
  handler.use(liveReloadHandler)

  // Static assets (html/images/etc)
  staticPaths.forEach(function (rootFile) {
    var staticOpts = {
      cacheControl: false,
      extensions: ['html'],
      // index: true
    }

    var staticHandler = serveStatic(rootFile, staticOpts)
    handler.use(function (req, res, next) {
      logHandler.type = 'static'
      staticHandler(req, res, next)
    })
  })

  // Ignore favicon clutter
  handler.mount('/favicon.ico', favicon)

  // Handle errors
  handler.use(function (req, res) {
    res.statusCode = 404
    res.end('404 not found: ' + escapeHtml(req.url))
  })

  // Allow live options to be changed at runtime
  handler.setLiveOptions = setLiveOptions
  return handler

  function setLiveOptions (opts) {
    live = opts
  }

  function favicon (req, res) {
    var maxAge = 345600 // 4 days
    res.setHeader('Cache-Control', 'public, max-age=' + Math.floor(maxAge / 1000))
    res.setHeader('Content-Type', 'image/x-icon')
    res.statusCode = 200
    res.end()
  }

  function serveBundledLiveReload (res, successCallback) {
    if (liveReloadClient) {
      res.end(liveReloadClient)
      successCallback(true)
    } else {
      fs.readFile(bundledReloadClientFile, function (err, src) {
        if (err) {
          if (shouldUseBundledLiveReload) {
            if (err.code == 'ENOENT') {
              console.error('[budo] The LiveReload client file does not exist, so it will be generated on the fly.');
            } else {
              console.error('[budo] Error reading the LiveReload client file, so it will be generated on the fly.\n  ' + err.message);
            }
          }
          shouldUseBundledLiveReload = false
          successCallback(false)
        } else {
          liveReloadClient = src
          res.end(src)
          successCallback(true)
        }
      })
    }
  }

  function liveReloadHandler (req, res, next) {
    if (!live || live.plugin) return next()
    if (!liveScriptUrl) {
      liveScriptUrl = live.path || '/budo/livereload.js'
      logHandler.ignores.push(liveScriptUrl)
    } else if (liveScriptUrl && live.path && liveScriptUrl !== live.path) {
      var errMessage = 'Error: The LiveReload path field cannot be changed dynamically.\n' +
          'Please open an issue in budo if you have a specific use case for this.'
      console.error(errMessage)
      res.statusCode = 500
      res.end(errMessage)
      return
    }

    if (req.url === liveScriptUrl) {
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/javascript')

      serveBundledLiveReload(res, function (success) {
        // fall back to browserify on the fly
        if (!success) throw new Error('Failed to serveBundledLiveReload()')
      })
    } else {
      liveInjector.path = liveScriptUrl
      liveInjector(req, res, next)
    }
  }
}
