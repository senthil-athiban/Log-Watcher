const fs = require('fs');
let counter = 1;
fs.appendFile('index.txt', '\n' + new Date() + ":" + counter.toString(), (err) => {
    if (err) throw err;
    counter++;
    console.log('The "data to append" was appended to file!');
  });

setInterval(() =>  {
    fs.appendFile('index.txt', '\n' + new Date() + ":" + counter.toString(), (err) => {
        if (err) throw err;
        counter++;
        console.log('The "data to append" was appending to file!');
      })
}, 1000);