
// var Instafeed = require("instafeed");
var express = require('express');
var app = express();
app.use(express.static('public'));

// var feed = new Instafeed({
//     get: 'tagged',
//     tagName: 'land cruiser',
//     clientId: '0366715be32f43d583ff54494603c93c'
// });
// console.log(feed);



app.listen(3000, function() {
  console.log('listening on 3000');
});
