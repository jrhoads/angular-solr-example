var app = angular.module("firstApp", ["solr", "ngRoute"]);

app.controller("MainCtrl", function($scope, $location){
  $scope.params= $location.search();
});

