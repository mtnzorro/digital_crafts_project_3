var app = angular.module('CruiserUp', ['ui.router']);


app.controller('HomeController', function($scope, $state){

});

app.controller('ListingsController', function($scope, $state){

});

app.controller('newSellerController', function($scope, $state){

});

app.config(function($stateProvider, $urlRouterProvider){
  $stateProvider

  .state({
    name: 'home',
    url: '/',
    templateUrl: '/templates/home.html',
    controller: 'HomeController'
  })
  .state({
    name: 'listings',
    url: '/listings',
    templateUrl: '/templates/listings.html',
    controller: 'ListingsController'
  })

  .state({
    name: 'newSeller',
    url: '/newSeller',
    templateUrl: '/templates/newSeller.html',
    controller: 'newSellerController'
  });

  $urlRouterProvider.otherwise('/')
});
