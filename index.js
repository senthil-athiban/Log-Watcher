const express = require('express');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
const LogWatcher = require('./LogWatcher');

const PORT = 3000;
const app = express();
let executeFile = true;

const logWatcher = new LogWatcher('index.txt');
logWatcher.readLogFile();
let interval = logWatcher.testFile(executeFile);


// websocket initialization
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.get('/log', (req, res) => {
    return res.sendFile(path.join(__dirname + '/index.html'));
});

// websocket connection
wss.on('connection', (ws) => {
    console.log('WebSocket connection established in server');

    // send last ten lines on initial page load
    const initialData = logWatcher.getData();
    
    ws.send(JSON.stringify({type: 'initialLogs', data: initialData}));
    // send real-time updated data
    const sendData = (data) => {
        ws.send(JSON.stringify({ type: 'updatedLogs', data }));
    }

    ws.on('message', function message(data, isBinary) {
        const message = isBinary ? data : data.toString();
        if(message === "Stop") {
            clearInterval(interval);
        }
        else if (message === "Start") {
            interval = logWatcher.testFile(true);
        }
      });
    logWatcher.on('updatedLogs', sendData);
})

server.listen(PORT, () => console.log(`server started on ${PORT}`));