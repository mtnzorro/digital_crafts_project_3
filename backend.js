
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
var Storage = require('@google-cloud/storage');
var CLOUD_BUCKET = 'cruisergram-153403';
// var storage = Storage({
//   projectId: 'cruisergram-153403'
// });
// var bucket = storage.bucket(CLOUD_BUCKET);
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

var saltRounds = 10;



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
  user_id: String,
  caption: String,
  avatar_url: String,
  comments: [String]
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
    commments: []
  });

  return gram.save()
  .then(function(gram) {
    console.log("CruiserGram was added", gram);
    return gram;
  });
}


        // newUser();
app.post('/new_user', function(req,res){
  var user_id = req.body.user_id;
  var avatar_url = req.body.avatar_url;
  var password = req.body.password;
  var email = req.body.email;
  bcrypt.hash(password, saltRounds)
    .then(function(hash){
      return hash;
    })
    .then(function(hash){
    return newUser(user_id, avatar_url, hash, email);
    })
    .then(function(user){
      console.log(user);
      res.send(user);
      console.log("Created new user");
    })
    .catch(function(err){
      console.log("Failed to create new User", err.message);
    });
});


app.post('/gram', multer.single('file'), function(req, res) {
  console.log(req.file.filename);
  console.log(req.body);

  var url = '/images/my-uploads/' + req.file.filename;
  console.log(url);
  var user_id = req.body.user_id;
  var name = req.body.name;
  var avatar_url = req.body.avatar_url;
  var caption = req.body.caption;
  var date = new Date();
  //add
  return newGram(url, date, user_id, name, avatar_url, caption)
  .then(function(gram){
    console.log(gram);
    res.send(gram);
    console.log("Created new Gram");
  })
  .catch(function(err) {
      console.log("Error posting gram: ", err.stack);
    });
  });


app.get('/api/photos', function(req,res){
  Gram.find().sort({date:-1})
  .then(function(results){
    console.log("Photo results", results);
    res.send(results);
  });
});
// var feed = new Instafeed({
//     get: 'tagged',
//     tagName: 'land cruiser',
//     clientId: '0366715be32f43d583ff54494603c93c'
// });
// console.log(feed);



app.listen(3000, function() {
  console.log('listening on 3000');
});
