var request = require("request"),
	cheerio = require("cheerio"),
	url = "https://www.reddit.com/r/hiphopheads/";
	
var songs = [];

request(url, function (error, response, html) {
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(html);
    $('div.thing').each(function(i, element){
      var span = $(this).find('span.domain');
      var link = span.prev().attr('href');
      console.log(link);
    });
  }
});

