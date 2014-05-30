var app = angular.module("firstApp", []);

app.directive("solrFacetList", function() {
  return {
    restrict: "E",
    scope: {},
    controller: function($scope){
      $scope.facets=[];
      this.addFacet = function (facet){
        $scope.facets.push(facet);
        console.log("Listing Facets:");
        $scope.facets.forEach(function(aFacet){
          console.log("  Name:" + aFacet.display);
        });
      };
    },
    transclude: true,
    templateUrl:"app/view/solr_facet_list.html"
  }
})

app.directive("solrSearch", function() {
  return {
    restrict: "E",
    templateUrl:"app/view/solr_search.html",
  }
})

app.directive("solrFacet", function() {
  return {
    restrict: "E",
    scope: {
      display: "@",
      field: "@"
    },
    require:"^solrFacetList",
    templateUrl:"app/view/solr_facet.html",
    link: function( scope, element, attrs, ctrl){
      ctrl.addFacet(scope);
    }
  }
})

