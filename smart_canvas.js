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
  console.log("drawing pirates");
  var img = this.images["pirate"];
  var self = this;
  var width = img.width;
  var height = img.height;
  console.log("image loaded");
  data.forEach(function(pirate){
    var name = pirate.name;
    var x = pirate.x;
    var y = pirate.y;
    self.fill_rect(x,y,width,height,pirate_colors[name]);
    self.get_context().drawImage(img,x,y);
  });
}
