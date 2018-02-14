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

var omdbApi = key.movieKey.api_key;


var command = process.argv[2];
var mediaInput = process.argv;

var mediaTitle = "";

 for (var m = 3; m < mediaInput.length; m++)	{
 	mediaTitle = mediaTitle + " " + mediaInput[m];
 }

console.log(mediaTitle);

if (command === "my-tweets")  	{
	fs.appendFile("log.txt", "\n========My-Tweets=======", function(error)	{
    	if (error)	{
    		console.log(error)
  		}
  	});	
	getTweets()

} else if (command === "spotify-this-song")	{
	fs.appendFile("log.txt", "\n=======Spotify-This-Song=======", function(error)	{
    	if (error)	{
    		console.log(error)
  		}
  	});		
	spotifySong()

} else if (command === "movie-this")	{
	fs.appendFile("log.txt", "\n========Movie-This=======", function(error)	{
    	if (error)	{
    		console.log(error)
  		}
  	});	
	getMovie()

} else if (command === "do-what-it-says")	{

};

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

				fs.appendFile("log.txt", "\n***\n" + tweets[i].text, function(error)	{
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

	var index = 0;

	if (mediaTitle === "")	{
		mediaTitle = "the sign";
	}

	spotify.search({type: "track", query: mediaTitle, limit: 1}, function(err, data) {
  		if (err) {
    		return console.log("Error occurred: " + err);
  		}
  		console.log(data);
  		var trackPath = data.tracks.items[0];
  		
  		console.log("*******");
		console.log("The artist of this song is " + trackPath.artists[0].name);
		console.log("The name of this song is " + trackPath.name);
		console.log("Here is a Spotify preview link: " + trackPath.preview_url);
		console.log("The album title is " + trackPath.album.name)
		console.log("*******");
		
		fs.appendFile("log.txt", "\n***\n" + trackPath.artists[0].name + "\n" + trackPath.name + "\n" + trackPath.preview_url + "\n" + trackPath.album.name, function(error)	{
    		if (error)	{
    		console.log(error)
  			}	
    	});	
	}); 		
}


function getMovie()	{
	var movieTitle = mediaTitle;

	request("http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=40e9cece", function(error, response, body) {
		if (!error && response.statusCode === 200)	{
			// console.log(JSON.parse(response.body));
			console.log("This movie's title is " + JSON.parse(body).Title);
			console.log("It was released in " + JSON.parse(body).Year);
			console.log("The movie's IMDB rating is " + JSON.parse(body).imdbRating);
			console.log("The Rotten Tomatoes rating is " + JSON.parse(body).Ratings[1].Value);
			console.log("It was produced in " + JSON.parse(body).Country);
			console.log("The original release language was " + JSON.parse(body).Language);
			console.log("The plot of this movie goes something like this: " + JSON.parse(body).Plot);
			console.log("This film stars " + JSON.parse(body).Actors);
    	};
		
		fs.appendFile("log.txt", "\n***\n" + JSON.parse(body).Title + "\n" + JSON.parse(body).Year + "\n" + JSON.parse(body).imdbRating + "\n" + JSON.parse(body).Ratings[1].Value + "\n" + JSON.parse(body).Country + "\n" + JSON.parse(body).Language + "\n" + JSON.parse(body).Plot + "\n" + JSON.parse(body).Actors, function(error)	{
    		if (error)	{
    		console.log(error)
  			}	
    	});	
	});
}




