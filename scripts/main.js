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
	  	username = ($(this).find('.login-form-username').val());
	  	storeUsername(username);
	});

	$(document).on('click', '.submit', function(e) {
		e.preventDefault();
		var message = $('.message-input-content').val();
		submitMessage(message);
		renderChat();
	})

	$(window).on('hashchange', function(e) {
		route();
	});

  });

  window.setInterval(updateMessages, 5000);

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
  	});
	console.log(username);
  }

  function submitMessage(message) {
  	console.log(message);
  	console.log(username);
  	$.ajax({
  		url: url,
  		type: 'POST',
  		data: {
  			'username': username,
  			'body': message,
  			'created_at': currentTime()
  		}
  	}).then(function(data) {
  		console.log(data);
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
  	myTime = timeArray.join(':');
  	return myTime;
  }

  function toStandardHours(time) {
  	return time - 12;
  }

})();
