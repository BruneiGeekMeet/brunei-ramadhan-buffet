"use strict";







var appControllers = angular.module('appControllers', []);

appControllers.controller('buffetCtrl', ['$scope', '$filter', '$http', '$sce', '$timeout', function($scope, $filter, $http, $sce, $timeout) {

  $scope.isLoading = true;
  $scope.tableView = false;
  $scope.showImages = true;
  $scope.searchLocationData = {};
  $scope.searchCuisineData = {};
  $scope.data = [];
  $scope.uniqueLocations = [];
  $scope.uniqueCuisines = [];


  $http.get("data/buffets.json").success(function(data) {
      var locations = data.map(function(x){ return x.location});
      var cuisines = [];
      for(var i = 0; i < data.length; i++){
        var contact = (data[i].contact || "")+"";
        if(contact) data[i].numbers = contact.split("/");

        var cuisine = (data[i].cuisine || "")+"";
        if(cuisine){
          data[i].cuisines = cuisine.split(",");
          cuisines = _.union(cuisines,data[i].cuisines);
        } 
      }
      $scope.uniqueCuisines = _.uniq(cuisines.map(function(x){ return x.trim()})).sort();
      $scope.uniqueLocations = _.uniq(locations).sort();
      $scope.data = data;
      $scope.isLoading = false;
  });


  $scope.filteredData = function(){
      var data = $scope.data;
      var dataSearchLocation = [];
      var dataSearchCuisine = [];

      for(var d in $scope.searchLocationData){
        if($scope.searchLocationData[d]){
            dataSearchLocation = dataSearchLocation.concat($scope.data.filter(function(x){ return x.location == d}));
        }
      }
      for(var d in $scope.searchCuisineData){
        if($scope.searchCuisineData[d]){
            dataSearchLocation = dataSearchCuisine.concat($scope.data.filter(function(x){ return x.cuisine.split(",").map(function(y){ return y.trim();}).indexOf(d) != -1}));
        }
      }
      if(dataSearchCuisine.length > 0) data = dataSearchCuisine;
      if(dataSearchLocation.length > 0) data = dataSearchLocation;
      return $filter('filter')(data, $scope.searchText);
  }
  $scope.savePreferences = function(){
    localStorage.setItem("tableView",  $scope.tableView ? 1 : 0);
    localStorage.setItem("showImages", $scope.showImages ? 1 : 0);
    localStorage.setItem("searchLocationData", JSON.stringify($scope.searchLocationData));
    localStorage.setItem("searchCuisineData", JSON.stringify($scope.searchCuisineData));
  }
  $scope.loadPreferences = function(e){
    $scope.tableView = ((localStorage.getItem("tableView") || "") == 1);
    $scope.showImages = ((localStorage.getItem("showImages") || "") == 1);
    $scope.searchLocationData = {};
    $scope.searchCuisineData = {};
    try {
      $scope.searchLocationData = JSON.parse(localStorage.getItem("searchLocationData")) || {};
    } catch (e) {

    } finally {
    }
    try {
      $scope.searchCuisineData = JSON.parse(localStorage.getItem("searchCuisineData")) || {};
    } catch (e) {

    } finally {

    }
    if($scope.searchLocationData == null || typeof($scope.searchLocationData) != "object") $scope.searchLocationData = {};
    if($scope.searchCuisineData == null || typeof($scope.searchCuisineData) != "object") $scope.searchCuisineData = {};
  }
  $scope.loadPreferences();
}]);


var appFilters = angular.module('appFilters', []);
appFilters.filter('checkbox', function() {
  return function(input) {
    return input ? '\u2713' : '\u2718';
  };
});
appFilters.filter('formatTime', function() {
  return function(input) {
    if(!input) return "";
    if(typeof(input) != "undefined"){
        input = input+"";
        if(input.length > 0){
          while(input.length < 4) input = "0" + input;
        }
    }
    return input;
  };
});
appFilters.filter('formatPrice', function() {
  return function(input) {
    if(!input) return "";
    return parseFloat(input).toFixed(2);
  };
});
appFilters.filter('removeSpacesTel', function() {
  return function(input) {
    if(typeof(input) != "undefined"){
      input = input+"";
      input = input.replace(/ /gi, '');
      input = input.replace(/ext.*/gi, '');
    }
    return input;
  };
});


var theApp = angular.module('myApp', [
  'appControllers',
  'appFilters'
]);
