var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var keys = require('./keys.js');

var action = process.argv[2].toLowerCase();
var userInput = process.argv[3].toLowerCase();

// Authorize twitter
var client = new Twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
});

// set screen_name and tweet limit parameters
var params = { screen_name: 'toby_cart', count: 20 };

// define function to retrieve tweets
function myTweets() {
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            // var tweets = JSON.stringify(tweets, null, 2);
            // console.log(tweets);

            // log appropriate tweet text and creation time for each available tweet
            for (var i = 0; i < tweets.length; i++) {
                var tweetText = tweets[i].text;
                var tweetTime = tweets[i].created_at;

                console.log('You tweeted "' + tweetText + '" on ' + tweetTime);
                console.log('');
            }
        } else {
            console.log(error);
        }
    });
};

var spotify = new Spotify({
    id: keys.spotifyKeys.id,
    secret: keys.spotifyKeys.secret
});

function spotifyThisSong() {
    spotify.search({ type: 'track', query: userInput, limit: 3 })
        .then(function (response) {
            var songs = response.tracks.items;

            if (response.tracks.total !== 0) {

                for (var i = 0; i < songs.length; i++) {
                    console.log(songs[i].name);
                    console.log('----------------------')
                    console.log('Artists:');
                    var artists = songs[i].artists;
                    for (var j = 0; j < artists.length; j++) {
                        console.log('- ' + artists[j].name);
                    };
                    console.log('Album:');
                    console.log('- ' + songs[i].album.name)
                    if (songs[i].preview_url !== null) {
                        console.log('Preview:');
                        console.log(songs[i].preview_url);
                    }
                    console.log('');
                };
            } else {
                spotifyDefaultSong();
            }

        })
        .catch(function (err) {
            console.log(err);
        });
};

function spotifyDefaultSong() {
    spotify.search({ type: 'track', query: userInput, limit: 3 })
        .then(function (response) {
            var songs = response.tracks.items;

            showSongs(songs);
        })
        .catch(function (err) {
            console.log(err);
        });
};

function showSongs(songs) {

    for (var i = 0; i < songs.length; i++) {
        console.log(songs[i].name);
        console.log('----------------------')
        console.log('Artists:');
        var artists = songs[i].artists;
        for (var j = 0; j < artists.length; j++) {
            console.log('- ' + artists[j].name);
        };
        console.log('Album:');
        console.log('- ' + songs[i].album.name)
        if (songs[i].preview_url !== null) {
            console.log('Preview:');
            console.log(songs[i].preview_url);
        }
        console.log('');
    };
};

function movieThis() {
    var movie = encodeURI(userInput);
    var queryURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=40e9cece";

    request(queryURL, function (error, response, body) {
        if(error) {
            console.log(error);
        };

        var info = JSON.parse(body);
        // console.log(info);
        console.log('Movie: ' + info.Title);
        console.log('--------------------------')
        console.log('Year: ' + info.Year);
        console.log('Rated: ' + info.Rated);
        console.log('Language: ' + info.Language);
        console.log('Country: ' + info.Country);
        console.log('DESCRIPTION:');
        console.log('- ' + info.Plot);
    });
};

// define functions to run based on user input
switch (action) {
    case 'my-tweets':
        myTweets();
        break;
    case 'spotify-this-song':
        spotifyThisSong();
        break;
    case 'movie-this':
        movieThis();
        break;
    default:
        console.log('do-what-it-says');
};

// // Here we construct our URL
// var queryURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=40e9cece";

// request(queryURL, function (error, response, body) {
//     if(error) {
//         console.log(error);
//     };

//     var info = JSON.parse(body);
//     console.log('Movie: ' + info.Title);
//     console.log('Year: ' + info.Year);
//     console.log('Rated: ' + info.Rated);
//     console.log('DESCRIPTION');
//     console.log(info.Plot);
// });