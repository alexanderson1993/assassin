Template.navbar.created = function(){
	if (Meteor.userId()){
		Meteor.subscribe('game');
	}
};
Template.navbar.helpers({
	loggedIn:function(){
		return Meteor.userId();
	},
	games:function(){
		var gameList = [];
		Player.find({user_id:Meteor.userId()}).forEach(function(e){
			gameList.push(e.game_id);
		});
		return Game.find({_id:{$in:gameList}});
	}
});

Template.navbar.events({
	'click .game':function(){
		Session.set('currentGame', this._id);
		Router.go('/game');
	}
});
