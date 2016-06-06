/*jslint browser: true, devel: true, node: false*/
"use strict";
var pirate_colors = {
  "John":"#0099ff",
  "Arthur":"#ffcc00",
  "Lorenzo":"#009900",
  "Charles":"#de1f1f"
}
var socket = io();
var background_canvas = new SmartCanvas('battlefield-bg');
background_canvas.fill_rect(0,0,background_canvas.canvas.width,background_canvas.canvas.height,"#954");

var smart_canvas = new SmartCanvas('battlefield');
smart_canvas.add_image("pirate", "captain.png");
socket.on('data_package', function (data) {
  requestAnimationFrame(smart_canvas.draw_pirates.bind(smart_canvas,data));
});