const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Simple room/code system
const rooms = {}; 

io.on('connection', (socket) => {
    socket.on('create-code', (code) => {
        rooms[code] = socket.id; // Map code to the Host's socket
        console.log(`Host created code: ${code}`);
    });

    socket.on('join-code', (code) => {
        const hostId = rooms[code];
        if (hostId) {
            socket.emit('found-host', hostId);
        }
    });

    socket.on('signal', (data) => {
        io.to(data.to).emit('signal', { from: socket.id, signal: data.signal });
    });
});

http.listen(3000, () => console.log('Signaling server running on port 3000'));