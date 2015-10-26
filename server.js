var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('freshlist', ['freshlist']);
var cron = require('cron');
var scraper = require('./freshscrape');



app.use(express.static(__dirname + "/public"));

//ASK HASI ABOUT CALLBACKS
var cronJob = cron.job("0 * * * * *", function(){

	scraper.scrape(function(songs){

		db.freshlist.insert(songs);
		console.log(songs);
		
		console.log('cron job completed');
	});
}); 
cronJob.start();


app.get('/freshlist', function (req, res) {
	console.log("I received a GET request");

	db.freshlist.find(function (err, docs) {
		console.log(docs);
		res.json(docs);
	})
});

/*
var cronJob = cron.job("/15 * * * * *", function(){
	//Every 4 hours
	var songs = scraper.scrape();
	for (song in songs) {
		console.log(song);
		//db.freshlist.insert(song);
	}
	console.log('cron job completed');
}); 
cronJob.start();
*/



/*
app.post('/freshlist', function (req, res) {
	db.freshlist.insert(song, function(err, doc) {
		res.json(doc);
	});
}
*/

app.listen(3000);
console.log("Server running on port 3000");

