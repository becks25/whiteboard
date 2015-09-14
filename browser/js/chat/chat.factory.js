app.factory('Chat', function (Session) {

window.chat = new window.EventEmitter();

(function () {

    var person;
    if(Session.user) person = Session.user.name;

    var chatBox = document.querySelector('#chat-body');
    chat.typing = false;
    
    chat.writeMessage = function(name, message, messageNode, shouldBroadcast){
        if(!chat.typing){
          var newNode =  $('<p class="message"><span class="name">'+name+ ': </span>' + message + '</p>');
          if(messageNode) messageNode.replaceWith(newNode);
          else $('#chat-body').append(newNode);
          chatBox.scrollTop = chatBox.scrollHeight;

          if(shouldBroadcast){
            console.log('emiting write');
            chat.emit('emitWriteMessage', name, message);
          }
        }
    };

    chat.typingMessage = function(name, shouldBroadcast){
          var chatMessage = $('<div class="message typing '+name +'"><span class="name">'+name+ ': </span><thoughtbubbles></thoughtbubbles></div>');
          $('#chat-body').append(chatMessage);
          chatBox.scrollTop = chatBox.scrollHeight;
          var addedMessage = $('#chat-body .'+name).last();

          if(shouldBroadcast){
            chat.emit('typing', name);
          }
          return addedMessage;
    }

    chat.destroyThoughtBubble = function(node, shouldBroadcast){
      node.remove();
      if(shouldBroadcast) chat.emit('remove',person);
    }



})();

  return chat;

});