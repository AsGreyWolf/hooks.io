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
socket.on("player", function(data){
  pirate_name = data;
});
socket.on('data_package', function (data) {
  if (!game){
    data["rendering"] = render.bind(this, smart_canvas);
    game = new HooksGame(data);
  }else{
    game.pirates = data.pirates;
  }
  requestAnimationFrame(render.bind(this, smart_canvas));
});
smart_canvas.canvas.addEventListener("click", function(event){
  var x = event.pageX - smart_canvas.canvas.offsetLeft;
  var y = event.pageY - smart_canvas.canvas.offsetTop;
  if (pirate_name && game){
    game.teleport_pirate(game.find_pirate_by_name(pirate_name),x,y);
    var now = new Date();
    console.log(pirate_name);
    socket.emit("user_input",{"type":"click","data":[x,y],"time":now.getTime(),"name":pirate_name});
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