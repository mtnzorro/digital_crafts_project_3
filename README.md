#CruiserGram: LandCruiser pics for days!

Website: (https://cruisergram.club)

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
HTTPS

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
```
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
```
I set the functions to scope variables, then call the renderButton function on the loading of the page.  This successfully loads the button.  There is a lot of additional work involved within setting up your project with Google, which is well described on their website.  Make sure to set up a project WITH credentials.  That's the ID that you need--not the one that you assignn to your project.

2.  Google Cloud Storage:

After reading an article about how someone setup a Pokemon related social media site that relied on server side storage (and then inadvertantly crashed said servers) I knew I wanted to work with cloud storage for the images.  Having no grandiose illusions of the popularity of my site, I wanted to at least explore the option, since there was a clear, real world application, and my site is essentially 100% image storage.  

The process of uploading and storing locally proved challenging in its own right.  After researching and attempting to utilize ng-file-upload to handle the entire upload process, I started to get a grasp on the process, and figured out the need for a middleware solution on the backend to facilitate the storage process.  

Here's the process:

  a. Insert the ng-file-upload directive into your HTML.  Mine was within a template called postGram, and the example code I selected was a form, and I chose to only display the "Select Image" button until the selection of an image.  The module also provides a means for a thumbnail image display which you can see represented in ngf-thumbnail.
  
  `
<form name="form">
  <!-- Single Image with validations -->
<div class="sign_out_button_wrapper">
  <div class="button" ngf-select ng-model="file" name="file" ngf-pattern="'image/*'"
    ngf-accept="'image/*'" ngf-max-size="10MB" ngf-resize="{width: 1080, height: 1080, quality: 1.0}"
    >Select Image</div>
    <button ng-show="file" class="button post_button" type="submit" ng-click="submit()">Post</button>
</div>

    <div ng-show="file" class="upload_container">
      <img class="thumbnail" ngf-thumbnail="file">
      <input class="u-full-width" ng-model="caption" type="text" name="" placeholder = "Caption this photo">

    </div>
</form>

`
b.  Add in the javascript into your controller (if using states), or your front end JS file.  Ng-file-upload will take in the file passed through your html page, and pass it to your backend (in this case my '/gram' route).  In this example I'm also passing a user_id parameter, to have some way of identifying the photo in a later query.  On click of the submit button on the HTML page, the $scope.submit function is called, which checks to make sure that a valid file has been selected, thereafter calling the upload funtion.  We'll explore more of what happens next in the backend. 

```
  $scope.submit = function() {
      if ($scope.form.file.$valid && $scope.file) {
        $scope.upload($scope.file);
      }
    };

    // upload on file select or drop
    $scope.upload = function () {
      var user_id = $cookies.get('user_id');
        Upload.upload({
            url: '/gram',
            data: {
            file: $scope.file,
            user_id: user_id,
            }
        }).then(function (resp) {
            $scope.upload_complete = true;
           
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);

        });

    };
    
  ```
  c.  Middleware (MULTER to the rescue!)
  
  I'm not sure why it took me so long to figure out the missing piece, but the Multer module is what you want to use to handle the file storage after ng-file-upload routes to your backend.  Multer is middleware that will help to then either store the file locally (or if you're daring, store to cloud storage via something like Google or AWS).  Here's how I set up Multer (I'm assuming you know to 'npm install multer' first):

```
const Multer = require('multer');
var storage = Multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/my-uploads')
  },
  filename: function (req, file, cb) {
    var fieldname = uuidV4();
  cb(null, fieldname + '.jpg' );
}
});

var multer = Multer({
  storage: storage,

});

```

This sets up Multer for local storage in my public images my-uploads directory.  I initially set this up so that i hashed the file name with UUID4, but that's unnecessary.  You can name the files however you'd like.

d.  The route!  Backend fun:

```
app.post('/gram', multer.single('file'), function(req, res) {
  var url = '/images/my-uploads/' + req.file.filename;
  console.log(url);
  var user_id = req.body.user_id;
  var name = req.body.name;
  console.log(name);
  var avatar_url = req.body.avatar_url;
  var caption = req.body.caption;
  var date = new Date();
  //add
  return newGram(url, date, user_id, name, avatar_url, caption)
  .then(function(gram){
    // console.log(gram);
    // console.log(caption);
    res.send(gram);
    console.log("Created new Gram");
  })
  .catch(function(err) {
      console.log("Error posting gram: ", err.stack);
    });
  });
```



###Contributions:  
Please feel free to make suggestions, or utilize the Google API setup for login and the cloud storage, which proved to be a bit more challenging than I'd originally expected.



###Contributor:

#####Jason Campbell 




