import { exit } from 'process';
import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';
import * as mkdirp from 'mkdirp';
import * as rimraf from 'rimraf';
import * as dotenv from 'dotenv';
import { Feed } from 'feed';

dotenv.config();

const getDirPath = (name: string) =>  path.join(__dirname, "..", name)

export default build;

if (require.main === module) {
  build();
  exit();
}

function build() {
  console.log('Building...');

  const feed = createRSSFeed()

  recreateDist();
  copyAssets();

  fs.writeFileSync('dist/rss', feed.rss2());
  fs.writeFileSync('dist/atom', feed.atom1());

  console.log('Done.');
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

function recreateDist() {
  rimraf.sync(getDirPath('dist'));
  mkdirp.sync(getDirPath('dist'));
}

function copyAssets() {
  fse.copySync(getDirPath('static'), getDirPath('dist'));
}
