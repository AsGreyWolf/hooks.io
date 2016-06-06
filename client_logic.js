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
socket.on('data_package', function (data) {
  if (!game){
    game = new HooksGame(data, {"rendering":render.bind(this, smart_canvas)});
  }else{
    game.pirates = data;
  }
  requestAnimationFrame(render.bind(this, smart_canvas));
});
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