$(document).ready(function(){
  var $body = $('body');
  $body.html('');

// format tweet
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
  var updateFeed = function(source) {
    var feedLength = $('.tweet').length;
    var newFeedLength = source.length;

    if (newFeedLength > feedLength) {
      for (feedLength; feedLength < newFeedLength; feedLength++) {
        formatTweet(source[feedLength]).insertBefore($('.tweet')[0]);
      }
    }
  }

  var updateTime = function() {
    $('.time').each(function(element) {
      var created_at = $(this).data('created');
      $(this).text(moment(created_at).fromNow()); //deprecated
    });
  }

  var setUpdates = function(feedSource) {
    refreshFeed = setInterval(function() {updateFeed(feedSource);}, 1000);
    refreshTime = setInterval(updateTime, 10000);
  };

  setUpdates(streams.home);


// generate user page
  var initializeUserStream = function(userStream) {
    for (var tweet of userStream) {
      formatTweet(tweet).prependTo($body);
    }

    var $user = $('<section id="name"> @' + userStream[0]['user'] + '</section>')
    var $button = $('<div class="home">Home</div>');
    $user.prependTo($body);
    $button.prependTo($body);
  }


// events
  $('.username').hover(function() {
    $(this).toggleClass('highlight');
  });

  // setup user stream
  $(document).on('click', '.username', function() {
    clearInterval(refreshFeed);

    var userStream = streams.users[$(this).text().slice(1)];
    feedLength = userStream.length;

    $body.empty();
    initializeUserStream(userStream);
    setUpdates(userStream);
  });

  $(document). on('click', '.home', function() {
    feedLength = streams.home.length;
    $body.empty();
    initializeHome();
    setUpdates();
  })
});
