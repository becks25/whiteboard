app.controller('chatCtrl', function ($scope, Socket, Chat, Session, $compile) {
  //var socket = Socket;
  
  if(Session.user) $scope.loggedIn = true;
  else $scope.loggedIn = false;
  $scope.currentlyTyping = null;

   $scope.typing = function(){
      if(!chat.$pristine && $scope.chatMessage !== '' && !Chat.typing){
        Chat.typing = true;
        $scope.dance = setInterval(dancingDots, 1500);
        var temp = Chat.typingMessage(Session.user.name, true);
        $scope.currentTyping = temp;
        $scope.currentlyTyping = $compile(temp)($scope);
      }else if(!chat.$pristine && $scope.chatMessage == '' && Chat.typing){
        Chat.typing = false;
        stopDancing();
        Chat.destroyThoughtBubble($scope.currentlyTyping, true);
        $scope.currentlyTyping = null;
      }
    }

  $scope.sendMessage = function(message){
    Chat.typing = false;
    if($scope.currentlyTyping){
      stopDancing();
      Chat.writeMessage(Session.user.name, message, $scope.currentlyTyping, true);
      $scope.chat.$setPristine();
    }
  }

  var dancingDots = function(){
    $('.dot1').toggleClass('float');

    setTimeout(function(){
      $('.dot1').toggleClass('float');         
      $('.dot2').toggleClass('float');
    }, 500);

    setTimeout(function(){
      $('.dot2').toggleClass('float');
      $('.dot3').toggleClass('float');
    }, 1000);

    setTimeout(function(){
      $('.dot3').toggleClass('float');

    }, 1500);

  };

  function stopDancing(){
      clearInterval($scope.dance);
      $('.float').removeClass('float');
  }

  Chat.on('typing', function(name){
    console.log('typing');
    Socket.emit('typeToServer', name);
  });

  Socket.on('type', function(name){
    var node =$('#chat-body .'+name);
    if(node.length == 0){
      var temp = Chat.typingMessage(name, false);
      $compile(temp)($scope)
    }
  });

  Chat.on('remove', function(name){
    Socket.emit('removeToServer', name);
  });

  Socket.on('removeBubble', function(name){
    var node =$('#chat-body .'+name);
    if(node.length !== 0){
      Chat.destroyThoughtBubble(node, false);
    }
  });

  Chat.on('emitWriteMessage', function(name, message){
    Socket.emit('writeMessageToServer', name, message);
  });

  Socket.on('write', function(name, message){
    var node =$('#chat-body .'+name);
    Chat.writeMessage(name, message, null, false);
    $scope.active = false;
  });

});