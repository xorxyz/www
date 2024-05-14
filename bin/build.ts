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

dotenv.config();

const getDirPath = (name: string) =>  path.join(__dirname, "..", name)

if (require.main === module) {
  buildAll().then(() => exit());
}

export async function buildAll() {
  console.log('Building...');

  await recreateDist()

  await Promise.all([buildTs(), buildExceptTS()])

  console.log('Done.');
}

export async function buildExceptTS () {
  await Promise.all([
    copyAssets(),
    buildHtml().then(buildRss),
  ])
}

async function buildHtml () {
  const engine = new Liquid({
    layouts: getDirPath('html/layouts'),
    partials: getDirPath('html/partials'),
    extname: '.html',
    cache: true,
  });
  
  const pageDir = getDirPath('html/pages')
  const outDir = getDirPath('dist')
  const files = await readdir(pageDir, { recursive: true })
  
  await Promise.all(files.map(async (filename) => {
    const filepath = path.join(pageDir, filename)

    if ((await stat(filepath)).isDirectory()) return

    const text = await readFile(filepath, 'utf8')
    const html = await engine.parseAndRender(text)
    const dest = path.join(outDir, filename)

    await mkdirp(path.dirname(dest))
    await writeFile(dest, html)
  }))
}

async function buildRss() {
  const feed = createRSSFeed()
  
  await Promise.all([
    writeFile('dist/rss', feed.rss2()),
    writeFile('dist/atom', feed.atom1())
  ])
}

function createRSSFeed() {
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
  });

  return feed;
}

async function recreateDist() {
  await rimraf(getDirPath('dist'));
  await mkdirp(getDirPath('dist'));
}

async function copyAssets() {
  await fse.copy(getDirPath('static'), getDirPath('dist'));
}

async function buildTs() {
  await esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    minify: true,
    outfile: path.join(getDirPath('dist'), 'js/script.js'),
  })
}
