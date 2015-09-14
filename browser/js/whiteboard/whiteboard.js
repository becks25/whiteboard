app.config(function ($stateProvider) {
    $stateProvider.state('whiteboard', {
        url: '/:whiteboard',
        templateUrl: 'js/whiteboard/whiteboard.html',
        controller: 'whiteboardCtrl',
        resolve: {
          sessionInfo: function(AuthService){
            return AuthService.getLoggedInUser();
          }
        }
    });
});

app.controller('whiteboardCtrl', function ($scope, Socket, Whiteboard, Session) {
//  var socket = Socket;


  Socket.on('connect', function () {
    console.log('I have made a persistent two-way connection to the server!');
    //Socket.emit('enterRoom', {location: window.location.pathname});
  });

  Whiteboard.on('draw', function(start, end, color, name, width){
    Socket.emit('drawToServer', start, end, color, name, width);
  });

  Socket.on('draw', function(start, end, color, name, width){
    whiteboard.draw(start, end, color, false, name, width);
  });

  Whiteboard.on('clear', function(){
    Socket.emit('clearAll');
  });


  Socket.on('clear', function(){
    Whiteboard.clear();
  });

  Socket.on('saveImage', function(){
    Whiteboard.saveImage();
  });

  Whiteboard.on('imageSaved', function(dataURL){
    Socket.emit('saveImageToServer', dataURL);
  });

  Socket.on('drawBackground', function(dataURL){
    Whiteboard.drawBackground(dataURL);
  });


});