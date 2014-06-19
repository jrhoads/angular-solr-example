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
        scope.$watch(
          function(){ return solrCtrl.facet_fields;},
          function ( newVal, oldVal){
            if ( newVal !== oldVal ) {
              for (var k in facetGroupCtrl.getFacets()){
                facetGroupCtrl.setFacetResult(k, solrCtrl.facet_fields[k]);
              }
            }
          }
        );

      }
    }
  })

  .directive("solrSearch", function($location) {
    return {
      scope:{
      },
      restrict: "E",
      templateUrl:"app/view/solr_search.html",
      require: "^solr",
      link: function( scope, element, attrs, ctrl){
        scope.search = function(query, rows){
          rows = rows || '10';
          query = query|| '*';
          $location.search('q',query);
          $location.search('rows',rows);
          ctrl.search(query, rows);
        };

        scope.roptions= ["3", "10", "20", "30"];
        scope.rows="10";
        scope.preload=attrs.preload;
        scope.query=attrs.query;
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

  .directive("solrFacetResult", function($location) {
    return {
      restrict: "E",
      scope: {
        key: "@",
        count: "@",
        field:"@",
      },
      templateUrl:"app/view/solr_facet_result.html",
      link: function( scope, element, attrs, ctrl){
        scope.facetString = function(){ 
          return scope.field+':"'+scope.key+'"';
        };
        scope.getSelectedFacets = function(){
          selected = $location.search().selected_facets;
          selectedFacets =[];
          if (angular.isArray(selected)) {
            selectedFacets = selected;
          } else {
            if (selected){
              selectedFacets.push(selected);
            }
          }
          return selectedFacets;

        };
        scope.isSelected = function(){
          selectedFacets = scope.getSelectedFacets();
          facetString = scope.facetString();
          for (i in selectedFacets){
            if (selectedFacets[i]==facetString) return true;
          }
          return false;

        };
        scope.addFacet = function (){ 
          if (!scope.isSelected()){
            selectedFacets = scope.getSelectedFacets();
            selectedFacets.push(scope.facetString());
            $location.search('selected_facets', selectedFacets);
          }
        };

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
        numFound: '=',
      },
      restrict: 'E',
      controller: function($scope, $http, $timeout, $location) {
        var that = this;
        that.facet_fields={};
        that.getQuery=function(){
          return $location.search().q || "*";
        }
        that.getRows=function(){
          return $location.search().rows || "10";
        }

        that.buildSearchParams = function(){
          params = {
            'q': that.getQuery(),
            'facet': "on",
            'facet.mincount':"1",
            'json.nl': "map",
            'rows': that.getRows()
          };

          selectedFacets=this.getSelectedFacets();
          if (selectedFacets){
            params["fq"]= selectedFacets;
          }
          if ($scope.facet_group){
            params["facet.field"] = $scope.facet_group.listFields();
          }
          return params;
        };

        that.search = function(query, rows){
          $http.jsonp(that.solrUrl+"?callback=JSON_CALLBACK", {params: that.buildSearchParams(), cache:true})
            .success(function(data) {
              that.facet_fields = data.facet_counts.facet_fields;
              $scope.docs = data.response.docs;
              $scope.numFound = data.response.numFound;
          });
        };

        $scope.search = that.search;

        this.setFacetGroup = function(newGroup){
          $scope.facet_group = newGroup;
        };

        this.getSelectedFacets = function(){
          selected = $location.search().selected_facets;
          selectedFacets =[];
          if (angular.isArray(selected)) {
            selectedFacets = selected;
          } else {
            if (selected){
              selectedFacets.push(selected);
            }
          }
          return selectedFacets;

        };

        $scope.$watch(
          function(){ return $location.search();},
          function ( newVal, oldVal){
            if ( newVal !== oldVal ) {
              that.search()
            }
          }
        );
      },
      require:"solr",
      link: function( scope, element, attrs, ctrl){
        ctrl.solrUrl = scope.solrUrl;
      }
    };
});
