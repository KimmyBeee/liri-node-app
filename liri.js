var fs = require("fs");
var request = require("request");
var twitter = require("twitter");
var spotify = require("node-spotify-api");

var twitterKeys = require("./keys.js");

var twitterConKey = twitterKeys.consumer_key;
var twitterConSecret = twitterKeys.consumer_secret;
var twitterAccTokKey = twitterKeys.access_token_key;
var twitterAccTokSecret = twitterKeys.access_token_secret;

var spotifyKeys = require("./keys.js");

var spotifyID = spotifyKeys.client_id;
var spotifySecret= spotifyKeys.client_secret;

var command = process.argv[2];
var mediaInput = process.argv[3];

if (command === "my-tweets") 	{
	
}