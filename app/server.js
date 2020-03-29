const glob = require("./global.js");
const dgram = require('dgram');
const chalk = require('chalk');
const server = dgram.createSocket('udp4');

var activeConns = []; // Clients that are still 'connected'
//[Address, Port, Time since last pong, Packets sent since last ping]

const mmps = 2; // Max messages per second

server.on('error', (err) => { // When the server gets an error...
  console.log(`${glob.TIME()} Server error:\n${err.stack}`);
  server.close();
});

function sendToAll(ptype, pstr) {
  for (var i = 0; i < activeConns.length; i++) {
    server.send(Buffer.from(pstr.toString()), parseInt(activeConns[i][1]), activeConns[i][0]);
  }
}

function isConnected(user) { // returns -1 if not found and the index if found
  for (var i = 0; i < activeConns.length; i++) {
    if (user.address.valueOf() == activeConns[i][0] && user.port.valueOf() == activeConns[i][1]) {
      return i;
    }
  }
  return -1;
}

server.on('message', (msg, rinfo) => { // When the server gets a packet...
  switch(msg.toString().substring(0, 1)) {
    case "2": // Pong
      for (var i = 0; i < activeConns.length; i++) {
        if (rinfo.address == activeConns[i][0] && rinfo.port == activeConns[i][1]) {
          activeConns[i][2] = process.hrtime();
          break;
        }
        else if (i + 1 == activeConns.length) {
          console.log(chalk.red(`${glob.TIME()} ATTACK ${rinfo.address}:${rinfo.port} : ${msg}`));
        }
      }
      break;
    case "3": // Connect
      if (isConnected(rinfo) >= 0) {
        console.log(chalk.red(`${glob.TIME()} ${rinfo.address.toString()}:${rinfo.port.toString()} sent a connection request while still connected`));
      } else {
        console.log(chalk.green(`${glob.TIME()} ${rinfo.address.toString()}:${rinfo.port.toString()} CONNECTED`));
        for (var i = 0; i < activeConns.length; i++) { // Send message to all other clients
          server.send(Buffer.from(`3${rinfo.address.toString()}:${rinfo.port.toString()} CONNECTED`), parseInt(activeConns[i][1]), activeConns[i][0])
        }
        activeConns.push([rinfo.address, rinfo.port, process.hrtime(), 0]); // Add to list of clients that are still 'connected'
        //server.send("7Server >> You have been connected :o !", rinfo.port, rinfo.address); // Tell the user that they connected
        server.send("2", rinfo.port, rinfo.address); // Tell the user that they connected
      }
      break;
    case "7": //Chat
      var who = isConnected(rinfo);
      if (who >= 0) {
        if (activeConns[who][3] < mmps) {
          console.log(`${glob.TIME()} ${rinfo.address}:${rinfo.port} : ${msg.toString().substring(1)}`);
          for (var i = 0; i < activeConns.length; i++) { // Send chat to all other clients
            if (i != who) {
              server.send(Buffer.from(`7${rinfo.address}:${rinfo.port} >> ${msg.toString().substring(1)}`), activeConns[i][1], activeConns[i][0]);
            }
          }
        } else {
          if (activeConns[who][3] == mmps) {
            server.send(Buffer.from(`7Your spam is being ignored`), activeConns[who][1], activeConns[who][0]);
            console.log(`${rinfo.address}:${rinfo.port} is spamming`);
          }
        }
        activeConns[who][3]++;
      } else {
        console.log(chalk.red(`${glob.TIME()} ATTACK ${rinfo.address}:${rinfo.port} : ${msg}`));
      }
      break;
    default: // Error
      console.log("SPOOKY PACKET RECEIVED");
      console.log(`${glob.TIME()} ${rinfo.address}:${rinfo.port} : ${msg}`);
      break;
  }
  server.send('5', rinfo.port, rinfo.address); // Acknowledge packet (currently just for fun)
});

server.on('listening', () => { // When the server starts listening for packets...
  var a = server.address();
  console.log(`${glob.TIME()} Server listening to port ${chalk.green(`${a.port}`)} with version ${chalk.green(glob.VER)}`);
});

server.bind(glob.PORT);

setInterval(function() { // Ping all connected clients every second
  for (var i = 0; i < activeConns.length; i++) {
    if (process.hrtime(activeConns[i][2])[0] >= 5) {
      console.log(`${activeConns[i][0]}:${activeConns[i][1]} kicked after being dead for ${process.hrtime(activeConns[i][2])[0]}s`);
      sendToAll(0, `7${activeConns[i][0]}:${activeConns[i][1]} TIMED OUT`);
      activeConns.splice(i, 1);
    } else {
      server.send(Buffer.from(`1PING`), parseInt(activeConns[i][1]), activeConns[i][0]);
      activeConns[i][3] = 0;
    }
  }
}, 1000);
