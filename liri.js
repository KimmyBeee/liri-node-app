var fs = require("fs");
var request = require("request");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");

var key = require("./keys.js");

var twitterConKey = key.twitterKeys.consumer_key;
var twitterConSecret = key.twitterKeys.consumer_secret;
var twitterAccTokKey = key.twitterKeys.access_token_key;
var twitterAccTokSecret = key.twitterKeys.access_token_secret;

var spotifyId = key.spotifyKeys.client_id;
var spotifySecret = key.spotifyKeys.client_secret;


var command = process.argv[2];
var mediaInput = process.argv;

var mediaTitle = "";

 for (var m = 3; m < mediaInput.length; m++)	{
 	mediaTitle = mediaTitle + " " + mediaInput[m];
 }

console.log(mediaTitle);

if (command === "my-tweets")  	{
	getTweets()

} else if (command === "spotify-this-song")	{	
	spotifySong()
}
// } else if (command === "movie-this")	{
	// getMovie()
// }
//else if (command === "do-what-it-says")	{

// };

function getTweets()	{
	var client = new Twitter({
  		consumer_key: twitterConKey,
  		consumer_secret: twitterConSecret,
  		access_token_key: twitterAccTokKey,
  		access_token_secret: twitterAccTokSecret
	});
 	
	var params = {screen_name: "KimmyBozman"};

	client.get("statuses/user_timeline", params, function(error, tweets, response) {
  		if (!error) {
  			for (var i = 0; i < 20; i++) 	{
  				console.log("============================================================================");
  				console.log(tweets[i].created_at);
  				console.log(tweets[i].text);

				fs.appendFile("log.txt", "***\n" + tweets[i].text + "\n", function(error)	{
    				if (error)	{
    				console.log(error)
  					}	
    			});
    		}
    	}
	});	
}

function spotifySong()	{
	var spotify = new Spotify({
  		id: spotifyId,
  		secret: spotifySecret
	});
 
	spotify.search({type: "track", query: mediaTitle}, function(err, data) {
  		if (err) {
    		return console.log("Error occurred: " + err);
  		}

  		var trackPath = data.tracks.items[0];
  		
  		console.log("*******");
		console.log("The artist of this song is " + trackPath.artists[0].name);
		console.log("The name of this song is " + trackPath.name);
		console.log("Here is a Spotify preview link: " + trackPath.preview_url);
		console.log("The album title is " + trackPath.album.name)
		console.log("*******");
	}); 
	if (mediaTitle === null)	{
		var trackPath = data.tracks.items[5];
  		
  		console.log("*******");
		console.log("The artist of this song is " + trackPath.artists[0].name);
		console.log("The name of this song is " + trackPath.name);
		console.log("Here is a Spotify preview link: " + trackPath.preview_url);
		console.log("The album title is " + trackPath.album.name)
		console.log("*******");
	};
	}
}




