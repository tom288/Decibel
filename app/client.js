const glob = require("./global.js");
const dgram = require('dgram');
const chalk = require('chalk');
const readline = require('readline');
const client = dgram.createSocket('udp4');

var serverAddress = "127.0.0.1"; // You can replace with a string e.g. "127.0.0.1"
var log = console.log; // This looks silly but don't be mean to it

var lastPing = process.hrtime();
var connected = false;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log = function() { // This is used so that text output and text input can be friends
    rl.output.write('\x1b[2K\r');
    log.apply(console, Array.prototype.slice.call(arguments));
    rl._refreshLine();
}

client.on('error', (err) => { // When the client gets an error...
  console.log(`${glob.TIME()} Client error:\n${err.stack}`);
  client.close();
  rl.close();
});

client.on('message', (msg, rinfo) => { // When the client gets a packet...
  switch(msg.toString().substring(0, 1)) {
    case "1": // Ping
      lastPing = process.hrtime();
      client.send(Buffer.from("2"), glob.PORT, serverAddress);
      break;
    case "2": // Pong (server accepts connection)
      if (connected) {
        console.log(chalk.red(`ERROR (2)`));
      } else {
        connected = true;
        console.log(chalk.green(`CONNECTED SUCCESSFULLY`));
      }
      break;
    case "3": // Connect
      console.log(chalk.green(`${glob.TIME()} ${msg.toString().substring(1)}`));
      break;
    case "4": // Disconnect
      break;
    case "5": // Packet received
      break;
    case "6": // Request resend
      break;
    case "7": // Chat
      console.log(chalk.cyan(`${glob.TIME()} ${msg.toString().substring(1)}`));
      break;
    default: // Error
      console.log(chalk.red(`SPOOKY PACKET RECIEVED\n${glob.TIME()} ${rinfo.address}:${rinfo.port} : ${msg}`));
      break;
  }
});

client.on('listening', () => { // When the client starts listening for packets...
  var a = client.address();
  console.log(`${glob.TIME()} You are using port ${chalk.green(`${a.port}`)}, Connecting to ${serverAddress}:${glob.PORT}...`);
});

console.log(`You are using version ${chalk.green(glob.VER)}, I sure hope the server is too! ;)`);

client.bind(); // The port is chosen by the OS
client.send(Buffer.from('3'), glob.PORT, serverAddress); // Send connect message

rl.setPrompt("> "); // Printed when an input is required
rl.prompt(); // Take input
rl.on('line', function(line) { // When input is taken...
  if (line.length > 0) {
    if (connected) {
      client.send(Buffer.from("7"+line), glob.PORT, serverAddress); // Send input as a chat message
    }
  }
  rl.prompt(); // Take more input
}).on('close',function() {
  client.close();
  process.exit(0);
});

var pingCheck = setInterval(function() {
  t = process.hrtime(lastPing)[0]; // Get whole seconds since last ping
  if (t >= 5) {
    console.log(chalk.red(`Server dead for ${t}s`));
    if (t >= 10) {
      connected = false;
      console.log(chalk.red("DISCONNECTED"))
      clearInterval(pingCheck);
    }
  }
}, 1000);
