#CruiserGram: LandCruiser pics for days!

Website: (http://cruisergram.club)

##Contents:

####Overview

####Technologies

####MVP 

####Challenges

####Contributors

####Example Code

##Overview:
For my final DigitalCrafts project I wanted to make something that allowed me to have fun with my other great love: LandCruisers.  After debating a few ideas, I landed on the idea of an InstaGram like app, that would be devoted to pictures of LandCruisers or other Toyota 4x4's.  I wanted to keep it pretty basic, and fun to use; so I implemented login with Google for easy access, and kept functionality limited to posting pictures, liking(upvoting) pictures, and displaying user pics.  In the end, I hope this will be a nice distraction for those of you who love looking at pictures of LandCruisers as much as I do.  

On to the tech:
Full stack build utilizing the MEAN stack, as well as Google's Oauth API and cloud storage (images). 
  
##Technologies:

###Front end:
AngularJS framework, utilizing Angular-ui-router
Skeleton
Bower
NG-File upload


###Back end:
NodeJS
MongoDB
Modules:
  Express
  Mongoose
  Multer
  Google
  UUIDV4
  BodyParser
  Bluebird
  GoogleApis

####API back-end built using NodeJS(and a host of NPM modules), with the following functionality (and corresponding route handlers):
 
 List and display "Grams" (pics) of all users 
 
 Create a new Gram via Multer and Google Cloud upload (image file storage to reduce load on server)
 
 User Profile Page displaying all of the user's pics, and LogOut option
 
 Upvote/Like Grams and update the DB accordingly with new count
  
####MongDB Database

####MVP
Google Login
Local server image storage
Upload photos
Display all user grams on main "gram" page
User profile page with user uploaded Grams
Caption for images upon upload
Like images

#####Stretch Goals:
Google Cloud storage (IMPLEMENTED!!)
Delete grams
Follow other users
Hash Tags
Private messaging via socket.io type setup
Ionic build for native Android/Ios app

####Challenges:

1.  Google login:  

Implementing Google login with an Angular template proved to be a bit more cumbersome than I'd initially planned.  I was able to implement the "default" option on my index.html page without much issue, but when moving it into my home.html template (within the UI-view) the button would not render.  In the end I actually went with a different setup within the controller for that home.html template:
`
function onSuccess(googleUser) {
   //  console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
   }

   function onFailure(error) {
     console.log(error);
   }

   $scope.renderButton = function () {
     gapi.signin2.render('my-signin2', {
       'scope': 'profile email',
       'width': 400,
       'height': 70,
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
    // console.log('Name: ' + profile.getName());
    $scope.avatar = profile.getImageUrl();
    // console.log('Image URL: ' + profile.getImageUrl());
    // console.log('Email: ' + profile.getEmail());
    $cookies.put('user_id', $scope.id_token);
    $cookies.put('avatar', $scope.avatar);
    $cookies.put('name', $scope.userName);
    $state.go('grams');
  }
});
`
I set the functions to scope variables, then call the renderButton function on the loading of the page.  This successfully loads the button.  There is a lot of additional work involved within setting up your project with Google, which is well described on their website.  Make sure to set up a project WITH credentials.  That's the ID that you need--not the one that you assignn to your project.

2.  Google Cloud Storage:

After reading an article about how someone setup a Pokemon related social media site that relied on server side storage (and then inadvertantly crashed said servers) I knew I wanted to work with cloud storage for the images.  Having no grandiose illusions of the popularity of my site, I wanted to at least explore the option, since there was a clear, real world application, and my site was basically 100% image storage.  It, like 



###Contributions:  
Please feel free to make suggestions, or utilize the Google API setup for login and the cloud storage, which proved to be a bit more challenging than I'd originally expected.



###Contributor:

#####Jason Campbell 




