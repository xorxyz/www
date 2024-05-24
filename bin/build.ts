import { exit } from 'process';
import { writeFile, readFile, readdir, stat } from 'fs/promises';
import fse from 'fs-extra';
import path from 'path';
import { mkdirp } from 'mkdirp';
import { rimraf } from 'rimraf';
import * as dotenv from 'dotenv';
import { Feed } from 'feed';
import * as esbuild from 'esbuild'
import { Liquid, Output, Tag, Value } from 'liquidjs';
import * as marked from 'marked';
import matter from 'gray-matter';
// import { compile, compileAsync } from 'sass';

dotenv.config();

const getDirPath = (name: string) =>  path.join(__dirname, "..", name)

let _engine

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

function createLiquidEngine () {
  if (_engine) return _engine
  _engine = new Liquid({
    layouts: getDirPath('layouts'),
    partials: getDirPath('partials'),
    extname: '.html',
    cache: false,
  });

  _engine.registerTag('markdown', {
    parse(tagToken, remainTokens, liquid) {
      this.tokens = [];

      let stream = this.liquid.parser.parseStream(remainTokens)
        .on('token', token => {
          if (token.name === "endmarkdown") {
            stream.stop();
          } else {
            this.tokens.push(token);
          }
        })
        .on('end', () => {
          stream.stop();
        });
  
      stream.start();
    },
    * render(context, emitter) {
      const text = this.tokens.map(token => token.getText()).join('')
      const content = marked.marked(text, { async: false })
      emitter.write(content)
    }
  }) 

  return _engine
}

interface Page {
  filepath: string
  filename: string
}

export async function listPages() {
  const pageDir = getDirPath('pages')
  const dynamicPages: Array<Page> = []
  const staticPages: Array<Page> = []

  for (let filename of await readdir(pageDir, { recursive: true })) {
    const filepath = path.join(pageDir, filename)
    const stats = await stat(filepath)

    if (!stats.isDirectory()) {
      if (path.basename(filename).startsWith('_')) {
        dynamicPages.push({filename, filepath})
      } else {
        staticPages.push({filename, filepath})
      }
    }
  }

  return {
    dynamicPages,
    staticPages
  }
}

export async function buildHtml () {
  const { dynamicPages, staticPages } = await listPages()
  
  const data = await loadData()

  const contentList = await generateContentList(dynamicPages)
  const contentByKey = indexContentByKey(contentList)

  const ctx = { ...data, ...contentList, by_key: contentByKey }

  for (let page of dynamicPages) {
    const text = await readFile(page.filepath, 'utf8')
    await buildDynamicPages(page.filepath, text, ctx)
  }

  for (let page of staticPages) {
    const text = await readFile(page.filepath, 'utf8')
    const dest = path.join(getDirPath('dist'), page.filename)
    await buildPage(text, dest, ctx)
  }
}

async function buildPage(text: string, dest: string, ctx: Record<any, any>) {
  const engine = createLiquidEngine()
  const html = await engine.parseAndRender(text, ctx)

  await mkdirp(path.dirname(dest))
  await writeFile(dest, html)
}

async function generateContentList(dynamicPages: Array<Page>) {
  let list: Record<string, Array<any>> = {}

  for (let page of dynamicPages) {
    const templateSrc = page.filepath
    const subDir = path.relative(getDirPath('pages'), path.dirname(templateSrc))
    const contentDir = path.join(getDirPath('content'), subDir)
    const contentFiles = await readdir(contentDir)
    const contentList: Array<Record<string, any>> = []
  
    await Promise.all(contentFiles.map(async (filename) => {
      const mdSrc = path.join(contentDir, filename)
      const md = await readFile(mdSrc, 'utf8')
      const frontmatter = matter(md)
  
      contentList.push({
        slug: path.basename(filename, '.md'),
        meta: frontmatter.data
      })
    }))
  
    const pages = {
      [subDir.replace('/', '_')]: contentList
    }

    list = { 
      ...list, 
      ...pages
    }
  }

  return list
}

function indexContentByKey (contentList: Record<string, Array<any>>) {
  const contentByKey: Record<string, Record<string, any>> = {}

  Object.entries(contentList).forEach(([key, items]) => {
    if (!contentByKey[key]) contentByKey[key] = {}
    items.forEach(item => {
      contentByKey[key][item.slug] = item
    })
  })

  return contentByKey
}

async function buildDynamicPages(templateSrc: string, templateText: string, ctx: Record<any, any>) {
  const engine = createLiquidEngine()
  const renderer = new marked.Renderer();

  const subDir = path.relative(getDirPath('pages'), path.dirname(templateSrc))

  const contentDir = path.join(getDirPath('content'), subDir)
  const outDir = path.join(getDirPath('dist'), subDir)

  const contentFiles = await readdir(contentDir)
  const contentList: Array<Record<string, string>> = []

  await Promise.all(contentFiles.map(async (filename) => {
    const mdSrc = path.join(contentDir, filename)
    const md = await readFile(mdSrc, 'utf8')
    const frontmatter = matter(md)
    // const content = marked.marked(frontmatter.content, { renderer });
    const content = await engine.parseAndRender(marked.marked(frontmatter.content, { renderer }), { ...ctx })

    const fullCtx = { ...ctx, meta: frontmatter.data, content }

    const html = await engine.parseAndRender(templateText, fullCtx)
    const dest = path.join(outDir, path.basename(filename, '.md') + '.html')

    await mkdirp(path.dirname(dest))
    await writeFile(dest, html)

    contentList.push({
      slug: path.basename(filename, '.md'),
      title: frontmatter.data.title
    })
  }))
  
  const pages = {
    [subDir.replace('/', '_')]: contentList
  }

  return pages
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
    // minify: true,
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
