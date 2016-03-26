Template.kills.helpers({
	kills:function(){
		var output = [];
		var interactions = Interaction.find({user_id:Meteor.userId(), game_id:Session.get('currentGame')});
		interactions.forEach(function(e){
			// I don't know if making this many subscriptions
			// is a good idea, but we'll go for it.
			var player = Player.findOne({_id:e.target_id});
			var user = Meteor.users.findOne({_id:player.user_id});
			output.push({
				image:user.profile.picture,
				name:user.profile.name,
				subtext:'Killed: ' + moment(e.timestamp).format('MMMM DD, YYYY HH:mmA')
			});
		});
		if (output.length <= 0){
			output = [{
				image:'/svg/questionMark.svg',
				name:'No kills.',
				subtext:''
			}];
		}
		return output;
	}
});
