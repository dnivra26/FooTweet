var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , Twit = require('twit')
  , io = require('socket.io').listen(server);
server.listen(4040);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/node-twitter-stream.html');
});

// Tell Node to serve the CSS file when requested
app.get('/node-twitter-stream.css', function (req, res) {
  res.sendfile(__dirname + '/node-twitter-stream.css');
});

var watchList = ['FifaWorldCup'];

var T = new Twit({
consumer_key:             'qkh49WhF3EeCU1wpmrpK8A'
  , consumer_secret:      'bsbbMhfHcc5dqBHGfVPlHydpBAdknlVUi7b22w83T8w'
  , access_token:         '97889597-Gla7PbA79yxoMzvECUl9FKe18fWh6L9pEGOT61n3B'
  , access_token_secret:  '7jx3eQDHPNM6FMvrDY7b4BOsYLX9FnxJF3i8d2eflChnY'
});

io.sockets.on('connection', function (socket) {
  var stream = T.stream('statuses/filter', { track: watchList })

stream.on('tweet', function (tweet) {

 var turl = tweet.text.match( /(http|https|ftp):\/\/[^\s]*/i )
    if ( turl != null ) {
      turl = tweet.text.replace( turl[0], '<a href="'+turl[0]+'" target="new">'+turl[0]+'</a>' );
    } else {
      turl = tweet.text;
    }
    var mediaUrl;
    // Does the Tweet have an image attached?
    if ( tweet.entities['media'] ) {
      if ( tweet.entities['media'][0].type == "photo" ) {
        mediaUrl = tweet.entities['media'][0].media_url;
      } else {
        mediaUrl = null;
      }
    }
    // Send the Tweet to the browser
    io.sockets.emit('stream',turl, tweet.user.screen_name, tweet.user.profile_image_url, mediaUrl);
  });
});


