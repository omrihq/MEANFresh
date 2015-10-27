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
/*
Since I didn't need any intense scheduling, I opted to use a cron job. 
The callback inside of the scrape function was my first dive into async. 
Coming from Python, and the most basic functioning knowledge of JS, basically the 
codecademy equivalent, it was hard to wrap my head around why:
var songs = scraper.scrape(), when scrape only returned songs
and that scraper.scrape() would print the songs, but I couldn't 
access the variable with the export. This lead me to try every permutation
of Stackoverflow answer possible, and eventually led me to a pretty 
functioning knowledge of callbacks (I think). 

This specific function gets the song from the scraper, and then adds
them incrementally to the database. I found the upsert function, and 
basically "update" on the title query.  

*/
var scrapeJob = cron.job("0 * * * * *", function(){

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

/*
Originally, I'd planned to delete and update concurrently, but ultimately figured that
I would not want to delete as often as I add. It would be nice to have an incrementally increasing
list, that eventually caps at 4 days. 
Thus, I use a second cronjob to delete. 
*/
var deleteJob = cron.job("0 0 0 */2 * *",  function() {
	//http://momentjs.com/docs/
	var four = moment().subtract(2, 'days');

	//http://stackoverflow.com/questions/11973304/mongodb-mongoose-querying-at-a-specific-date
	db.freshlist.remove({"date": {$lt : four.toISOString()}}, function (err, docs) {
		console.log(docs);
	});
});
deleteJob.start();


/*
When the controller requests the information through a get request,
I send it back through a json formatted response. 
*/
app.get('/freshlist', function (req, res) {
	console.log("I received a GET request");

	db.freshlist.find(function (err, docs) {
		//console.log(docs);
		res.json(docs);
	})
});


app.listen(3000);
console.log("Server running on port 3000");

