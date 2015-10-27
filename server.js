var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('freshlist', ['freshlist']);
var cron = require('cron');
var scraper = require('./freshscrape');
var moment = require('moment');

/*Biblical proportions: 
https://docs.mongodb.org/manual/reference/

https://www.youtube.com/watch?v=kHV7gOHvNdk
*/

app.use(express.static(__dirname + "/public"));

// Cronjob: http://stackoverflow.com/questions/20499225/i-need-a-nodejs-scheduler-that-allows-for-tasks-at-different-intervals
var scrapeJob = cron.job("0 0 */4 * * *", function(){

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
			 postlink: song['postlink'],
			},
			{upsert: true}
			);
		};
			
	});		
		console.log('cron job completed');
});
scrapeJob.start();


var deleteJob = cron.job("0 0 0 */2 * *", function() {
	var four = moment().subtract(2, 'days');

	//http://stackoverflow.com/questions/11973304/mongodb-mongoose-querying-at-a-specific-date
	db.freshlist.remove({"date": {$lt : four.toISOString()}}, function (err, docs) {
		console.log(docs);
	});
});
deleteJob.start();



app.get('/freshlist', function (req, res) {
	console.log("I received a GET request");

	db.freshlist.find(function (err, docs) {
		//console.log(docs);
		res.json(docs);
	})
});


app.listen(3000);
console.log("Server running on port 3000");

