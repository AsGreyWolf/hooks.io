/*jslint browser: true, devel: true, node: false*/
"use strict";
var pirate_colors = {
  "John":"#0099ff",
  "Arthur":"#ffcc00",
  "Lorenzo":"#009900",
  "Charles":"#de1f1f"
}
var socket = io();
var background_canvas = init_background();
var smart_canvas = init_battlefield();
var game;
var pirate_name;//omg danger danger danger
var actions = [];
var actions_counter = 0;
socket.on("player", function(name){
  pirate_name = name;
});
socket.on('data_package', function (data) {
  if (!game){
    data["rendering"] = render.bind(this, smart_canvas);
    game = new HooksGame(data);
  }else{
    game.pirates = data.pirates;
  }
  actions = actions.filter(function (obj, num){
    return obj.number > data.actions[pirate_name];
  });
  console.log(actions.join("\n"));
  for (var i = 0; i < actions.length; i++){
    game.teleport_pirate(game.find_pirate_by_name(pirate_name),actions[i]["data"][0],actions[i]["data"][1]);
    console.log("teleporing pirate to x:" + actions[i]["data"][0] + " y:" + actions[i]["data"][1])
  }
  requestAnimationFrame(render.bind(this, smart_canvas));
});
smart_canvas.canvas.addEventListener("click", function(event){
  var x = event.pageX - smart_canvas.canvas.offsetLeft;
  var y = event.pageY - smart_canvas.canvas.offsetTop;
  if (pirate_name && game){
    game.teleport_pirate(game.find_pirate_by_name(pirate_name),x,y);
    var now = new Date();
    actions_counter += 1;
    var action = {
      "type":"click",
      "data":[x,y],
      "time":now.getTime(),
      "name":pirate_name,
      "number":actions_counter
    };
    socket.emit("user_input",action);//huge security breach
    actions.push(action);
    console.log(actions.join("\n"));
  }
})
function init_background(){
  var background_canvas = new SmartCanvas('battlefield-bg');
  background_canvas.fill_rect(0,0,background_canvas.canvas.width,background_canvas.canvas.height,"#954");
  return background_canvas;
}
function init_battlefield(){
  var smart_canvas = new SmartCanvas('battlefield');
  smart_canvas.add_image("pirate", "captain.png");
  return smart_canvas;
}
function render(smart_canvas){
  smart_canvas.clear();
  smart_canvas.draw_pirates(game.pirates);
}