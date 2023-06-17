const express = require('express');
const app = express();
const http = require('http');
const https = require('https');
const server = http.createServer(app);
const { Server } = require("socket.io");
const kws = require('./KeyWords.js');
const fs = require("fs");

const io = new Server(server); //,{
// cors: { //this stays because It is useful
//     origin: "http://localhost:63342",
//         methods: ["GET", "POST"]
// }
// });
//change the socket port here for front end
server.listen(3000, () => {
    console.log('listening on *:3000');
});

const options = {
    key: fs.readFileSync('privatekey.pem'),
    cert: fs.readFileSync('certificate.pem')
  };
  
  const server = https.createServer(options, (req, res) => {
    // Handle HTTPS requests
  });
  
  server.listen(443, () => {
    console.log('Server running on port 8080');
  });

app.use(express.static('ui/public'));

io.on('connect', (socket) => {
    console.log('socket connected');
    socket.emit('serverMessage','Chess is a two-player abstract strategy board game. I shall try my best ' +
        'to help you understand the rules and gameplay. You can call me AGIM, named after my parents')
    socket.on('clientMessage', (data) => {
        console.log('received from client: ' + data);
        kws.converstaion_handler(data).then((result)=>{
            socket.emit('serverMessage', result);
        })
    });
    socket.on('disconnect', (socket) => {
        console.log('socket disconnected');})
});
io.on('disconnect', (socket) => {
    console.log('socket disconnected');})

