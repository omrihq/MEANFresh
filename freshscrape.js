

/*
Scraping:
http://www.smashingmagazine.com/2015/04/web-scraping-with-nodejs/

modularizing: 
http://www.sitepoint.com/understanding-module-exports-exports-node-js/

*/

/*
This is where I experienced the most cognitive dissonance. 
Because I've done so much Python web-scraping, it was hard for me to not be "pythonic",
and work variable assignments iteratively. The anonymous nested functions here were hard to grasp
at first, especially once I had to implement the callbacks. Understanding the nested function calls
and eventually understanding the callback of songs vs. returning the songs was the most
intellectually redeeming aspect of this project. 

The module exporting was also great. I was about to throw this function into my server but was 
adamant on finding a way to call it as a module, and eventually stumbled on module.exports. 
*/
module.exports = {
	scrape: function(callback) {
		var request = require("request"), 
		cheerio = require("cheerio")
	
		var songs = [];
		url = "https://www.reddit.com/r/hiphopheads/";
		request(url, function (error, response, html) {
		  if (!error && response.statusCode == 200) {
		    var $ = cheerio.load(html);
		    $('div.thing').each(function(i, element){
		
		      	var span = $(this).find('span.domain');
		      	var a = span.prev();
		      	var title = a.text();
		      	if (title != "" && check_fresh(title)) {
		      		var comments = $(this).find('li.first a');
		      		
		      		
		      		var link = a.attr('href');
					
		      		var commentammount = parseInt(comments.text()) || 0;
		      		var postlink = comments.attr('href');
					title = cut_fresh(title);
		
					var scorediv = $(this).find('div.midcol');
					var score = parseInt(scorediv.find('div.unvoted').text()) || 0;
		
					var rawdate = $(this).find('time').attr('datetime');
					//REGEX FOR DATE: ([a-z]){3}\s([a-z]){3}\s([0-9][0-9])
					//var date = rawdate.match(/([a-z]){3}\s([a-z]){3}\s([0-9][0-9])/ig)[0];
					
					//var expireAt = new Date();
					//expireAt.setMinutes(expireAt.getMinutes()+1);

		      		songs.push({
		      			'title': title,
		      			'songlink': link,
		      			'score': score,
		      			'date' : rawdate,
		      			'comments' : commentammount,
		      			'postlink' : postlink,
		      		});
		      	}
		    });
		    callback(songs);
		  }
		}); 
	}
}


function check_fresh(title) {
	searchstring = "[fresh";
	return title.toLowerCase().indexOf(searchstring)>=0;
}


function cut_fresh(title) {
	title = title.replace(/(\[fresh)(.*)(\])/i, '');
	return title;
}



