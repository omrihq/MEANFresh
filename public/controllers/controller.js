/*
The controller is the mediator between my server and index. Completely honestly,
I struggled to grasp the different scopes and when/how to access them, 
and the $variables were a source of confusion initially. I think I better 
understand them now, but largely through their function and not so much their
implementation.
*/
var myApp = angular.module('myApp', []);
myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
    console.log("Hello World from controller");

    $http.get('/freshlist').success(function (response) {
        console.log("I got the data I requested");
        $scope.freshlist = response;
    });

}]);