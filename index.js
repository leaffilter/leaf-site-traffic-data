const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

let result = [];

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
    result = [];
    fs.createReadStream(path.join(jsonDirectory, file))
      .pipe(csv())
      .on('data', handleData)
      .on('end', reportData.bind(null, file));
  });
}
main();

function handleData(line) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const timeString = line['_1'];
  if (timeString === 'Collection Time') return;

  const day = new Date(timeString);
  const dayOfWeek = days[day.getDay()];
  const hour = day.getHours();

  if (result[hour] === undefined) {
    result[hour] = { [dayOfWeek]: 1 };
  } else {
    if (result[hour].hasOwnProperty(dayOfWeek) === false) {
      result[hour][dayOfWeek] = 1;
    } else {
      result[hour][dayOfWeek]++;
    }
  }
  // console.log(timeString, day.getHours(), dayOfWeek, hour, result[dayOfWeek]);
}

function reportData(file) {
  console.log('=== file: ', file);
  console.table(result);
}
