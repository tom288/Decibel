const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
const dgram = require('dgram');

const sock = dgram.createSocket('udp4');
var serverPort = null;
var serverAddress = null;

let win; // Stop garbage collection

function CreateWindow () { // Create the browser window.
  win = new BrowserWindow({width: 1600, height: 900, minWidth: 800, minHeight: 600, frame: false, backgroundColor: "#282C34"})
  // win.setMenu(null); // Hide all menu functionality
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

// win.webContents.openDevTools(); // Open the DevTools (Don't move this line)

  win.on('closed', () => { // When window closed
    win = null;
  })
}

app.on('ready', CreateWindow) // Setup finished

app.on('window-all-closed', () => { // Quit when all windows are closed.
  if (process.platform !== 'darwin') {
    sock.close();
    app.quit()
  }
})

app.on('activate', () => { // Some MacOS nonsense function
  if (win === null) {
    CreateWindow();
  }
})

// Set up server events

var connected = false;
var lastPing = null;

sock.on('error', (err) => { // When the client gets an error...
  console.log(`TIME! ERROR STACK:\n${err.stack}`);
  sock.close();
});

sock.on('message', (msg, rinfo) => { // When the client gets a packet...
  switch(msg.toString().substring(0, 1)) {
    case "1": // Ping
      lastPing = process.hrtime();
      sock.send(Buffer.from("2"), serverPort, serverAddress);
      break;
    case "2": // Pong (server accepts connection)
      if (connected) {
        console.log(`SPOOKY PONG RECIEVED`);
        contents.executeJavaScript("ShowMessage(0, SPOOKY PONG RECIEVED)")
      } else {
        connected = true;
        lastPing = process.hrtime();
        console.log(`CONNECTED SUCCESSFULLY`);
        // Tell the render process that happy stuff happened
        win.webContents.executeJavaScript("ShowServer();");
      }
      break;
    case "3": // Connect
      console.log(`TIME! ${msg.toString().substring(1)}`);
      //showMessage(0, `TIME! ${msg.toString().substring(1)}`);
      break;
    case "4": // Disconnect
      break;
    case "5": // Packet received
      break;
    case "6": // Request resend
      break;
    case "7": // Chat
      console.log(`TIME! ${msg.toString().substring(1)}`);
      win.webContents.executeJavaScript(`ShowMessage(0, \`${msg.toString().substring(1)}\`)`);
      break;
    default: // Error
      console.log(`SPOOKY PACKET RECIEVED\nTIME! ${rinfo.address}:${rinfo.port} : ${msg}`);
      //showMessage(0, `SPOOKY PACKET RECIEVED\nTIME! ${rinfo.address}:${rinfo.port} : ${msg}`);
      break;
  }
});

sock.on('listening', () => { // When the client starts listening for packets...
  //var a = sock.address();
  //console.log(`TIME! You are using port ${`${a.port}`}, Connecting to ${serverAddress}:${glob.PORT}...`);
});

sock.bind();

var PokeServer = exports.PokeServer = function(pokePort, pokeAddress) {
  serverPort = pokePort;
  serverAddress = pokeAddress;
  if (connected) {
    console.log("Trying to poke when already connected???");
  } else {
    sock.send(Buffer.from('3'), serverPort, serverAddress);
  }
}

var SendMessage = exports.SendMessage = function(message) {
  sock.send(Buffer.from("7"+message), serverPort, serverAddress);
}

var pingCheck = setInterval(function() {
  if (connected) {
    t = process.hrtime(lastPing)[0];
    if (t >= 5) {
      console.log(`Server dead for ${t}s`);
      if (t >= 10) {
        connected = false;
        clearInterval(pingCheck);
        console.log("DISCONNECTED");
      }
    }
  }
}, 1000);
