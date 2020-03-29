const remote = require('electron').remote;

loginSPN = document.getElementById("login");
adpoTXT = document.getElementById("adpo");
connBTN = document.getElementById("conn");
serverSPN = document.getElementById("server");
chatSPN = document.getElementById("chat");
historyUL = document.getElementById("history");
messTXT = document.getElementById("mess");
sendBTN = document.getElementById("send");

PokeServer = remote.require("./main.js").PokeServer;
SendMessage = remote.require("./main.js").SendMessage;
var noResp;

ShowServer = function() {
  clearTimeout(noResp);
  loginSPN.style.display = "none";
  chatSPN.style.display = "flex";
  serverSPN.style.display = "flex";
}

ShowMessage = function(id, message) {
  var lines = message.split(/\r?\n/);
  var firstWrite = true; // = (lastChatter != self)
  var li = null;
  for (var i = 0; i < lines.length; i++) {
    if (!/^\s*$/.test(lines[i])) {
      if (firstWrite) {
        firstWrite = false;
        li = document.createElement("li");
        historyUL.appendChild(li);
        li.innerHTML += "<span style=\"color: white\">GAMER:</span> ";
      }
      li.appendChild(document.createTextNode(lines[i]));
      li.innerHTML += "<br>";
    }
  }
}

document.getElementById("quit").addEventListener("click", function (e) {
  remote.getCurrentWindow().close();
});

validateForm = function() {
  if (connBTN.value === "CONNECT" || connBTN.value === "NO REPLY D:") {

    if (adpoTXT.value === ":)") {
      ShowServer();
      return false;
    }

    var things = adpoTXT.value.split(":");
    if (things[0] == "") {
      window.alert("No address specified ):");
      return false;
    }
    if (things.length > 2) {
      window.alert("Too many colons :C");
      return false;
    }
    var pokePort = (things.length == 1) ? 5040 : parseInt(things[1]);
    if (isNaN(pokePort) || pokePort < 0 || pokePort > 65535) {
      window.alert("Invalid port :o");
      return false;
    }
    PokeServer(pokePort, things[0]);

    connBTN.style.background = "#0066FF";
    connBTN.value = "WAITING FOR REPLY";

    var noResp = setTimeout(function() {
      connBTN.style.background = "#FF6347";
      connBTN.value = "NO REPLY D:";
      setTimeout(function() {
        if (connBTN.value === "NO REPLY D:") {
          connBTN.style.background = "";
          connBTN.value = "CONNECT";
        }
      }, 1500);
    }, 1500);
  }
  return false;
}

sendBTN.onclick = SubmitMessage = function() {
  ShowMessage(-1, messTXT.value);
  SendMessage(messTXT.value);
  historyUL.scrollTop = historyUL.scrollHeight;
  messTXT.value = "";
  return false;
}

messTXT.onkeydown = function(e) {
  if (e.keyCode == 13 && !e.shiftKey) {
    SubmitMessage();
    return false;
  }
  return true;
}
