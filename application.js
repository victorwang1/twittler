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
  var initializeHome = function() {
    var index = streams.home.length - 1;
    while(index >= 0){
      var tweet = streams.home[index];
      var $tweet = formatTweet(tweet);
      $tweet.appendTo($body);

      index -= 1;
    }
  }
  initializeHome();


// update tweet
  var updateFeed = function() {
    var feedLength = $('.tweet').length;
    var newFeedLength = streams.home.length;

    if (newFeedLength > feedLength) {
      for (feedLength; feedLength < newFeedLength; feedLength++) {
        formatTweet(streams.home[feedLength]).prependTo($body);
      }
    }
  }

  var updateTime = function() {
    $('.time').each(function(element) {
      var created_at = $(this).data('created');
      $(this).text(moment(created_at).fromNow()); //deprecated
    });
  }

  var setUpdates = function() {
    refreshFeed = setInterval(updateFeed, 1000);
    refreshTime = setInterval(updateTime, 10000);
  };

  setUpdates();


// generate user page
  var initializeUserStream = function(userStream) {
    for (var tweet of userStream) {
      formatTweet(tweet).prependTo($body);
    }

    var $user = $('<section id="name"> @' + userStream[0]['user'] + '</section>')
    $user.prependTo($body);

    var $button = $('<div class="home">Home</div>');
    $button.prependTo($body);
  }


// events

  $('.username').hover(function() {
    $(this).toggleClass('highlight');
  });

  // setup user stream
  $(document).on('click', '.username', function() {
    clearInterval(refreshFeed);
    clearInterval(refreshTime);
    var userStream = streams.users[$(this).text().slice(1)];
    feedLength = userStream.length;

    $body.empty();
    initializeUserStream(userStream);

  });

  $(document). on('click', '.home', function() {
    feedLength = streams.home.length;
    $body.empty();
    initializeHome();
    setUpdates();
  })
});
