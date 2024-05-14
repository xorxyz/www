import path from 'path';
import budo from 'budo';
import { buildAll } from './build';

process.env.NODE_ENV = 'development';

const PORT = 1337;
const b = budo(path.join(__dirname, '../noop.js'), {
  live: true,
  port: PORT,
  dir: path.join(__dirname, '../dist'),
  watchGlob: ['{src,html,static}/**/*.{html,css,ts}', '!**/*_fake.js'],
  staticOptions: {
    extensions: ['html'],
  },
  verbose: true
}).on('connect', async () => {
  await buildAll();
  console.log(`Serving site at http://localhost:${PORT}`);
}).on('watch', async () => {
  await buildAll();
  b.reload();
});
