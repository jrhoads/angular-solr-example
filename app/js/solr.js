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
        var facetGroupCtrl= ctrls[1];

        solrCtrl.setFacetGroup(scope);
        scope.$watch(function(){ return solrCtrl.facet_fields;},
                     function ( newVal, oldVal){
                        if ( newVal !== oldVal ) {
                         for (var k in facetGroupCtrl.getFacets()){
                           console.log(k);
                           facetGroupCtrl.setFacetResult(k, solrCtrl.facet_fields[k]);
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
      scope:{
        preload:"="
      },
      restrict: "E",
      templateUrl:"app/view/solr_search.html",
      require: "^solr",
      link: function( scope, element, attrs, ctrl){
        scope.search = ctrl.search;
        scope.roptions= ["3", "10", "20", "30"];
        //ctrl.roptions = scope.roptions;
        scope.rows="10";
        scope.query="";
        if (scope.preload){
          scope.search(scope.query, scope.rows);
        }
      }

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

  .directive("solr", function ($timeout) {
    return {
      scope: {
        solrUrl: '=',
        docs: '=',
        preload: '=',
      },
      restrict: 'E',
      controller: function($scope, $http, $timeout) {
        var that = this;
        that.facet_fields={};
        that.buildSearchUrl = function(query, rows){
          //return 'https://repository.library.brown.edu/api/pub/search/'
          if (!query){
            query="*";
          }
          if (!rows){
            rows="3";
          }
          return that.solrUrl
          +'?q='+ query
          +'&facet=on'
          +'&facet.mincount=1'
          +'&json.nl=map'
          //+'&facet.field=object_type'
          +'&'+ this.getFacetQueryParams()
          +'&rows='+rows
          +'&callback=JSON_CALLBACK';
        };

        that.search = function(query, rows){
          console.log(that.buildSearchUrl(query, rows));
          $http.jsonp(that.buildSearchUrl(query, rows))
            .success(function(data) {
              that.facet_fields = data.facet_counts.facet_fields;
              $scope.docs = data.response.docs;
          });
        };
        $scope.search = that.search;

        this.setFacetGroup = function(newGroup){
          $scope.facet_group = newGroup;
        };

        this.getFacetQueryParams = function(){
          if ($scope.facet_group){
            fields = $scope.facet_group.listFields();
            field_string = fields.join("&facet.field=");
            //return 'facet.field=object_type';
            return 'facet.field='+ field_string;
          }
          //return "";
        };
      },
      require:"solr",
      link: function( scope, element, attrs, ctrl){
        ctrl.solrUrl = scope.solrUrl;
      }
    };
});
