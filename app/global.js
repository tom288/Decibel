/* Use global.js with the following code:
const glob = require("./global.js");
... glob.*thing* ...
Neat, huh? c: */

module.exports = {
  PORT: 5040, // The server port
  VER: "v0.0.3",
  
  TIME: function() { // Get timestamp
    var d = new Date();
    var h = d.getHours();
    h = (h > 9 ? "" : "0") + h;
    var m = d.getMinutes();
    m = (m > 9 ? "" : "0") + m;
    var s = d.getSeconds();
    s = (s > 9 ? "" : "0") + s;
    return "(" + h + ":" + m + ":" + s + ")";
  }
}
