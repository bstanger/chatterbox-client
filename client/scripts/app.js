$(document).ready(function () {
  var app = new makeApp ();

  $('.input-message_btn').on('click', function() {
    var message = $('.input-message').val();
    makeApp.prototype.handleSubmit(message);
    // makeApp.prototype.createMessageObj(message);
  });

  $('.chatroom-dropdown').on('change', function(event) {
    let roomName = event.currentTarget.value;
    makeApp.prototype.renderRoom(roomName);
  });
});

var makeApp = function() {
  this.init();
  makeApp.friendsList = [];
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
  var {objectId, username, text} = chat;
  username = _.escape(username);
  text = _.escape(text);
  let $message = $(`<div class="message"></div>`);
  $message.append($(`<h3 class="message_username" data-objId="${objectId}" data-username="${username}">${username}</h3>`));
  $('#chats').prepend($message);
  $('.message_username[data-objId="' + objectId + '"]').after($(`<div class="message_text">${text}</div>`));
  $('.message_username[data-objId="' + objectId + '"]').on('click', function () {
    makeApp.prototype.handleUsernameClick(event);
  });
};

makeApp.prototype.handleUsernameClick = (event) => {
  var userName = (event && $(event.currentTarget).data('username')) || 'username';
  if(makeApp.friendsList.includes(userName)) {
    var indexOfFriend = makeApp.friendsList.indexOf(userName);
    makeApp.friendsList.splice(indexOfFriend, 1);
    $('.message_username[data-username="' + userName + '"]').removeClass("friend");
  } else {
    makeApp.friendsList.push(userName);
    $('.message_username[data-username="' + userName + '"]').addClass("friend");
  }
};

makeApp.prototype.handleSubmit = message => {
  makeApp.prototype.createMessageObj(message);
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
  let newChatroomName = $('.new-Chat-Room').val();
  let $option = $(`<option value="${newChatroomName}">${newChatroomName}</option>`);
  $('.chatroom-dropdown').append($option);
  $('.new-Chat-Room, .submit-Chat-Room').remove();
  $('.chatroom-dropdown').show();
};

makeApp.prototype.renderRoom = (chatroomName) => {
  if (chatroomName === 'create') {
    $('.chatroom-dropdown').hide();
    var createChatRoom = $('<input class="new-Chat-Room"><button class="submit-Chat-Room">Submit</button>');
    $('.chatroom-dropdown').after(createChatRoom);
    $('.submit-Chat-Room').on('click', makeApp.prototype.triggerRender);

  } else {
    makeApp.prototype.clearMessages();
    let roomMessages = makeApp.chatsByRoom[chatroomName];
    if (roomMessages) {
      roomMessages.forEach(function(message) {
        makeApp.prototype.renderMessage(message);
      });
    }
  }
};


