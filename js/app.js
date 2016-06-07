"use strict";







var appControllers = angular.module('appControllers', []);

appControllers.controller('buffetCtrl', ['$scope', '$filter', '$http', '$sce', '$timeout', function($scope, $filter, $http, $sce, $timeout) {

  $scope.isLoading = true;
  $scope.tableView = false;
  $scope.showImages = true;
  $scope.searchLocationData = {};
  $scope.data = [];
  $scope.uniqueLocations = [];


  $http.get("data/buffets.json").success(function(data) {
      var locations = data.map(function(x){ return x.location});
      for(var i = 0; i < data.length; i++){
        var contact = (data[i].contact || "")+"";
        if(contact) data[i].numbers = contact.split("/");
      }
      locations = _.uniq(locations).sort();
      $scope.data = data;
      $scope.uniqueLocations = locations;
      $scope.isLoading = false;
  });


  $scope.filteredData = function(){
      var data = $scope.data;
      var dataSearchLocation = [];

      for(var d in $scope.searchLocationData){
        if($scope.searchLocationData[d]){
            dataSearchLocation = dataSearchLocation.concat($scope.data.filter(function(x){ return x.location == d}));
        }
      }
      if(dataSearchLocation.length > 0) data = dataSearchLocation;
      return $filter('filter')(data, $scope.searchText);
  }
  $scope.savePreferences = function(){
    localStorage.setItem("tableView",  $scope.tableView ? 1 : 0);
    localStorage.setItem("showImages", $scope.showImages ? 1 : 0);
    localStorage.setItem("searchLocationData", JSON.stringify($scope.searchLocationData));
  }
  $scope.loadPreferences = function(e){
    $scope.tableView = ((localStorage.getItem("tableView") || "") == 1);
    $scope.showImages = ((localStorage.getItem("showImages") || "") == 1);
    $scope.searchLocationData = {};
    try {
      $scope.searchLocationData = JSON.parse(localStorage.getItem("searchLocationData")) || {};
    } catch (e) {

    } finally {

    }
    if($scope.searchLocationData == null || typeof($scope.searchLocationData) != "object") $scope.searchLocationData = {};
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
    if(typeof(input) != "undefined"){
        input = input+"";
        if(input.length > 0){
          while(input.length < 4) input = "0" + input;
        }
    }
    return input;
  };
});
appFilters.filter('removeSpaces', function() {
  return function(input) {
    if(typeof(input) != "undefined"){
      input = input+"";
      input = input.replace(/ /gi, '');
    }
    return input;
  };
});


var theApp = angular.module('myApp', [
  'appControllers',
  'appFilters'
]);
