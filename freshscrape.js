

/*
Scraping:
http://www.smashingmagazine.com/2015/04/web-scraping-with-nodejs/

modularizing: 
http://www.sitepoint.com/understanding-module-exports-exports-node-js/

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


//Example:
//"title" : "Xzibit × B-Real × Demrick (Serial Killers) - \"Hang \"Em High\"",
//	"songlink" : "https://soundcloud.com/b-real-12/b-real-x-xzibit-x-demrick-serial-killers-hang-em-high-prod-by-tha-bizness",
//	"score" : "22",
//	"date" : "10-23-15",
//	"comments" : "5",
//	"postlink" : "https://www.reddit.com/r/hiphopheads/comments/3q1znk/fresh_xzibit_breal_demrick_serial_killers_hang_em/"

