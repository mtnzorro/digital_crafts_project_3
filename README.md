#CruiserGram: LandCruiser pics for days!

Website: (http://cruisergram.club)

##Contents:

####Overview

####Technologies

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

###Contributor:

#####Jason Campbell 




