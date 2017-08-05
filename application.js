$(document).ready(function(){
  var $body = $('body');
  $body.html('');
  streams.users.visitor = [];

// format tweet
  var formatTweet = function(tweet) {
    var $tweet = $('<section class="tweet"></section>');
    var $time = $('<div class="time" title="' + tweet.created_at +
                    '" data-created="' + tweet.created_at + '"></div>');
    var $userName = $('<span class="username"></span>');

    $tweet.text(': ' + tweet.message);
    $userName.text('@' + tweet.user);
    $userName.prependTo($tweet);

    $time.text(moment(tweet.created_at).fromNow());
    $time.prependTo($tweet);

    return $tweet;
  }


// initialize home stream
  var initializeHome = function() {
    var index = streams.home.length - 1;
    while(index >= 0){
      var tweet = streams.home[index];
      var $tweet = formatTweet(tweet);
      $tweet.appendTo($body);

      index -= 1;
    }

    var $topSection = $('<section class="top"></section>');
    var $logo = $('<div id="logo">Twittler</div>');
    var $newTweet = $('<div id="newTweet"></div>');
    var $tweetButton = $('<button class="btn tweetButton">Tweet</button>');
    $topSection.prependTo($body);
    $logo.prependTo($topSection);
    $tweetButton.appendTo($newTweet);
    $newTweet.appendTo($topSection);
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
    var $user = $('<section id="name"> @' + userStream[0]['user'] + '</section>');
    var $button = $('<div class="home">Home</div>');
    $user.prependTo($body);
    $button.prependTo($body);
  }


// events
  $(document).on('mouseenter', '.username, .home', function() {
    $(this).toggleClass('highlight');
  });

  $(document).on('mouseenter', '.btn', function() {
    $(this).toggleClass('background-highlight');
  });

  $(document).on('mouseleave', '.username, .home, .btn', function() {
    $(this).removeClass('highlight');
    $(this).removeClass('background-highlight');
  });

  $(document).on('click', '.tweetButton', function(){
    if ($('#tweetForm').length === 0) {
      var $tweetForm = $('<div id="tweetForm">@Visitor<br>' +
                            '<textarea name="tweetText" cols="40" rows="5"></textarea><br>' +
                            '<button class="btn" id="send">send</button>' +
                            '</div>');
      $tweetForm.insertAfter($(this));
      $(this).attr('id', 'toggled');

    } else {
      $('#tweetForm').remove();
      $(this).removeAttr('id');
    }
  });

  // tweet as visitor

  var postTweet = function() {
    var message = $('textarea').val();
    writeTweet(message);
    updateFeed(streams.home);

    $('#tweetForm').remove();
    $('.tweetButton').removeAttr('id');
  }

  $(document).on('click', '#send', function(){
    postTweet();
  });

  $(document).on('keyup', function(key) {
    if(key.which === 13) {
      postTweet();
    }
  });

  // setup user stream
  $(document).on('click', '.username', function() {
    clearInterval(refreshFeed);
    var userStream = streams.users[$(this).text().slice(1)];
    $body.empty();
    initializeUserStream(userStream);
    setUpdates(userStream);
  });

  // re-initialize home stream
  $(document). on('click', '.home', function() {
    clearInterval(refreshFeed);
    $body.empty();
    initializeHome();
    setUpdates(streams.home);
  })
});
