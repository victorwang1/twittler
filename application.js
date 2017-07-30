$(document).ready(function(){
  var $body = $('body');
  $body.html('');

// generate tweet
  var newTweet = function(tweet) {
    var $tweet = $('<section class="tweet"></section>');
    var $time = $('<div class="time"></div>');
    var $userName = $('<span class="username"></span>');
    var now = moment();

    $userName.text('@' + tweet.user);
    $tweet.text($userName.text() + ': ' + tweet.message);
    $time.text(moment(now).fromNow());
    $time.prependTo($tweet);

    return $tweet;
  }

// initialize
  var index = streams.home.length - 1;
  while(index >= 0){
    var tweet = streams.home[index];
    var $tweet = newTweet(tweet);

    $tweet.appendTo($body);

    index -= 1;
  }

// update tweet
  var update = function() {

  }
  var refreshFeed = setInterval(update, 1000);


// events


});
