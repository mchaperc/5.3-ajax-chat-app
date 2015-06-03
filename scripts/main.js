(function(){
  'use strict';

  var username = '';

  $(document).ready(function(){
    $('body').prepend(JST['application']());

    route();

    $(document).on('submit', '.login-form', function(e) {
	  	e.preventDefault();
	  	window.location.hash = '/chat';
	  	username = ($(this).find('.login-form-username').val());
	})

	$(window).on('hashchange', function(e) {
		route();
	})

  });

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
	$('.application').html(JST['chat']());  	
	console.log(username);
  }

})();
