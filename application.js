$(document).ready(function(){
  var $body = $('body');
  $body.html('');


// generate tweet
  var formatTweet = function(tweet) {
    var $tweet = $('<section class="tweet"></section>');
    var $time = $('<div class="time" data-created="' + tweet.created_at + '"></div>');
    var $userName = $('<span class="username"></span>');

    $tweet.text(': ' + tweet.message);
    $userName.text('@' + tweet.user);
    $userName.prependTo($tweet);

    // timestamp
    $time.text(moment(tweet.created_at).fromNow());
    $time.prependTo($tweet);

    return $tweet;
  }


// initialize
  var feedLength = streams.home.length;
  var index = streams.home.length - 1;
  while(index >= 0){
    var tweet = streams.home[index];
    var $tweet = formatTweet(tweet);

    $tweet.appendTo($body);

    index -= 1;
  }


// update tweet
  var updateFeed = function() {
    var newFeedLength = streams.home.length;
    if (newFeedLength > feedLength) {
      for (feedLength; feedLength < newFeedLength; feedLength++) {
        formatTweet(streams.home[feedLength]).prependTo($body);
      }
      feedLength++;
    }
  }

  var updateTime = function() {
    $('.time').each(function(element) {
      var created_at = $(this).data('created');
      console.log(created_at);
      $(this).text(moment(created_at).fromNow());
    });
  }

  var refreshFeed = setInterval(updateFeed, 500);
  var refreshTime = setInterval(updateTime, 10000);


// events
  $('.username').hover(function() {
    $(this).toggleClass('highlight');
  });

});
