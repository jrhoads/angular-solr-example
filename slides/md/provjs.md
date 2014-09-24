class: center, middle
<!--# Solr Directives for Angular-->
<!--This set of directives allows you to build a declarative interface with solr.-->
# AngularJS with Solr
## Client Side Search

#### Joseph Rhoads
##### Povidence JS, Sept 24, 2014

---
## Roadmap for the night

- Why Search?
- The HTML I wish I had
- Angular Directives
  - Basics
  - Nested Directives
- Interacting with the URL search parameters ($location)

## Out of Scope
- Routing and Views
- Complex resource mapping to objects

---
class: center, middle
# Why (am I interested in) Search?
---
## Why (am I interested in) Search?
- I work for the Brown University Library
- Lots of metadata (usually originating in XML files)
- We tend to use [Apache Solr](http://lucene.apache.org/solr/)
- We usually make search applications Server Side
  - Python using Django/Flask + mysolr or django-haystack
  - Ruby using Blacklight
- But many "Collections" of require special facets and display
- Users who want to make their own interface to objects
--

#### So we exposed an API to search SOLR using solr parameters and conventions 
--

#### What could go wrong?
---



## Search is kind of a big thing

```
https://repository.library.brown.edu/api/search/?q=helium
```
#### It starts off so simple
---
## Search is kind of a big thing

```
https://repository.library.brown.edu/api/search/?q=helium&
rows=10&wt=json
```
#### Specify number of results .... and return type
---
## Search is kind of a big thing

```
https://repository.library.brown.edu/api/search/?q=helium&
rows=10&wt=json&
facet=on&
facet.mincount=1&
facet.field=mods_type_of_resource&
facet.field=object_type&
facet.field=mods_subject_ssim&
```
#### Add a few facets
---
## Search is kind of a big thing

```
https://repository.library.brown.edu/api/search/?q=helium&
rows=10&wt=json
facet=on&
facet.mincount=1&
facet.field=mods_type_of_resource&
facet.field=object_type&
facet.field=mods_subject_ssim&
fq=object_type:%22pdf%22
```
#### And refine within your original search results

[Run
sample](https://repository.library.brown.edu/api/search/?callback=angular.callbacks._0&facet=on&facet.field=mods_type_of_resource&facet.field=object_type&facet.field=mods_subject_ssim&facet.mincount=1&fq=object_type:%22pdf%22&json.nl=map&q=helium&rows=10&wt=json)
---
class: center, middle
# The HTML I Wish I had
---
## The HTML I Wish I had (preview)
```html
<solr solr-url="'YOUR_SOLR_URL'" docs="docs" num-found="numFound">

  <solr-facet-list>
    <h1>Facet List:</h1>
    <solr-facet display="Resource Type" field="mods_type_of_resource"></solr-facet>
    <solr-facet display="Object Type"   field="object_type"></solr-facet>
    <solr-facet display="Keyword"       field="mods_subject_ssim"></solr-facet>
  </solr-facet-list>

  <solr-search preload='true' query='YOUR_QUERY'></solr-search>

  <div ng-repeat="doc in docs">
    {{doc.primary_title}}
  </div>
</solr>
```
---
## Goal

Make it easy to write a declarative search interface.
### If you can write html you can add search

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

  <solr-facet-list>
    <h1>Facet List:</h1>
    <solr-facet display="Resource Type" field="mods_type_of_resource"></solr-facet>
    <solr-facet display="Object Type"   field="object_type"></solr-facet>
    <solr-facet display="Keyword"       field="mods_subject_ssim"></solr-facet>
  </solr-facet-list>

  <solr-search preload='true' query='YOUR_QUERY'></solr-search>

  <div ng-repeat="doc in docs">
    {{doc.primary_title}}
  </div>
</solr>
```
---
class: center, middle
# Lets Look at some Code
---
## Work in Progress
This is all a first run through the problem and the first siginificant bit of angular code we have developed.
Could use cleaning and refactoring.

- Declaring "docs=docs" in the top-level solr element seems redundant.
- Possibly allow directives to be attached to standard html elements
```html
  <ul sorl-facet-list>
      <li solr-facet display="..." field="..."></li>
      <li solr-facet display="..." field="..."></li>
      <li solr-facet display="..." field="..."></li>
  </ul>
```
- solr-facet-list needs to be declared before solr-search if preload=true.  Otherwise the facets are not registered for initial display.

--
<https://github.com/Brown-University-Library/angular-solr-example>
<https://github.com/jrhoads/>

---
# Resources

## Angular
- https://angularjs.org/
- https://egghead.io/
- https://www.codeschool.com/courses/shaping-up-with-angular-js
  (Free Course)
- http://www.sitepoint.com/practical-guide-angularjs-directives-part-two/
  (Nested Directives)

## Solr
- http://lucene.apache.org/solr/
- http://wiki.apache.org/solr/CommonQueryParameters
