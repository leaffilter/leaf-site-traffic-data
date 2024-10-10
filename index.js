const fs = require('fs');
const path = require('path');
const parse = require('csv-parse');

async function main() {
  console.log('--- main running');
  const jsonDirectory = './data';
  const directory = fs.readdirSync(jsonDirectory);
  console.log('--- main: directory - ', directory.length);
  const files = directory.filter((file) => {
    return path.extname(file) === '.csv';
  });

  const outputDirectory = './output';
  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory);
    console.log('--- main: folder created - ', outputDirectory);
  }
  
  console.log('--- main: files - ', files.length);
  files.forEach((file) => {
    const data = fs.readFileSync(path.join(jsonDirectory, file));
    const json = JSON.parse(data.toString());
    const domain = getDomain(file);
  });
}
main();

