var events = {
	'click .join':function(e, t){
		var entry = t.find('#code').value;
		var game = Game.findOne({slug:entry});
		if (game){
			// Create The player and join the game.
			Meteor.call('joinGame', game._id, function(err, result){
				if (err){
					IonPopup.alert({
						title:'Error',
						template:err,
						okText:'Woo Hoo!'
					});
					t.find('#code').value = '';
					return false;
				}
				Session.set('currentGame', game._id);
				Router.go('/profile');
				IonPopup.alert({
					title:'Success!',
					template:'Congratulations! You have successfully joined this game!',
					okText:'Woo Hoo!'
				});
			});
		} else {
			// Invalid slug
			IonPopup.alert({
				title:'Invalid Code',
				template:'The secret code you entered does not correspond to any active games. ' +
				'Double check your capitalization and spelling.',
				okText:'Got It.'
			});
			t.find('#code').value = '';
		}
	}
}

Template.joinGame.events(events);
