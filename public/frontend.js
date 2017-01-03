var app = angular.module('CruiserUp', ['ui.router', 'ngFileUpload', 'ngCookies', 'ngImgCrop']);

app.factory("CruiserGram_api", function factoryFunction($http, $state){
  var service = {};
//   service.worldGram = function() {
//   return $http({
//     url: '/api/photos'
//   });
// };

  service.userSignup = function(user_id, password, email, avatar_url) {
  return $http({
    url: '/new_user',
    method: "POST",
    data: {
      user_id : user_id,
      avatar_url  : avatar_url,
      password : password,
      email: email
    }
  });
};

  service.gramDisplay = function(){
    return $http({
      url: '/api/photos'
    });
  };

  service.loadProfile = function(user_id) {
    return $http({
      url: '/api/profile-info',
      params: {
        user_id: user_id
      }
    });
  };

return service;
});


app.controller('HomeController', function($scope, $state, CruiserGram_api){

});

app.controller('GramsController', function($scope, $stateParams, $state, CruiserGram_api){

  CruiserGram_api.gramDisplay()
  .then(function(resp){
    // console.log(resp.data)
    $scope.gramResults = resp.data;
  })
  .catch(function(err){
    console.log("Error displaying photos:", err.message);
  });
});

app.controller('profileController', function($scope, $stateParams, $state, CruiserGram_api){
    $scope.name = $stateParams.name;
  CruiserGram_api.loadProfile($scope.name)
  .then(function(resp){
    $scope.userResults = resp.data[0];
    // console.log(resp.data)
    $scope.gramResults = resp.data[1];
  })
  .catch(function(err){
    console.log("Error displaying photos on profile page:", err.message);
  });
});

app.controller('newUserController', function($scope, $state, CruiserGram_api){
  $scope.submitUser = function(){
    if($scope.password1 === $scope.password2){
      $scope.avatar_url = '/images/cruiser_av.png';
      CruiserGram_api.userSignup($scope.user_id, $scope.password1, $scope.email, $scope.avatar_url)
      .then(function(){
        console.log('User signup successful');
        $state.go('grams');
      })
      .catch(function(err){
        console.log("User signup error:", err.message);
      });
    }
  };
});

app.controller('postGramController', ['$scope', 'Upload', '$state', function ($scope, Upload, $state, CruiserGram_api) {
    // Image cropping
    // $scope.myImage='';
    // $scope.myCroppedImage='';
    //
    // var handleFileSelect=function(evt) {
    //   var file=evt.currentTarget.files[0];
    //   var reader = new FileReader();
    //   reader.onload = function (evt) {
    //     $scope.$apply(function($scope){
    //       $scope.myImage=evt.target.result;
    //     });
    //   };
    //   reader.readAsDataURL(file);
    // };

    // upload later on form submit
    $scope.submit = function() {
      if ($scope.form.file.$valid && $scope.file) {
        $scope.upload($scope.file);
        console.log('IS this trying to state.go');

      }

    };

    // upload on file select or drop
    $scope.upload = function () {
      var user_id = 'mountainlife';
      var avatar_url = '/images/cruiser_av.svg';
      var caption = $scope.caption;
      console.log("In upload function", caption);
        Upload.upload({
            url: '/gram',
            data: {
            file: $scope.file,
            user_id: user_id,
            avatar_url: avatar_url,
            caption: caption,
            }
        }).then(function (resp) {
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            $scope.upload_complete = true;
              $state.go('grams');
            console.log(caption);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);

        });

    };
    // for multiple files:
    // $scope.uploadFiles = function (files) {
    //   if (files && files.length) {
    //     for (var i = 0; i < files.length; i++) {
    //       Upload.upload({..., data: {file: files[i]}, ...})...;
    //     }
    //     // or send them all together for HTML5 browsers:
    //     Upload.upload({..., data: {file: files}, ...})...;
    //   }
    // }
}]);

app.config(function($stateProvider, $urlRouterProvider){
  $stateProvider

  .state({
    name: 'home',
    url: '/',
    templateUrl: '/templates/home.html',
    controller: 'HomeController'
  })
  .state({
    name: 'grams',
    url: '/grams',
    templateUrl: '/templates/grams.html',
    controller: 'GramsController'
  })

  .state({
    name: 'newUser',
    url: '/newUser',
    templateUrl: '/templates/newUser.html',
    controller: 'newUserController'
  })

  .state({
    name: 'postGram',
    url: '/postGram',
    templateUrl: '/templates/postGram.html',
    controller: 'postGramController'
  })

  .state({
    name: 'profile',
    url: '/profile',
    templateUrl: '/templates/profile.html',
    controller: 'profileController'
  })
  ;



  $urlRouterProvider.otherwise('/');
});
