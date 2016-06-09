/*jslint devel: true, node: true, nomen: true*/
"use strict";

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var hooks = require('./hooksgame');
var actions_versions = {};
app.get('/', function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get('/client_logic.js', function (req, res) {
  res.sendFile(__dirname + "/client_logic.js");
});

app.get('/style.css', function (req, res) {
  res.sendFile(__dirname + '/style.css');
});

app.get('/socket-io.js', function (req, res) {
  res.sendFile(__dirname + '/node_modules/socket.io-client/socket.io.js');
});

app.get('/captain.png', function (req, res){
  res.sendFile(__dirname + '/captain.png');
});

app.get('/smart_canvas.js', function (req, res){
  res.sendFile(__dirname + '/smart_canvas.js');
});

app.get('/hooksgame.js', function (req, res){
  res.sendFile(__dirname + '/hooksgame.js');
});

io.on('connection', function (socket) {
  var pirate;
  if (game.is_room_full()){
    socket.emit("alert", "The room is full");
  }else{
    pirate = game.add_new_pirate();
    console.log(game.toString());
    socket.emit("player", pirate.name);
    actions_versions[pirate.name] = 0;
    Object.keys(actions_versions).forEach(function(obj){
      console.log(obj+" " + (actions_versions[obj]));
    });
  }
  socket.on('disconnect', function(){
    console.log("A pirate or a spectator has disconnected");
    if (pirate){
      game.remove_pirate(pirate);
    }
  });
  socket.on('user_input', function(data){
    setTimeout(function(){
      console.log("Received data from " + data.name + ". He sent it at " + data.time);
      var now = new Date().getTime();
      actions_versions[data.name] = data.number;
      console.log("We received it at " + now + ". Difference " + (now - data.time));
      switch(data.type){
        case 'click':

          game.teleport_pirate(game.find_pirate_by_name(data.name),data.data[0],data.data[1]);

          break;
      }
    }, 1000);
  });
});

var game;
http.listen(3000, function () {
  console.log('Server is listening on localhost:3000');
  game = new hooks();
  console.log('Created a new game.\n' + game);
  var game_loop = setInterval(send_package, 1000);//delete
});

function send_package(){
  console.log("Sending data.")
  var data = {};
  var pirates = [];
  data["pirates"] = pirates;
  data["actions"] = actions_versions;
  game.pirates.forEach(function (pirate) {
    pirates.push(pirate);
  });
  io.emit("data_package", data);
  console.log(pirates.join('\n'));
  Object.keys(actions_versions).forEach(function(obj){
    console.log(obj+" " + (actions_versions[obj]));
  });
}
