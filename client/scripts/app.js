$(document).ready(function () {
  var app = new makeApp ();

  $('.input-message_btn').on('click', function() {
    var message = $('.input-message').val();
    makeApp.prototype.createMessageObj(message);
  });

});

var makeApp = function() {
  this.init();
  this.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';
};

makeApp.prototype.init = () => {
  makeApp.prototype.fetch(makeApp.prototype.populateDropDown);
  setInterval(function () {
    makeApp.prototype.fetch.call(this);
  }, 60000);
};

makeApp.prototype.fetch = cb => {
  var allChats;
  var chatsByRoom = {};
  var makeAppContext = makeApp;
  $.ajax({
    type: "GET",
    url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
    success: function (response) {
      allChats = response.results;
      _.each(allChats, function (item) {
        var roomname = item.roomname;
        var roomObj = {};
        if (chatsByRoom[roomname]) {
          chatsByRoom[roomname].push(item);
        } else {
          chatsByRoom[roomname] = [item];
        }
        this.prototype.displayChat(item);
      }, makeApp); 
      makeAppContext.chatsByRoom = chatsByRoom;
      if (cb && typeof cb === 'function') {
        cb();
      }   
    }
  });
};

makeApp.prototype.populateDropDown = () => {
  console.log('test');
  for (var key in makeApp.chatsByRoom) {
    var numberChatsInRoom = makeApp.chatsByRoom[key].length;
    if (numberChatsInRoom > 4) {
      if (key !== ""){
        let $option = $(`<option value="${key}">${key}</option>`);
        $('.chatroom-dropdown').append($option);
      }
    }
  }
};

makeApp.prototype.displayChat = chat => {
  console.log(chat);
  var {username, text} = chat;
  username = _.escape(username);
  text = _.escape(text);
  let $message = $(`<div class ="message"></div>`);
  $message.append($(`<h3 class="message_username">${username}</h3>`));
  $('.message_username').append($(`<div class="message_text">${text}</div>`));
  $('#chats').prepend($message);
};

makeApp.prototype.createMessageObj = message => {
  var dataObj = {};
  dataObj.username = decodeURI(window.location.search.split('?username=')[1]);
  dataObj.text = message;
  dataObj.roomname = '';
  this.send(messageObj);
};

makeApp.prototype.send = messageObj => {
  $.ajax({
    type: 'POST',
    contentType: 'application/json',
    url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
    data: JSON.stringify(messageObj),
    success: function(response){
      console.log("Success!");
    }
  });
};





