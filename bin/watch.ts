import path from 'path';
import http from 'http';
import { watch } from 'chokidar';
import { buildAll } from './build';
import { createReloader } from './budo/reload-server';
import { createMiddleware } from './budo/middleware';

process.env.NODE_ENV = 'development';

const PORT = 1337;

const server = http.createServer(createMiddleware({
  dir: path.join(__dirname, '../dist')
}))

const watcher = watch('{src,layouts,pages,partials,static,style}/**/*.{html,ts,svg}', {
  usePolling: false,
  ignored: ['node_modules/**', '.git', '.DS_Store'],
  ignoreInitial: true
})

let reloader

(async function () {
  await buildAll()

  server.listen(PORT, undefined,  function connect () {
    reloader = createReloader(server)
  
    watcher.on('change', async () => buildAll().then(() => reloader.reload()))
  
    console.log(`Server running at http://localhost:${PORT}`)
  })  
})()
