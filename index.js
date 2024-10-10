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
    return path.extname(file) === '.json';
  });

  const outputDirectory = './ui/src/assets/output';
  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory);
    console.log('--- main: folder created - ', outputDirectory);
  }
  
  console.log('--- main: files - ', files.length);
  files.forEach((file) => {
    const data = fs.readFileSync(path.join(jsonDirectory, file));
    const json = JSON.parse(data.toString());
    const intervals = json.result.time_intervals;
    const metrics = json.result.data[0]['metrics'][0];
    console.log(metrics);

    result = handleData(intervals, metrics);
    reportData(file);
    fs.writeFileSync(path.join(outputDirectory, file), JSON.stringify(result, null, 4), 'utf8');
  });
}
main();

function reportData(file) {
  console.log('=== file: ', file);
  console.table(result);
}

function handleData(intervals, metrics) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const result = [];

  for (let i = 0, len = intervals.length; i < len; i++) {
    const interval = intervals[i];
    const metric = metrics[i];
    
    const day = new Date(interval[0]);
    const dayOfWeek = day.getDay();
    const hour = day.getHours();

    if (result[hour] === undefined) {
      result[hour] = { [dayOfWeek]: metric };
    } else {
      result[hour][dayOfWeek] = metric;
    }
  }

  return result;
}
