import { exit } from 'process';
import { writeFile, readFile, readdir, stat } from 'fs/promises';
import fse from 'fs-extra';
import path from 'path';
import { mkdirp } from 'mkdirp';
import { rimraf } from 'rimraf';
import * as dotenv from 'dotenv';
import { Feed } from 'feed';
import * as esbuild from 'esbuild'
import { Liquid } from 'liquidjs';
// import { compile, compileAsync } from 'sass';
// import data from '../data'

dotenv.config();

const getDirPath = (name: string) =>  path.join(__dirname, "..", name)

if (require.main === module) {
  buildAll().then(() => exit());
}

export async function buildAll() {
  console.log('Building...');

  await recreateDist()

  await Promise.all([
    buildTs(), 
    copyAssets(),
    buildHtml().then(buildRss),
    buildCss()
  ])

  console.log('Done.');
}

export async function buildHtml () {
  const engine = new Liquid({
    layouts: getDirPath('layouts'),
    partials: getDirPath('partials'),
    extname: '.html',
    cache: true,
  });
  
  const pageDir = getDirPath('pages')
  const outDir = getDirPath('dist')
  const files = await readdir(pageDir, { recursive: true })
  const ctx = await loadData()
  
  await Promise.all(files.map(async (filename) => {
    const filepath = path.join(pageDir, filename)

    if ((await stat(filepath)).isDirectory()) return

    const text = await readFile(filepath, 'utf8')
    const html = await engine.parseAndRender(text, ctx)
    const dest = path.join(outDir, filename)

    await mkdirp(path.dirname(dest))
    await writeFile(dest, html)
  }))
}

async function loadData() {
  const dir = '../data'
  const prefix = path.dirname(require.resolve(dir))
  const files = Object.keys(require.cache).filter(filename => filename.startsWith(prefix))

  files.forEach(file => delete require.cache[file])

  const data = await import(dir);

  return data.default;
}

export async function buildRss() {
  const feed = new Feed({
    title: 'The Wizard of Xor',
    description: 'The Wizard of Xor is a free computer security education program with original content built on a capture-the-flag framework created by security expert Jonathan Dupré.',
    id: 'https://xor.xyz/',
    link: 'https://xor.xyz/',
    language: 'en',
    favicon: 'https://xor.xyz/favicon.ico',
    copyright: '© 2019-2024, Jonathan Dupré.',
    generator: 'None',
    feedLinks: {
      atom: 'https://xor.xyz/atom',
      rss: 'https://xor.xyz/rss',
    },
    author: {
      name: 'Jonathan Dupré',
      link: 'https://jonathandupre.com',
    },
  })
  
  await Promise.all([
    writeFile('dist/rss', feed.rss2()),
    writeFile('dist/atom', feed.atom1())
  ])
}

export async function recreateDist() {
  await rimraf(getDirPath('dist'));
  await mkdirp(getDirPath('dist'));
}

export async function copyAssets() {
  await fse.copy(getDirPath('static'), getDirPath('dist'));
}

export async function buildTs() {
  await esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    minify: true,
    outfile: path.join(getDirPath('dist'), 'js/script.js'),
  })
}

export async function buildCss() {
  // try {
  //   const css = (await compileAsync(path.join(getDirPath('style'), 'index.scss'), { loadPaths: ['node_modules'] })).css
  //   await mkdirp(getDirPath('dist/css'))
  //   await writeFile(path.join(getDirPath('dist/css'), 'style.css'), css)
  // } catch (err) {
  //   console.log(err)
  // }
}
