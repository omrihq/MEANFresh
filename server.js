var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('freshlist', ['freshlist']);
var cron = require('cron');
var scraper = require('./freshscrape');



app.use(express.static(__dirname + "/public"));

app.get('/freshlist', function (req, res) {
	console.log("I received a GET request");

    db.freshlist.find(function (err, docs) {
    	console.log(docs);
    	res.json(docs);
    })
});

var cronJob = cron.job("0 * * * * *", function(){
	var songs = scraper.scrape();
	for (song in songs) { 
		console.log(song);
	}

	
	console.log('cron job completed');
}); 
cronJob.start();


app.listen(3000);
console.log("Server running on port 3000");

