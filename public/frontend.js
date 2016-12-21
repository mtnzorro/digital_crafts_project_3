var app = angular.module('CruiserUp', ['ui.router']);

app.factory("CruiserUp_api", function factoryFunction($http, $state){
  var service = {};
  service.worldTweets = function() {
  return $http({
    url: '/api/listing'
  });
};

  service.sellerSignup = function(user_id, password, email, avatar_url, make, model, year, sales_price, mileage, location, photos) {
  return $http({
    url: '/new_seller',
    method: "POST",
    data: {
      user_id : user_id,
      avatar_url  : avatar_url,
      password : password,
      vehicle : {
        make: make,
        model: model,
        year: year,
        sales_price: sales_price,
        mileage: mileage,
        location: location,
        photos: photos
      },
      email: email
    }
  });
};

  service.listingDisplay = function(){
    return $http({
      url: '/api/listings'
    });
  };

return service;
});


app.controller('HomeController', function($scope, $state, CruiserUp_api){

});

app.controller('ListingsController', function($scope, $state, CruiserUp_api){
  CruiserUp_api.listingDisplay()
  .then(function(resp){
    console.log(resp.data)
    $scope.listingResults = resp.data;
  })
  .catch(function(err){
    console.log("Error displaying listings:", err.message);
  });
});

app.controller('newSellerController', function($scope, $state, CruiserUp_api){
  $scope.submitSeller = function(){
    if($scope.password1 === $scope.password2){
      CruiserUp_api.sellerSignup($scope.user_id, $scope.password1, $scope.email, $scope.avatar_url, $scope.make, $scope.model, $scope.year, $scope.sales_price, $scope.mileage, $scope.location, $scope.photos )
      .then(function(){
        console.log('Seller signup successful');
        $state.go('listings');
      })
      .catch(function(err){
        console.log("Seller signup error:", err.message);
      });
    }
  };
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
