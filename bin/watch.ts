import * as esbuild from 'esbuild'
import { buildExceptTS } from './build'

(async function () {
  let ctx = await esbuild.context({
    entryPoints: ['src/index.ts'],
    outfile: 'dist/js/script.js',
    bundle: true,
    plugins: [{
      name: 'buildExceptTS',
      setup: build => build.onStart(buildExceptTS),
    }]
  })

  await ctx.watch()

  const { port } = await ctx.serve({ servedir: 'dist'})
  
  console.log(`Serving site at http://localhost:${port}`);
})()
