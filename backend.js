
//NPM dependencies
// var Instafeed = require("instafeed");
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bluebird = require('bluebird');
var bcrypt = require('bcrypt');
var moment = require('moment');
var uuidV4 = require('uuid/v4');
var saltRounds = 10;
//Google credentials
var google = require('googleapis');
var urlshortener = google.urlshortener('v1');

process.env.GOOGLE_APPLICATION_CREDENTIALS = 'public/CruiserGram-0ff72a32dd1a.json';

var params = {
  shortUrl: 'http://goo.gl/xKbRu3'
};

google.auth.getApplicationDefault(function(err, authClient) {
   if (err) {
     return (err);
   }});

//Cloud storage
var Storage = require('@google-cloud/storage');
var CLOUD_BUCKET = 'cruisergram-153403';
const storage = Storage({
  projectId: 'cruisergram-153403'
});
const bucket = storage.bucket(CLOUD_BUCKET);

//Cloud uploading


// [START public_url]
function getPublicUrl (filename) {
  return `https://storage.googleapis.com/${CLOUD_BUCKET}/${filename}`;
}

// Express middleware that will automatically pass uploads to Cloud Storage.
// req.file is processed and will have two new properties:
// * ``cloudStorageObject`` the object name in cloud storage.
// * ``cloudStoragePublicUrl`` the public url to the object.
// [START process]
function sendUploadToGCS (req, res, next) {
  if (!req.file) {
    return next();
  }

  const gcsname = Date.now() + req.file.originalname;
  const file = bucket.file(gcsname);

  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype
    }
  });

  stream.on('error', (err) => {
    req.file.cloudStorageError = err;
    next(err);
  });

  stream.on('finish', () => {
    req.file.cloudStorageObject = gcsname;
    req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);
    next();
  });

  stream.end(req.file.buffer);
}

const Multer = require('multer');
const multer = Multer({
  storage: Multer.MemoryStorage,
});







//Mongoose
mongoose.Promise = bluebird;
mongoose.connect('mongodb://localhost/cruisergram');
mongoose.set('debug', true);
//Middleware
app.use(express.static('public'));
app.use(bodyParser.json());



function getPublicUrl (filename) {
  return `https://storage.googleapis.com/${CLOUD_BUCKET}/${filename}`;
}

// req.file is processed and will have two new properties:
// * ``cloudStorageObject`` the object name in cloud storage.
// * ``cloudStoragePublicUrl`` the public url to the object.
// [START process]
function sendUploadToGCS (req, res, next) {
  if (!req.file) {
    return next();
  }

  const gcsname = Date.now() + req.file.originalname;
  const file = bucket.file(gcsname);

  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype
    }
  });

  stream.on('error', (err) => {
    req.file.cloudStorageError = err;
    next(err);
  });

  stream.on('finish', () => {
    req.file.cloudStorageObject = gcsname;
    req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);
    next();
  });

  stream.end(req.file.buffer);
}
// [END process]

const User = mongoose.model('User', {
  _id: String, // actually the username
  password: String,
  email: String,
  avatar_url: String,
  following: [String]
  // followers: [ObjectId]  // do not need it for now
});

const Gram = mongoose.model('Gram', {
  url: String,
  date: Date,
  name: String,
  user_id: String,
  caption: String,
  avatar_url: String,
  count: Number,
  comments: [String],
  liked: [String]
});


function newUser(id, avatar_url, password, email) {
    var newUser = new User({
      _id: id,
      avatar_url: avatar_url,
      password: password,
      email: email
    });

  return newUser.save()
      .then(function(user) {
        // res.send(user);
        console.log("Save ok ", user);
        return user;
      });

}

function newGram(url, date, user_id, name, avatar_url, caption) {
  var gram = new Gram({
    url: url,
    date: date,
    user_id: user_id,
    name: name,
    avatar_url: avatar_url,
    caption: caption,
    commments: [],
    liked: []
  });

  return gram.save()
  .then(function(gram) {
    console.log("CruiserGram was added", gram);
    return gram;
  });
}


//Post a new Gram
app.post('/gram', multer.single('file'), sendUploadToGCS, function(req, res, next) {
  // let data = req.body;
  // var url = '/images/my-uploads/' + req.file.filename;

  var user_id = req.body.user_id;
  var name = req.body.name;
  var avatar_url = req.body.avatar_url;
  var caption = req.body.caption;
  var date = new Date();

  if (req.file && req.file.cloudStoragePublicUrl) {
    console.log("Made it inside the upload check");
     var url = req.file.cloudStoragePublicUrl;
     console.log(url);
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
   }
  });

//Display all Grams to gram page
app.get('/api/photos', function(req,res){
  Gram.find().sort({count:-1}).sort({date:-1})
  .then(function(results){
    // console.log("Photo results", results);
    res.send(results);
  });
});

// User Profile page
app.get('/api/profile-info', function (req, res) {
  var user_id = req.query.user_id;
  console.log(user_id);
  var profile_results = [];
  bluebird.all([
    Gram.find({ user_id: user_id }).sort({count:-1}).sort({date:-1}),
    User.findById(user_id)
  ])
  .spread(function(grams, user) {
    // console.log(grams);
    var grams_arr = [];
    profile_results.push(user);
    profile_results.push(grams);
      res.send(profile_results);
  });
});

//Upvote-like a Gram
app.post('/api/upvote', function(req,res){
  var gram_id = req.body.gram_id;
  var user_id = req.body.user_id;
  console.log(user_id);
  Gram.findById(gram_id)
  .then(function(gram){
    // console.log(gram);
    if(gram.liked.includes(user_id)){
      console.log("User already liked");
      res.sendStatus(200);
    }
    else{
      Gram.update({_id :gram_id}, {$inc: {"count": 1}})
      .then(function(result){
        // console.log(result);
      }
    )
    .then(function(){
      Gram.update({_id :gram_id}, {"liked": user_id})
      .then(function(result){
        console.log(result);
        res.sendStatus(200);
      }
    );
  });
    }
  });


});


app.listen(3000, function() {
  console.log('listening on 3000');
});
