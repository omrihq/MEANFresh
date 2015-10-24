var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('freshlist', ['freshlist']);


app.use(express.static(__dirname + "/public"));

app.get('/freshlist', function (req, res) {
	console.log("I received a GET request");

    db.freshlist.find(function (err, docs) {
    	console.log(docs);
    	res.json(docs);
    })
});

app.listen(3000);
console.log("Server running on port 3000");

