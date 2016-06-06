"use strict";
function HooksGame(pirates, options){
  this.pirates = pirates || [];
  this.options = options || {};
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