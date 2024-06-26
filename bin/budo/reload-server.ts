// @ts-nocheck

// The MIT License (MIT) Copyright (c) 2015 Matt DesLauriers

// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var WebSocketServer = require('ws').Server
var path = require('path')

export function createReloader(server) {
  const opts = {}

  // get a list of static folders to use as base dirs
  var cwd = path.resolve(opts.cwd || process.cwd())
  var staticDirs = [] //Array.isArray(opts.dir) ? opts.dir : [ opts.dir ]
  staticDirs = staticDirs.map(function (dir) {
    return path.resolve(dir)
  })
  if (staticDirs.indexOf(cwd) === -1) staticDirs.push(cwd)

  var closed = false
  var wss = new WebSocketServer({
    server: server,
    perMessageDeflate: false
  })

  return {
    webSocketServer: wss,
    reload: reload,
    errorPopup: errorPopup,
    close: function () {
      if (closed) return
      wss.close()
      closed = true
    }
  }

  function errorPopup (message) {
    message = message || ''
    broadcast({ event: 'error-popup', message: message })
  }

  function reload (file?: string) {
    if (closed) return
    var url, ext

    if (file && typeof file === 'string') {
      // absolute file path
      file = path.isAbsolute(file) ? path.normalize(file) : path.resolve(cwd, file)

      // make it relative, removing the static folder parts
      for (var i = 0; i < staticDirs.length; i++) {
        var dir = staticDirs[i]
        url = path.relative(dir, file)
        // if the path doesn't starts with "../", then
        // it should be relative to this folder
        if (!/^(\.\.[/\\]|[/\\])/.test(url)) break
      }

      // turn it into a URL
      url = url.replace(/\\/g, '/')

      // ensure it starts at root of app
      if (url.charAt(0) !== '/') url = '/' + url

      ext = path.extname(file)
    }

    broadcast({ event: 'reload', ext: ext, url: url })
  }

  function broadcast (data) {
    if (closed) return
    data = JSON.stringify(data)
    try {
      wss.clients.forEach(function (client) {
        if (client.readyState === client.OPEN) {
          client.send(data, {
            binary: false
          })
        }
      })
    } catch (err) {
      console.error('ERROR: Error sending LiveReload event to client:')
      console.error(err)
    }
  }
}
