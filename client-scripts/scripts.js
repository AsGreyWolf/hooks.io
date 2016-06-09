function SmartCanvas(id){
  this.id = id;
  this.canvas = document.getElementById(id);//maybe surround with try/catch?
  this.images = {};
}
SmartCanvas.prototype.get_context = function(){
  return this.canvas.getContext('2d');
}
SmartCanvas.prototype.add_image = function(name, src){
  var img = new Image();
  img.src = src;
  this.images[name] = img;
}
SmartCanvas.prototype.fill_rect = function(x, y, width, height, color){
  var context = this.get_context();
  //  context.beginPath();
  context.fillStyle = color;
  context.fillRect(x,y,width,height);
  //  context.stroke();
}

SmartCanvas.prototype.clear = function(){
  this.get_context().clearRect(0,0,this.canvas.width,this.canvas.height);
}

SmartCanvas.prototype.draw_image = function(name, options){
  var img = this.images[name];
  var options = options || {};
  var coordinates = options.coordinates || [0,0]
  var x = options.x || 0;
  var y = options.y || 0;
  var width = options.width || img.width;
  var height = options.height || img.height;
  var background = options.background;
  var self = this;
  img.onload = function(){
    if (background){
      self.fill_rect(x,y,width,height,background);
    }
    self.get_context().drawImage(img, x, y, width, height);
  }
}
SmartCanvas.prototype.draw_pirates = function(data){
  var img = this.images["pirate"];
  var self = this;
  var width = img.width;
  var height = img.height;
  data.forEach(function(pirate){
    var name = pirate.name;
    var x = pirate.x;
    var y = pirate.y;
    self.fill_rect(x,y,width,height,pirate_colors[name]);
    self.get_context().drawImage(img,x,y);
  });
}

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
  console.log("azaza");
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
"use strict";
function HooksGame(options){
  this.options = options || {};
  this.pirates = this.options.pirates || [];
  var rendering = this.options.rendering || function(){};
  this._available_names = ["John", "Arthur", "Lorenzo", "Charles"];
  this._starting_positions = {
    "John":[0, 600],
    "Arthur":[150, 600],
    "Lorenzo":[300,600],
    "Charles":[450,600]
  };
  var gravity = setInterval(this.enact_gravity.bind(this, rendering), 100);
}

HooksGame.prototype.is_room_full = function(){
  return this.pirates.length>3;
}

HooksGame.prototype.add_new_pirate = function(){
  if (!this.is_room_full()){
    var name = this._available_names.shift();
    var position = this._starting_positions[name];
    var new_pirate = new Pirate(name, position[0], position[1]);
    this.pirates.push(new_pirate);
    return new_pirate;
  }
}

HooksGame.prototype.find_pirate_by_name = function(name){
  var result = null;
  for (var i = 0; i < this.pirates.length; i++){
    if (this.pirates[i].name === name){
      result = this.pirates[i];
      break;
    }
  }
  return result;
}

HooksGame.prototype.remove_pirate = function(pirate){
  this._available_names.unshift(pirate.name);
  this.pirates.splice(this.pirates.indexOf(pirate),1);
}

HooksGame.prototype.toString = function(){
  var result = this.pirates.length + " pirate(s) situated in this room.";
  this.pirates.forEach(function (pirate) {
    result += "\n" + pirate;
  });
  return result;
}

HooksGame.prototype.enact_gravity = function(rendering){
  this.pirates.forEach(function(pirate){
    pirate.y += 1;
  });
  rendering();
}

HooksGame.prototype.teleport_pirate = function(pirate, x, y){
  pirate.x = x;
  pirate.y = y;
}

//Pirate class
function Pirate(name, x, y) {
  this.name = name || "John";
  this.x = x || 0;
  this.y = y || 0;
}

Pirate.prototype.toString = function(){
  return "Pirate " + this.name + ". Coordinates: x " + this.x + " y " + this.y;
}

Pirate.prototype.get_coordinates = function () {
  var result = [this.x, this.y];
  return result;
};

module.exports = HooksGame;