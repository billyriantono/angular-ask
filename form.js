var myApp = angular.module('momotrip',[]);
  
myApp.controller('MainCtrl', ['$scope', function($scope) {
    $scope.chagePass() = function(){
      console.log($scope.passwd);
      console.log($scope.confirmpasswd);
    }
}]);
