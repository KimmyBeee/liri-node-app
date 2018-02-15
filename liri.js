//Set up variables to use fs, request, Twitter and Spotify node packages
var fs = require("fs");
var request = require("request");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");

//Link this module to keys.js so that information is available but made secure
var key = require("./keys.js");

//Hold Twitter, Spotify and OMDB keys in variables for security
var twitterConKey = key.twitterKeys.consumer_key;
var twitterConSecret = key.twitterKeys.consumer_secret;
var twitterAccTokKey = key.twitterKeys.access_token_key;
var twitterAccTokSecret = key.twitterKeys.access_token_secret;

var spotifyId = key.spotifyKeys.client_id;
var spotifySecret = key.spotifyKeys.client_secret;

var omdbApiKey = key.movieKey.api_key;

//Grab user inputs from the CLI to be used as commands and media info and..
var command = process.argv[2];
var mediaInput = process.argv;

//...set up multi-word input to act as a single title for songs and movies
var mediaTitle = "";

for (var m = 3; m < mediaInput.length; m++)	{
 	mediaTitle = mediaTitle + " " + mediaInput[m];
}

//Set conditions to trigger different functions for each command and...
if (command === "my-tweets")  	{
	//..log each command when used in a prettified way to the log file
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
	fs.appendFile("log.txt", "\n========Do-What-It-Says=======", function(error)	{
    	if (error)	{
    		console.log(error)
  		}
  	});	
	thatWay();
};

//This function grab 20 tweets from a Twitter account and posts them in the CLI
function getTweets()	{
	//Necessary keys to access the Twitter api via the npm package. They are stashed in variables for security.
	var client = new Twitter({
  		consumer_key: twitterConKey,
  		consumer_secret: twitterConSecret,
  		access_token_key: twitterAccTokKey,
  		access_token_secret: twitterAccTokSecret
	});

 	//Set the account from which the Tweets are taken
	var params = {screen_name: "KimmyBozman"};

	//Call Twitter and get the actual Tweets...
	client.get("statuses/user_timeline", params, function(error, tweets, response) {
  		if (!error) {
  			for (var i = 0; i < 20; i++) 	{
  				//...then log them to the CLI...
  				console.log("============================================================================");
  				console.log(tweets[i].created_at);
  				console.log(tweets[i].text);
  				//..then log the Tweets into the log file
				fs.appendFile("log.txt", "\n***\n" + tweets[i].text, function(error)	{
    				if (error)	{
    				console.log(error)
  					}	
    			});
    		}
    	}
	});	
}

//This function will pull a requested song from Spotify and tell you information about it
function spotifySong()	{
	//Spotify keys protected by variable use
	var spotify = new Spotify({
  		id: spotifyId,
  		secret: spotifySecret
	});

	//If there is no song entered to search after the command input, the function will automatically give you "Hunting High and Low" by Aha (get it? :)
	if (mediaTitle === "")	{
		mediaTitle = "hunting high and low";
	}

	//Call Spotify and get the closest match to the requested song information
	spotify.search({type: "track", query: mediaTitle, limit: 1}, function(err, data) {
  		if (err) {
    		return console.log("Error occurred: " + err);
  		}

  		//Variable to simplify the console logs by representing most of the path to the requested info
  		var trackPath = data.tracks.items[0];
  		//Log info to console
  		console.log("*******");
		console.log("The artist of this song is " + trackPath.artists[0].name);
		console.log("The name of this song is " + trackPath.name);
		console.log("Here is a Spotify preview link: " + trackPath.preview_url);
		console.log("The album title is " + trackPath.album.name)
		console.log("*******");
		//Write requested info to log file
		fs.appendFile("log.txt", "\n***\n" + trackPath.artists[0].name + "\n" + trackPath.name + "\n" + trackPath.preview_url + "\n" + trackPath.album.name, function(error)	{
    		if (error)	{
    		console.log(error)
  			}	
    	});	
	}); 		
}

//When called upon, this gets information from OMDB for a requested movie
function getMovie()	{

	//Rename a global variable to help me keep track of it in this particular function
	var movieTitle = mediaTitle;

	//Set up default movie title to send into OMDB if no movie titel is entered (...one of my faves)
	if (movieTitle === "")	{
		movieTitle = "kung fu hustle";
	}

	//Call to OMDB database for movie info
	request("http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&" + omdbApiKey, function(error, response, body) {
		//Only return a response if there is no error, the response goes fully through and listing in the database is considered complete
		if (!error && response.statusCode === 200 && JSON.parse(body).Response === "True")	{
			//Log info to console
			console.log("This movie's title is " + JSON.parse(body).Title);
			console.log("It was released in " + JSON.parse(body).Year);
			console.log("The movie's IMDB rating is " + JSON.parse(body).imdbRating);
			//If there is no Rotton Tomatoes rating, skip it
			if (JSON.parse(body).Ratings[1])	{
				console.log("The Rotten Tomatoes rating is " + JSON.parse(body).Ratings[1].Value);
			}
			console.log("It was produced in " + JSON.parse(body).Country);
			console.log("The original release language was " + JSON.parse(body).Language);
			console.log("The plot of this movie goes something like this: " + JSON.parse(body).Plot);
			console.log("This film stars " + JSON.parse(body).Actors);
			//Write the movie info in the log file
			fs.appendFile("log.txt", "\n***\n" + JSON.parse(body).Title + "\n" + JSON.parse(body).Year + "\n" + JSON.parse(body).imdbRating + "\n" + (response.Response === "True" ? JSON.parse(body).Ratings[1].Value : "") + JSON.parse(body).Country + "\n" + JSON.parse(body).Language + "\n" + JSON.parse(body).Plot + "\n" + JSON.parse(body).Actors, function(error)	{
    			if (error)	{
    			console.log(error)
  				}	
    		});	
    	//If the movie can not be found, say so in the console
    	} else {
    		console.log("Movie not found.");
    	}
	});
}

//This function is called by the command "do-what-it-says"
function thatWay()	{
	//Read what is written on the random.txt file
	fs.readFile("./random.txt", "utf8", function read(error, data) {
    	if (error) {
        console.log(error);
    	}

	//Store that info in a variable for handling after spliting the string at the comma into two different stirng elements
	var info = data.split(",");

	//Redefine the global variable for media input as the second string in the data array which is "I Want It That Way" 
	mediaTitle = info[1];
	
	//Run the spotify function with the newly defined input
	spotifySong();
	});
}




