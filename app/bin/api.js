#!/usr/bin/env node

/**
 * @file - This is the entry point for the backend
 * 
 * This serves all requests to the backend - HTTP and Websocket connections
 */

const http = require('http');
const path = require('path');

const app = require(path.resolve(__dirname, '../app'));

// start listening
var server = http.createServer(app);

const host = "0.0.0.0";
const port = 3002;

server.listen(port, host, () => {
    console.log(`Starting server on http://${host}:${port}/`);
});

server.on('listening', () => {
    console.log('Listening');
});

