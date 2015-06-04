(function(){
  'use strict';

  var username = localStorage.getItem('username') || '';

  var url = 'http://tiny-lasagna-server.herokuapp.com/collections/matt-messages/';

  $(document).ready(function(){
    $('body').prepend(JST['application']());

    route();

    $(document).on('submit', '.login-form', function(e) {
	  	e.preventDefault();
	  	window.location.hash = '/chat';
	  	if (validate($(this).find('.login-form-username').val())) {
	  		username = ($(this).find('.login-form-username').val());
	  		storeUsername(username);
	  	} else {
	  		console.log("Quit hacking me.");
	  	}
	});

	$(document).on('click', '.submit', function(e) {
		e.preventDefault();
		if (validate($('.message-input-content').val())) {
			var message = $('.message-input-content').val();
			submitMessage(message);
			renderChat();
		} else {
			console.log("Quit hacking me.");
		}
	})

	$(window).on('hashchange', function(e) {
		route();
	});

	$(document).on('keypress', '.message-input-content', function(e) {
		var code = e.keyCode;
		if (code === '13') {
			if (validate($('.message-input-content').val())) {
			var message = $('.message-input-content').val();
			submitMessage(message);
			renderChat();
		} else {
			console.log("Quit hacking me.");
		}
		}
	})

  });

  function validate(input) {
  	if (input.indexOf('<script>') !== -1) {
  		return false;
  	} else {
  		return true;
  	}
  }

  window.setInterval(renderMessages, 30000);

  function updateMessages() {
  	renderChat();
  }

  function storeUsername(username) {
  	window.localStorage.setItem('username', username);
  }

  function route() {
  	switch(window.location.hash) {
    	case '': 
    		renderLogin();    		
    		break;
    	case '#/chat':
    		renderChat();
    		break;  		
    }
  }

  function renderLogin() {
  	$('.application').html(JST['login']());
  	console.log('login');
  }

  function renderChat() {
  	$.ajax({
  		url: url,
  		type: 'GET',
  	}).then(function(data) {
  		console.log(data);
  		$('.application').html(JST['chat'](data));	
  		renderMessages(data);
  	});
  }

  function renderMessages() {
  	$.ajax({
  		url: url,
  		type: 'GET',
  	}).then(function(data) {
  		$('.messages-container').html(JST['messages'](sortMessages(data)));  	
  	});
  }

  function sortMessages(data) {
  	return data.reverse();
  }

  function submitMessage(message) {
  	while (message === '') {
  		message = prompt("Please enter a message this time:");
  	}
  	$.ajax({
  		url: url,
  		type: 'POST',
  		data: {
  			'username': username,
  			'body': message,
  			'created_at': currentTime()
  		}
  	});
  }

  function currentTime() {
  	var myTime = new Date();
  	var timeArray = [];
  	timeArray.push(myTime.getHours());
  	if (timeArray[0] > 12) {
  		timeArray[0] = toStandardHours(timeArray[0]);
  	}
  	timeArray.push(myTime.getMinutes());
  	if(timeArray[1] < 10) {
  		timeArray[1] = '0' + timeArray[1];
  	}
  	myTime = timeArray.join(':');
  	return myTime;
  }

  function toStandardHours(time) {
  	return time - 12;
  }

})();
