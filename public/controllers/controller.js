var myApp = angular.module('myApp', []);
myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
    console.log("Hello World from controller");

    $http.get('/freshlist').success(function (response) {
        console.log("I got the data I requestion");
        $scope.freshlist = response;
    });

}]);