Template._gameList.helpers({
	games:function(){
		var gameList = [];
		Player.find({user_id:Meteor.userId()}).forEach(function(e){
			gameList.push(e.game_id);
		});
		return Game.find({_id:{$in:gameList}});
	}
});

Template._gameList.events({
	'click .game':function(){
		Session.set('currentGame', this._id);
		IonModal.close('_gameList');
	}
});
