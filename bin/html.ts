const fs = require('fs');
const path = require('path');

import posthtml from "posthtml";

const templateFiles = loadFilesFromDir(path.join(__dirname, '../src/templates'));
const pageFiles = loadFilesFromDir(path.join(__dirname, '../src/pages'));

const templates = {};

templateFiles.forEach(file => {
  const templateName = path.basename(file, '.html');
  const content = fs.readFileSync(file, 'utf-8');
  const node = posthtml().process(content, { sync: true });

  templates[templateName] = node;
});

// console.log(pageFiles)

(async function () {
  const content = fs.readFileSync(pageFiles[0], 'utf-8');
  const result = await processPage(content)
  console.log('done', result.html)
})()

// pageFiles.forEach(file => {
//   const content = fs.readFileSync(file, 'utf-8');
  
//   console.log(processPage(content))
//   // replaceCustomElements(doc.childNodes[0], templates);
//   // const modifiedContent = serialize(doc);
//   // console.log(modifiedContent)
//   // Save modified content back to the file
//   // fs.writeFileSync(file, modifiedContent, 'utf-8');
// });



async function processPage(html: string) {
  const result = await posthtml()
    .use(function (tree) {
      tree.walk(node => {
        if (node && node.tag && node.tag.startsWith('wox-')) {
          console.log('found one!', node.content)
        }
        return node
      })
    })
    .process(html, { sync: true });

  return result
}




function loadFilesFromDir(dirPath) {
  return fs.readdirSync(dirPath).map(file => path.join(dirPath, file));
}

// function replaceCustomElements(node: ChildNode, templates) {
//   // console.log('node:', node)
//   if (node && node.nodeName.startsWith('wox-')) {
//       console.log('it does!')
//   //   const templateName = node.nodeName.replace('wox-', '').replace('-', '_');
//   //   if (templates[templateName]) {
//   //     const template = templates[templateName].cloneNode(true);
//   //     const slots = node.childNodes;
//   //     slots.forEach(slot => template.appendChild(slot));
//   //     node.replaceWith(template);
//   //     // Process template's children recursively
//   //     template.childNodes.forEach(childNode => replaceCustomElements(childNode, templates));
//   //   }
//   // } else {
//   //   node.childNodes.forEach(childNode => replaceCustomElements(childNode, templates));
//   }
// }
