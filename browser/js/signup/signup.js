app.config(function($stateProvider){
  $stateProvider.state('signup', {
    url:'/signup',
    templateUrl: 'js/signup/signup.html',
    controller: 'SignupCtrl'
  });
});

app.controller('SignupCtrl', function($scope, $state, AuthService){
  $scope.signin = {};
  $scope.error = null;

  $scope.sendSignin = function(signupInfo){
    $scope.error = null;

    AuthService.signup(signupInfo).then(function(){
      $state.go('home');
    }).catch(function () {
        $scope.error = 'Invalid signup credentials.';
    });

  }
});