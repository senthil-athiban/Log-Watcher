const events = require("events");
const fs = require("fs");
const buffer = require("buffer");

const bf = new Buffer.alloc(buffer.constants.MAX_STRING_LENGTH);

class LogWatcher extends events.EventEmitter {
    constructor(file) {
        super();
        this.queue = [];
        this.file = file;
    }

    getData() {
        return this.queue;
    }

    testFile(execute) {

        let counter = 1;
        fs.appendFile('index.txt', '\n' + new Date() + ":" + counter.toString(), (err) => {
            if (err) throw err;
            counter++;
            console.log('The "data to append" was appended to file!');
        });

        const interval = setInterval(() => {
            fs.appendFile('index.txt', '\n' + new Date() + ":" + counter.toString(), (err) => {
                if (err) throw err;
                counter++;
                console.log('The "data to append" was appending to file!');
            })
        }, 1000);

        return interval;
    }

    watchLogFile(curr, prev) {
        fs.open(this.file, "r", (err, fd) => {
            if (err) {
                throw err;
            }
            let slicedData = "";
            let logs = [];
            fs.read(fd, bf, 0, bf.length, curr.size, (err, bytesRead) => {
                if (err) {
                    throw err;
                }
                if (bytesRead > 0) {
                    slicedData = bf.slice(0, bytesRead).toString();
                    logs = slicedData.split("\n").slice(1);
                    if (logs.length >= 10) {
                        logs.slice(-10).map((i) => this.queue.push(i));
                    } else {
                        logs.map((i) => {
                            if (this.queue.length === 10) {
                                this.queue.shift();
                            }
                            this.queue.push(i);
                        });
                    }
                    this.emit("updatedLogs", logs);
                }
            });
        });
    }

    readLogFile() {
        fs.open(this.file, "r", (err, fd) => {
            if (err) {
                throw err;
            }
            let slicedData = "";
            let logs = [];
            fs.read(fd, bf, 0, bf.length, 0, (err, bytesRead) => {
                if (err) {
                    throw err;
                }
                if (bytesRead > 0) {
                    slicedData = bf.slice(0, bytesRead).toString();
                    logs = slicedData.split("\n");
                    logs.slice(-10).map((i) => this.queue.push(i));
                }
                fs.close(fd);
            });

        });
        fs.watchFile(this.file, { interval: 1000 }, (curr, prev) => this.watchLogFile(prev, curr)
        );
    }
}

module.exports = LogWatcher;
