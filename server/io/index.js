'use strict';
var path = require('path');
var socketio = require('socket.io');
var io = null;

module.exports = function (server) {
    if (io) return io;

    io = socketio(server);
    //var socket = io(window.location.origin, {query: {path: window.location.pathname.slice(1)}});

    var namespaces = {};

    io.on('connection', function (socket) {

   var path = socket.handshake.query.path;


    // This function receives the newly connected socket.
    // This function will be called for EACH browser that connects to our server.
    console.log('A new client has connected!');
  //  console.log(name);

    socket.join(path);

    if(!namespaces[path]){
      namespaces[path] = {};
      namespaces[path].drawing = [];
      namespaces[path].chats = [];
    }
    namespaces[path].drawing.forEach(function(coord){
      if(!coord.start) socket.emit('drawBackground', coord);
      else{
        socket.emit('draw', coord.start, coord.end, coord.color, coord.name, coord.width);
      }
    });

    namespaces[path].chats.forEach(function(chatMessage){
      socket.emit('write', chatMessage.name, chatMessage.message);
    });

    socket.on('drawToServer',function(start, end, color, name, width){
      socket.broadcast.to(path).emit('draw', start, end, color, name, width);
      namespaces[path].drawing.push({
        start: start,
        end: end,
        color: color,
        name: name,
        width:width
      });

      if(namespaces[path].drawing.length >= 150){
        //if the array is getting full, create and save an image of it
        socket.emit('saveImage');
      }

    });

    socket.on('saveImageToServer', function(dataURL){
      namespaces[path].drawing = [];
      namespaces[path].drawing.push(dataURL);
    });

    socket.on('clearAll', function(){
      namespaces[path].drawing = [];
      socket.broadcast.to(path).emit('clear');
    });

    socket.on('writeMessageToServer', function(name, message){
      namespaces[path].chats.push({name: name, message:message});
      socket.broadcast.to(path).emit('write', name, message);
    });

    socket.on('typeToServer', function(name){
      socket.broadcast.to(path).emit('type', name);
     
    });

    socket.on('removeToServer', function(name){
      socket.broadcast.to(path).emit('removeBubble', name);

    });

    socket.on('disconnect', function(){
      console.log(":(");
    });
  });
    
    return io;

};
