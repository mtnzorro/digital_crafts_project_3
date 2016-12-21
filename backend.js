
//NPM dependencies
// var Instafeed = require("instafeed");
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bluebird = require('bluebird');
var bcrypt = require('bcrypt');
var saltRounds = 10;
//Mongoose
mongoose.Promise = bluebird;
mongoose.connect('mongodb://localhost/rigfinder');
mongoose.set('debug', true);
//Middleware
app.use(express.static('public'));
app.use(bodyParser.json());
//Constructor Schema
const Seller = mongoose.model('Seller', {
  _id: String, // actually the username
  password: String,
  avatar_url: String,
  vehicle: {
    make: String,
    model: String,
    year: Number,
    sales_price: Number,
    location: Number,
    photos :[String],
  },
  email: String
  // followers: [ObjectId]  // do not need it for now
});

const Buyer = mongoose.model('Buyer', {
  _id: String, // actually the username
  password: String,
  avatar_url: String,
  starred:[String]
  // followers: [ObjectId]  // do not need it for now
});

function newSeller(id, avatar_url, password, vehicle, email) {
      var newSeller = new Seller({
        _id: id,
        avatar_url: avatar_url,
        password: password,
        vehicle: vehicle,
        email: email
      });

    return newSeller.save()
        .then(function(seller) {
          // res.send(user);
          console.log("Save ok ", seller);
          return seller;
        });


    // newSeller();
}
    function newBuyer() {
          var newBuyer = new Buyer({
            _id: 'Bob',
            avatar_url: 'bob.jpg',
            password: 'hash'
          });

          newBuyer.save()
            .then(function(user) {
              // res.send(user);
              console.log("Added user ", user);
            })
            .catch(function(err) {
              console.log("Error: ", err.stack);
            });
        }
        // newBuyer();
        app.post('/new_seller', function(req,res){
          var user_id = req.body.user_id;
          var avatar_url = req.body.avatar_url;
          var password = req.body.password;
          var vehicle = req.body.vehicle;
          var email = req.body.email
          bcrypt.hash(password, saltRounds)
            .then(function(hash){
              return hash;
            })
            .then(function(hash){
            return newSeller(user_id, avatar_url, hash, vehicle);
            })
            .then(function(seller){
              console.log(seller);
              res.send(seller);
              console.log("Created new seller");
            })
            .catch(function(err){
              console.log("Failed to create new Seller", err.message);
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
