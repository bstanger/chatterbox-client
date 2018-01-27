$(document).ready(function () {
  var app = new makeApp ();

  $('.input-message_btn').on('click', function() {
    var message = $('.input-message').val();
    makeApp.prototype.createMessageObj(message);
  });

  $('.chatroom-dropdown').on('change', function(event) {
    makeApp.prototype.filter(event);
  });
});

var makeApp = function() {
  this.init();
  this.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';
};

makeApp.prototype.init = () => {
  makeApp.prototype.fetch(makeApp.prototype.populateDropDown);
  // setInterval(function () {
  //   makeApp.prototype.fetch.call(this);
  // }, 60000);
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
        this.prototype.renderMessage(item);
      }, makeApp); 
      makeAppContext.chatsByRoom = chatsByRoom;
      if (cb && typeof cb === 'function') {
        cb();
      }   
    }
  });
};

makeApp.prototype.populateDropDown = () => {
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

makeApp.prototype.renderMessage = chat => {
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
  var messageObj = {};
  messageObj.username = decodeURI(window.location.search.split('?username=')[1]);
  messageObj.text = message;
  messageObj.roomname = $('.chatroom-dropdown').val();
  makeApp.prototype.send(messageObj);
};

makeApp.prototype.send = messageObj => {
  var makeAppContext = makeApp;
  $.ajax({
    type: 'POST',
    contentType: 'application/json',
    url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
    data: JSON.stringify(messageObj),
    success: function(response){
      makeAppContext.prototype.renderMessage(messageObj);
    }
  });
};

makeApp.prototype.clearMessages = () => {
  $('#chats').empty();
};

makeApp.prototype.triggerRender = () => {
  let inputChatRoom = $('.new-Chat-Room').val();
  makeApp.prototype.renderRoom(inputChatRoom);
};

makeApp.prototype.renderRoom = (newChatroomName) => {
  let $option = $(`<option value="${newChatroomName}">${newChatroomName}</option>`);
  $('.chatroom-dropdown').append($option);
  $('.new-Chat-Room, .submit-Chat-Room').remove();
  $('.chatroom-dropdown').show();
};

makeApp.prototype.filter = event => {
  let roomName = event.currentTarget.value;
  if (roomName === 'create') {
    $('.chatroom-dropdown').hide();
    var createChatRoom = $('<input class="new-Chat-Room"><button class="submit-Chat-Room">Submit</button>');
    $('.chatroom-dropdown').after(createChatRoom);
    $('.submit-Chat-Room').on('click', makeApp.prototype.triggerRender);

  } else {
    makeApp.prototype.clearMessages();
    let roomMessages = makeApp.chatsByRoom[roomName];
    console.log(roomMessages);
    if (roomMessages) {
      roomMessages.forEach(function(message) {
        makeApp.prototype.renderMessage(message);
      });
    }
  }
};


