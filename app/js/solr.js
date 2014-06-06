var solr = angular.module("solr", [])

  .controller('facetGroupController', function($scope){
    $scope.facets={};
    this.getFacets =  function(){ return $scope.facets;};
    this.registerFacet = function (facet){
      $scope.facets[facet.field]=facet;
    };
    $scope.listFields = function() {
      var fields=[];
      for (var k in $scope.facets){
        fields.push($scope.facets[k].field);
      }
      console.log(fields.join(','));
      return fields;
    };
    this.setFacetResult = function( facet_key, facet_results){
      for (var k in $scope.facets){
        if ($scope.facets[k].field === facet_key){
          $scope.facets[k].results = facet_results;
        }
      }
    };
  })

  .directive("solrFacetGroup", function() {
    return {
      restrict: "E",
      scope: {},
      controller: 'facetGroupController',
      transclude: true,
      templateUrl:"app/view/solr_facet_list.html",
      require:["^solr", "solrFacetGroup"],
      link: function(scope, element, attrs, ctrls){
        var solrCtrl=ctrls[0];
        var facetListCtrl= ctrls[1];

        solrCtrl.setFacetList(scope);
        scope.$watch(function(){ return solrCtrl.facet_fields;},
                     function ( newVal, oldVal){
                        if ( newVal !== oldVal ) {
                         for (var k in facetListCtrl.getFacets()){
                           console.log(k);
                           facetListCtrl.setFacetResult(k, solrCtrl.facet_fields[k]);
                         }
                         console.log( "Solr has changed");
                         console.log(newVal);
                        }
                     }
                    );
      }
    }
  })

  .directive("solrSearch", function() {
    return {
      restrict: "E",
      templateUrl:"app/view/solr_search.html",
    }
  })

  .directive("solrFacet", function() {
    return {
      restrict: "E",
      scope: {
        display: "@",
        field: "@",
        results:"&",
      },
      require:"^solrFacetGroup",
      templateUrl:"app/view/solr_facet.html",
      link: function( scope, element, attrs, ctrl){
        ctrl.registerFacet(scope);
      }
    }
  })

  .directive("solrFacetResult", function() {
    return {
      restrict: "E",
      scope: {
        key: "@",
        count: "@",
        field:"@",
      },
      templateUrl:"app/view/solr_facet_result.html",
      link: function( scope, element, attrs, ctrl){
        scope.getLink = function (){ 
          return "https://encrypted.google.com/search?hl=en&q="+ scope.key;
        };
      }
    }
  })

  .directive('solr', function ($timeout) {
    return {
      scope: {
        solrUrl: '=',
        docs: '=',
      },
      restrict: 'E',
      controller: function($scope, $http) {
        var that = this;
        that.facet_fields={};
        that.searchUrl = function(){
          return 'https://repository.library.brown.edu/api/pub/search/?q=*&facet=on&facet.field=object_type&rows=3&json.nl=map&facet.mincount=1&callback=JSON_CALLBACK';
        };

        //$http.get('app/data3.json').success(function(data) {
        //$http.jsonp('https://repository.library.brown.edu/api/pub/search/?q=*&facet=on&facet.field=object_type&rows=3&json.nl=map&facet.mincount=1&callback=JSON_CALLBACK')
        $http.jsonp(that.searchUrl())
          .success(function(data) {
            that.facet_fields = data.facet_counts.facet_fields;
            $scope.docs = data.response.docs;
        });

        this.setFacetList = function(newList){
          $scope.facet_list = newList;
        };
      },
      require:"solr",
    };
});
