# Log-Watcher

Log-Watcher is a Node.js application that mimics the behavior of the `tail -f` command in UNIX, allowing users to monitor the last lines of a log file in real-time as updates are made.

## Features

- `Access Last Ten Lines:` Retrieve and display the last ten lines of a log file on initial load.
- `Real-Time Streaming:` Stream new lines to the frontend immediately as they are appended to the log file, giving real-time visibility.

## Tools and Libraries

- Node.js `fs` library: Used to read, open, watch, and write to the log files.
- `WebSocket`: Enables real-time data transfer between the client and server, ensuring seamless streaming of new log lines as they are added.

## Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    ```
2. Navigate to the project directory:
    ```sh
    cd log-watcher
    ```
3. Install dependencies:
    ```sh
    npm install
    ```

## Usage

1. Start the server:
    ```sh
    node index.js
    ```
2. Open your browser and navigate to `http://localhost:3000/log`.
