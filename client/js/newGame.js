Template.donation_desktop.events({
	'click .paid':function(){
		Session.set('donated', true);
		// Make a way to track if a user has donated or not
	},
	'click .foFree':function(){
		Session.set('donated', true);
	}
});

Template.newGame.rendered = function(){
	$('.datepicker').datepicker();
};
Template.newGame.events({
	'click .createGame':function(e, t){
		var obj = {
			name:t.find('[name="name"]').value,
			description:t.find('[name="description"]').value,
			startdate:moment(t.find('[name="startdate"]').value).toDate()
		};
		Meteor.call('createGame', obj, function(err, res){
			if (err){
				sAlert.error(err);
				return false;
			}
			sAlert.success('Congratulations! You have successfully created and joined this game! Share the link with your friends so you can play together!');
			Session.set('currentGame', res);
			Router.go('/game');
		});
	}
});
