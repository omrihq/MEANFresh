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
		for (i = 0; i < songs.length; i++) {
			song = songs[i];
			db.freshlist.update(
				{title: song['title']},
				{title: song['title'],
				 songlink: song['songlink'],
				 score: song['score'],
				 date: song['date'],
				 comments: song['comments'],
				 postlink: song['postlink']
				},
				{upsert: true}
			);
		}		
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


/*{
	"_id" : ObjectId("562ea84229d5c2eea64e8718"),
	"song" : {
		"title" : " Busdriver - Ministry of the Torture Couch (feat. Hemlock Ernst)",
		"songlink" : "https://soundcloud.com/driverdriverdriverdriverdriverdriverdriverdriver/busdriver-ministry-of-the-torture-couch-feat-hemlock-ernst-prod-by-elos",
		"score" : 23,
		"date" : "Mon Oct 26",
		"comments" : 8,
		"postlink" : "https://www.reddit.com/r/hiphopheads/comments/3qapdp/fresh_busdriver_ministry_of_the_torture_couch/"
	}*/

app.listen(3000);
console.log("Server running on port 3000");

