var events = {
	'click .assassinate':function(){
		var gameId = Session.get('currentGame');
		var secretCode = Template.instance().find('#code').value;
		Meteor.call('assassinate', gameId, secretCode, function(err){
			if (err){
				IonPopup.alert({
					title:'Error',
					template:err.reason,
					okText:'Okay'
				});
				Template.instance().find('#code').value = '';
				return false;
			}
			// Assume that the UI will update properly with the
			// Changes to the database
		});
	}
};
var helpers = {
	target:function(){
		var target;
		var player = Player.findOne({user_id:Meteor.userId(), game_id:Session.get('currentGame')});
		if (player){
			target = Player.findOne({_id:player.target});
			if (target){
				return Meteor.users.findOne({_id:target.user_id}).profile;
			}
		}
		return {
			picture:'/svg/questionMark.svg',
			firstname:'Unknown',
			unknown:true
		};
	}
};
Template.target.helpers(helpers);
Template.target.events(events);
Template.target_desktop.helpers(helpers);
Template.target_desktop.events(events);
