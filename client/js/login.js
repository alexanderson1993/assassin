Template.login.events({
	'click #facebook-signin':function(e){
		var redirect = Meteor.absoluteUrl() + 'oauth';
		var clientId = '701840889945868';
		var url = 'https://www.facebook.com/dialog/oauth?client_id=' + clientId + '&response_type=token&redirect_uri=' + redirect;
		e.preventDefault();
		window.location = url;
	}
});

Template.login_desktop.events({
	'click #facebook-signin':function(e){
		var redirect = Meteor.absoluteUrl() + 'oauth?redirect=' + Session.get('previous_url');
		var clientId = '701840889945868';
		var url = 'https://www.facebook.com/dialog/oauth?client_id=' + clientId + '&response_type=token&redirect_uri=' + redirect;
		e.preventDefault();
		window.location = url;
	}
});
