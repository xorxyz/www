var fs = require('fs')
var path = require('path')
var mkdirp = require('mkdirp')
var pug = require('pug')
var matter = require('gray-matter')
var marked = require('marked')

const { DIR, MONTHS } = require('./constants.js')
const pugOpts = {
  basedir: path.join(__dirname, '../..'),
  filters: {},
  globals: [ formatDate ]
}

var renderer = new marked.Renderer()

module.exports = buildHTML

function buildHTML (data, feed) {
  var dynamicRoutes = []
  var pageFiles = DIR['templates/pages']
  var pages = listFilesRecursive(pageFiles).filter(page => {
    if (path.basename(page, '.pug')[0] === '_') {
      dynamicRoutes.push(page)

      return false
    }

    return true
  })

  renderer.image = createCustomRenderImageFn(renderer.image)
  data.routes = {}

  pages.forEach(page => {
    generatePage(page, null, null, data)
  })

  dynamicRoutes.forEach(src => generateRoute(data, src))

  console.log(data.routes)
}

function generateRoute (data, templateSrc) {
  var dirName = path.dirname(templateSrc).split('/').slice(-1)[0]
  var paramName = path.basename(templateSrc, '.pug').split('').slice(1).join('')
  var contentDir = path.join(__dirname, '../..', 'content', dirName)

  mkdirp.sync(contentDir)

  var filenames = fs.readdirSync(contentDir)
  var filepaths = filenames.map(filename => path.join(contentDir, filename))

  if (!data.routes[dirName]) {
    data.routes[dirName] = []
  }

  filepaths.forEach(filepath => {
    var content = fs.readFileSync(filepath, 'utf8')
    var dest = getDestination(filepath)
    var frontmatter = matter(content)
    var locals = {
      post: {
        data: frontmatter.data,
        content: marked(frontmatter.content, { renderer })
      }
    }

    generatePage(templateSrc, dest, locals, data)

    if (path.basename(path.dirname(filepath)) === 'news') {
      var item = {
        slug: path.basename(filepath, path.extname(filepath)),
        title: data.title,
        date: formatDate(data.date),
        author: data.author,
        category: data.category,
        tags: data.tags,
        blurb: data.blurb,
        alt: data.alt
      }

      feed.addItem(Object.assign({}, item, {
        content,
        updated: new Date(item.updated || item.date),
        date: new Date(item.date),
        description: item.blurb,
        link: 'https://xor.xyz/news/' + item.slug
      }))
    }
  })
}

function generatePage (src, dest, locals = {}, data) {
  var file = fs.readFileSync(src, 'utf8')
  var html = compilePug(src, file, locals, data)

  if (!dest) {
    dest = getDestination(src)
  }

  mkdirp.sync(path.dirname(dest))
  fs.writeFileSync(dest, html)
}

function compilePug (filename, content, locals, data) {
  if (!content) content = ''
  if (!locals) locals = {}
  if (!data) data = {}

  var opts = Object.assign({}, pugOpts, {
    filename
  })

  var env = Object.assign(locals, data, {
    formatDate
  })

  return pug.compile(content, opts)(env)
}

function getDestination (src) {
  var subdir = path
    .relative(DIR.root, path.dirname(src))
    .split(path.sep)
    .slice(1)
    .join(path.sep)

  if (subdir.indexOf('pages') > -1) {
    subdir = path.relative('pages', subdir)
  }

  var dir = path.join(DIR.dist, subdir)
  var ext = path.extname(src)
  var filename = path.basename(src, ext) + '.html'
  var dest = path.join(dir, filename)

  return dest
}

function listFilesRecursive (dir) {
  var filenames = fs.readdirSync(dir)

  var files = filenames.map(filename => {
    var filepath = path.join(dir, filename)

    return fs.statSync(filepath).isDirectory()
      ? listFilesRecursive(filepath)
      : filepath
  })

  return flatten(files)
}

function flatten (array) {
  return [].concat(...array)
}

function formatDate (value) {
  var d = new Date(value)

  return `${MONTHS[d.getMonth()]} ${d.getDate()} ${d.getFullYear()}`
}

function createCustomRenderImageFn (fn) {
  return function renderImage (href, title, text) {
    href = process.env.ASSET_URL + '/images/' + href

    return fn.call(renderer, href, title, text)
  }
}
