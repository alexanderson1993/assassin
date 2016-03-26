Meteor.publish('game', function(){
	return Game.find();
});
Meteor.publish('interaction', function(){
	return Interaction.find({user_id:this.userId});
});
Meteor.publish('users', function(){
	return Meteor.users.find({}, {fields:{profile:1}});
});
Meteor.publish('chats', function(){
	return ChatMessage.find();
});
// Publish the current user's player, if you can find out the user's id.
// Also publishes insecure info about all players and users;
Meteor.publish(null, function(){
	return [Meteor.users.find({}, {fields:{profile:1, kills:1, killed:1}}), Player.find({}, {fields:{target:0, secret_code:0}}), Interaction.find({}, {fields:{user_id:1, game_id:1}})];
});
Meteor.publish('myPlayer', function(){
	return Player.find({user_id:this.userId});
});
