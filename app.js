var http = require("http");
var socketio = require("socket.io");
var fs = require("fs");
var logger = require("log4js").getLogger("chat");


logger.info("start app.js");
logger.info("VMC_APP_PORT: " + process.env.VMC_APP_PORT);
//process.env.VMC_APP_PORT = 3000;
//logger.info("VMC_APP_PORT: " + process.env.VMC_APP_PORT);

var server = http.createServer(function(req, res) {
     logger.debug("http.createServer() callback");
     res.writeHead(200, {"Content-Type":"text/html"});
     var output = fs.readFileSync("./index.html", "utf-8");
     res.end(output);
}).listen(process.env.VMC_APP_PORT || 3000);

var io = socketio.listen(server);

io.sockets.on("connection", function (socket) {

  logger.debug("io.sockets.on() on connection");

  // メッセージ送信（送信者にも送られる）
  socket.on("C_to_S_message", function (data) {
    logger.debug("socket.on() on C_to_S_message");
    io.sockets.emit("S_to_C_message", {value:data.value});
  });

  // ブロードキャスト（送信者以外の全員に送信）
  socket.on("C_to_S_broadcast", function (data) {
    logger.debug("socket.on() on C_to_S_broadcast");
    socket.broadcast.emit("S_to_C_message", {value:data.value});
  });

  // 切断したときに送信
  socket.on("disconnect", function () {
    logger.debug("socket.on() on disconnect");
//    io.sockets.emit("S_to_C_message", {value:"user disconnected"});
  });
});

