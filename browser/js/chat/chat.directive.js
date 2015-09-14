app.directive('chat', function(){

  return{
    restrict: 'E',
    templateUrl: '/js/chat/chat.html',
    link: function(scope, elem, attr){
      scope.active = true;
      scope.minimized = true;
      scope.chatMessage = '';
      $('#chat-header').on('click', function(){
        scope.active = !scope.active;
        scope.minimized = !scope.minimized;
        $('input[name=chatText]').focus();

        scope.$apply();
      });

      $('input[name=chatText]').on('keyup', function(e){
            if (e.which === 13 || e.keyCode === 13) {
                //code to execute here
                console.log('pressed enter ', e.keyCode);
                scope.sendMessage(scope.chatMessage);
                scope.chatMessage = '';

                scope.$apply();
                return false;
            }
            return true;
      });
    },
    controller: 'chatCtrl'
  }
});

app.directive('thoughtbubbles', function(){
  return {
    restrict: 'E',
    template: '<div class="dots dot1"></div><div class="dots dot2"></div><div class="dots dot3"></div>',
    link: function(scope, elem, attrs){


    },
    controller: 'chatCtrl'

  }
});
