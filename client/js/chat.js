Template.chat.events({
	'click .send':function(e, t){
		var message = t.find('#messageContent').value;
		Meteor.call('addMessage', message, Session.get('currentGame'), function(err, res){
			t.find('#messageContent').value = '';
		});
	}
});

Template.chat.helpers({
	messages:function(){
		return ChatMessage.find({game_id:Session.get('currentGame')});
	},
	name:function(){
		var user = Meteor.users.findOne({_id:this.user_id});
		if (user){
			return user.profile.name;
		}
	},
	picture:function(){
		var user = Meteor.users.findOne({_id:this.user_id});
		if (user){
			return user.profile.picture;
		}
	},
	timestamp:function(){
		return moment(this.timestamp).format('ddd MMM Do hh:mma');
	}
});
