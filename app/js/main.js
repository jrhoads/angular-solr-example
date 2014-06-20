var app = angular.module("firstApp", ["solr"]);

app.controller("MainCtrl", function($scope, $location){
  $scope.params= $location.search();
});

  app.directive("resultDocument", function() {
    return {
      restrict: "E",
      scope :{
        doc : "=record", 
      },
      templateUrl:"app/view/my_result_document.html",
    }
  });
