$(document).ready(function () {
  var app = new makeApp ();

  $('.input-message_btn').on('click', function() {
    var message = $('.input-message').val();
    makeApp.prototype.send(message);
  });

});

var makeApp = function() {
  this.init();
  this.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';
};

makeApp.prototype.init = function() {
  this.fetch();
  setInterval(function () {
    makeApp.prototype.fetch.call(this);
  }, 60000);
};

makeApp.prototype.fetch = function () {
  var allChats;
  $.ajax({
    type: "GET",
    url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
    success: function (response) {
      allChats = response.results;
      _.each(allChats, function (item) {
        this.prototype.displayChat(item);
      }, makeApp);    
    }
  });
};

makeApp.prototype.displayChat = chat => {
  console.log(chat);
  var {username, text} = chat;
  username = validator.escape("" + username);
  text = validator.escape("" + text);
  let $message = $(`<div class ="message"></div>`);
  $message.append($(`<h3 class="message_username">${username}</h3>`));
  $('.message_username').append($(`<div class="message_text">${text}</div>`));
  $('#chats').prepend($message);
};

makeApp.prototype.send = message => {
  var dataObj = {};
  // message = validator.escape(message);
  dataObj.username = '';
  dataObj.text = message;
  dataObj.roomname = '';
  $.ajax({
    type: 'POST',
    contentType: 'application/json',
    url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
    data: JSON.stringify(dataObj),
    success: function(response){
      console.log("Success!");
    }
  });
};





