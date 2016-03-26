Template.game.helpers({
	participant:function(){
		var players = Player.find({game_id:Session.get('currentGame')});
		var output = [];
		players.forEach(function(e){
			var obj = Meteor.users.findOne({_id:e.user_id}).profile;
			obj.dead = e.dead;
			obj._id = e.user_id;
			obj.kills = Interaction.find({user_id:e.user_id, game_id:Session.get('currentGame')}).count();
			output.push(obj);
		});
		return output;
	},
	started:function(){
		return moment().isAfter(moment(this.startdate));
	},
	participantCount:function(){
		return Player.find({game_id:Session.get('currentGame')}).count();
	},
	deadCount:function(){
		return Player.find({game_id:Session.get('currentGame'), dead:true}).count();
	},
	date:function(){
		return moment(this.startdate).format('MMM Do YYYY hh:mma');
	}
});

Template.game_desktop.helpers({
	participant:function(){
		var players = Player.find({game_id:Session.get('currentGame')});
		var output = [];
		players.forEach(function(e){
			var obj = Meteor.users.findOne({_id:e.user_id}).profile;
			obj.dead = e.dead;
			obj._id = e.user_id;
			obj.kills = Interaction.find({user_id:e.user_id, game_id:Session.get('currentGame')}).count();
			output.push(obj);
		});
		return output;
	},
	started:function(){
		return moment().isAfter(moment(this.startdate));
	},
	participantCount:function(){
		return Player.find({game_id:Session.get('currentGame')}).count();
	},
	deadCount:function(){
		return Player.find({game_id:Session.get('currentGame'), dead:true}).count();
	},
	date:function(){
		return moment(this.startdate).format('MMM Do YYYY hh:mma');
	}
});
