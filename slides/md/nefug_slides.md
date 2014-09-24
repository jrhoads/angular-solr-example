class: center, middle
# Solr Directives for Angular

This set of directives allows you to build a declarative interface with solr.

---
## Requirements

- AngularJS

## Usage

Load the script file: solr.js into your application
```html
<script type="text/javascript" src="solr.js"></script>
```

Add the solr module as a dependency to your application module:
```js
var app = angular.module("MyApp", ["solr"]);
```

---
### Main Solr Element

Add the main solr element to your html.  You must set the solr-url attribute for the search to work.
If you wish to display the resulting documents you must declare docs="docs" as well.  

```html
<solr solr-url="'YOUR_SOLR_URL'" docs="docs" num-found="numFound" >
</solr>
```

This will accept the following parameters in the url

- q - the query
- rows - the maximum number of results

---
### Displaying Results

To display the results of your query, iterate through the docs from within the solr element

```html
<solr solr-url="'YOUR_SOLR_URL'" docs="docs" num-found="numFound" >
  <div ng-repeat="doc in docs">
    {{doc.primary_title}}
  </div>
</solr>
```

You can, of course replace the interior document display with your own template

---
### Adding a Search Box

To display a search box within the page use the "solr-search" element

```html
<solr solr-url="'YOUR_SOLR_URL'" docs="docs" num-found="numFound">
  <solr-search preload='true' query=''></solr-search>
  <div ng-repeat="doc in docs">
    {{doc.primary_title}}
  </div>
</solr>
```

- Optionally you may wish to add a query into the search box.  Use the 'query' attribute for that.
- Optionally you may wish to tell the query to run upon loading thepage.  Use the "preload='true'" for that

```html
<solr solr-url="'YOUR_SOLR_URL'" docs="docs" num-found="numFound">
  <solr-search preload='true' query='YOUR_QUERY'></solr-search>
  <div ng-repeat="doc in docs">
    {{doc.primary_title}}
  </div>
</solr>
```

---
### Adding Facets

Solr is useful as a search but it starts to shine when you add facets.
Here we will use the "sorl-facet-group" and one or more "solr-facet" elements to add faceting to our interface.

```html
<solr solr-url="'YOUR_SOLR_URL'" docs="docs" num-found="numFound">
  
  <solr-facet-group>
    <h1>Facet List:</h1>
    <solr-facet display="Resource Type" field="mods_type_of_resource"></solr-facet>
    <solr-facet display="Object Type"   field="object_type"></solr-facet>
    <solr-facet display="Keyword"       field="mods_subject_ssim"></solr-facet>
  </solr-facet-group>
              
  <solr-search preload='true' query='YOUR_QUERY'></solr-search>
  
  <div ng-repeat="doc in docs">
    {{doc.primary_title}}
  </div>
</solr>
```

---
## Work in Progress
This is all a first run through the problem and the first siginificant bit of angular code we have developed.
Could use cleaning and refactoring.

- Declaring "docs=docs" in the top-level solr element seems redundant.
- Should display list of selected facets and allow user to cancel them.
- solr-facet group needs to be declared before solr-search if preload=true.  Otherwise the facets are not registered for initial display.

--
<https://github.com/Brown-University-Library/angular-solr-example>
<https://github.com/jrhoads/>


