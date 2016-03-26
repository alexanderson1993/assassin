Template.gameOver.helpers({
	gameWinner:function(){
		var game = Game.findOne({_id:Session.get('currentGame')});
		if (game){
			if (game.winner){
				return Meteor.users.findOne({_id:game.winner}).profile;
			}
		}
	}
});
