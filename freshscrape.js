var request = require("request"),
	cheerio = require("cheerio"),
	url = "https://www.reddit.com/r/hiphopheads/";
	
var songs = [];

request(url, function (error, response, html) {
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(html);
    $('div.thing').each(function(i, element){

      	var span = $(this).find('span.domain');
      	var a = span.prev();
      	var title = a.text();
      	if (check_fresh(title)) {
      		var comments = $(this).find('li.first a');
      		
		
      		
      		var link = a.attr('href');
		
      		var commentammount = parseInt(comments.text()) || 0;
      		var postlink = comments.attr('href');
		
      		console.log(title + ": " + link  + "   postlink:   " + postlink + " has this many comments: "  + commentammount);
      	}
    });
  }
});


function check_fresh(title) {
	searchstring = "[fresh";
	return title.toLowerCase().indexOf(searchstring)>=0;
}


//Example:
//"title" : "Xzibit × B-Real × Demrick (Serial Killers) - \"Hang \"Em High\"",
//	"songlink" : "https://soundcloud.com/b-real-12/b-real-x-xzibit-x-demrick-serial-killers-hang-em-high-prod-by-tha-bizness",
//	"score" : "22",
//	"date" : "10-23-15",
//	"comments" : "5",
//	"postlink" : "https://www.reddit.com/r/hiphopheads/comments/3q1znk/fresh_xzibit_breal_demrick_serial_killers_hang_em/"


