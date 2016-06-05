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
socket.on('data_package', function (data) {
  requestAnimationFrame(render.bind(this,data));
});
function render(data){
  var smart_canvas = new SmartCanvas('battlefield');
  smart_canvas.clear();
  Object.keys(data).forEach(function (name, i) {
    smart_canvas.add_image("pirate", "captain.png");
    console.log(name + " " + data[name]);
    smart_canvas.draw_image("pirate",{"background":pirate_colors[name],"x":data[name][0],"y":data[name][1]});
  });
}