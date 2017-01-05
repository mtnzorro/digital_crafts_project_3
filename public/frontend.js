var app = angular.module('CruiserUp', ['ui.router', 'ngFileUpload', 'ngCookies', 'ngImgCrop']);




app.factory("CruiserGram_api", function factoryFunction($http, $state){
  var service = {};
//   service.worldGram = function() {
//   return $http({
//     url: '/api/photos'
//   });
// };

//   service.userSignup = function(user_id, password, email, avatar_url) {
//   return $http({
//     url: '/new_user',
//     method: "POST",
//     data: {
//       user_id : user_id,
//       avatar_url  : avatar_url,
//       password : password,
//       email: email
//     }
//   });
// };

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

  service.upvote = function(gram_id, user_id) {
    return $http({
      url: '/api/upvote',
      method: "POST",
      data: {
        gram_id: gram_id,
        user_id: user_id
      }
    });
  };

return service;
});


app.controller('HomeController', function($scope, $cookies, $state, CruiserGram_api){
  function onSuccess(googleUser) {
     console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
   }

   function onFailure(error) {
     console.log(error);
   }

   $scope.renderButton = function () {
     gapi.signin2.render('my-signin2', {
       'scope': 'profile email',
       'width': 240,
       'height': 50,
       'longtitle': true,
       'theme': 'light',
       'onsuccess': onSignIn,
       'onfailure': onFailure
     });
   };
   $scope.renderButton();

  function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log(profile.ofa);
    // $scope.id_token = googleUser.getAuthResponse().id_token;
    $scope.id_token = profile.getEmail();
    // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    $scope.userName = profile.ofa;
    console.log('Name: ' + profile.getName());
    $scope.avatar = profile.getImageUrl();
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail());
    $cookies.put('user_id', $scope.id_token);
    $cookies.put('avatar', $scope.avatar);
    $cookies.put('name', $scope.userName);
    $state.go('grams');
  }
});

app.controller('GramsController', function($scope, $cookies, $stateParams, $state, CruiserGram_api){

  CruiserGram_api.gramDisplay()
  .then(function(resp){
    // console.log(resp.data)
    $scope.gramResults = resp.data;
  })
  .catch(function(err){
    console.log("Error displaying photos:", err.message);
  });

  $scope.upvote = function(gram_id){
    var user_id = $cookies.get('user_id');
    CruiserGram_api.upvote(gram_id, user_id)
    .then(function(resp){
      CruiserGram_api.gramDisplay()
      .then(function(resp){
        // console.log(resp.data)
        $scope.gramResults = resp.data;
      }); 
    console.log("Gram is upvoted", resp);
  });

};
});

app.controller('profileController', function($scope, $cookies, $stateParams, $state, CruiserGram_api){
  $scope.userId = $cookies.get('user_id');
  CruiserGram_api.loadProfile($scope.userId)
  .then(function(resp){
    $scope.userResults = resp.data[0];
    console.log(resp.data);
    $scope.gramResults = resp.data[1];
  })
  .catch(function(err){
    console.log("Error displaying photos on profile page:", err.message);
  });



  $scope.signOut = function() {
    gapi.load('auth2', function(){
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function () {
        console.log('User signed out.');
        // $cookies.remove('id_token');
        $cookies.remove('avatar');
        $cookies.remove('name');
        $state.go('home');
      });
    });


  };
});

app.controller('postGramController', ['$scope', 'Upload', '$state', '$cookies', function ($scope, Upload, $state, $cookies, CruiserGram_api) {
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


      }

    };

    // upload on file select or drop
    $scope.upload = function () {
      var user_id = $cookies.get('user_id');
      var avatar_url = $cookies.get('avatar');
      var caption = $scope.caption;
      var userName = $cookies.get('name');
      console.log("In upload function", caption);
        Upload.upload({
            url: '/gram',
            data: {
            file: $scope.file,
            name: userName,
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
