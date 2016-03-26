Meteor.methods({
	logoutUsers:function(){
		if (this.userId !== null){
			if (!Roles.userHasRole(this.userId, 'admin')){
				throw new Meteor.Error('not-admin', 'User is not admin; unable to access method');
			}
		}
		Meteor.users.update({}, {$set: { "services.resume.loginTokens" : [] }});
	},
	joinGame:function(gameId){
		var userId = this.userId;
		var player;
		check(gameId, String);
		if (!userId){
			throw new Meteor.Error('user-not-found', 'You must be logged in to play the game');
		}
		player = Player.findOne({user_id:this.userId, game_id:gameId});
		if (player){
			throw new Meteor.Error('player-found', 'You have already joined this game');
		}
		if (!moment(Game.findOne({_id:gameId}).startdate).isAfter(moment())){
			throw new Meteor.Error('game-started', 'This game has already started;' +
				'you cannot join a game which has already begun.');
		}
		return Player.insert({
			user_id:this.userId,
			game_id:gameId,
			target:null,
			secret_code:Meteor.generateCode()
		});
	},
	createGame:function(gameObj){
		var userId = this.userId;
		var gameId;
		if (!userId){
			throw new Meteor.Error('user-not-found', 'You must be logged in to create a game');
		}
		check(gameObj.name, String);
		check(gameObj.description, String);
		check(gameObj.startdate, Date);
		gameId = Game.insert(gameObj);
		// Add the user to the game
		Player.insert({
			user_id:userId,
			game_id:gameId,
			target:null,
			secret_code:Meteor.generateCode()
		});
		return gameId;
	},
	assassinate:function(gameId, secretCode){
		var userId = this.userId;
		var player;
		var target;
		check(gameId, String);
		check(secretCode, String);
		if (!userId){
			throw new Meteor.Error('user-not-found', 'You must be logged in to play the game');
		}
		player = Player.findOne({game_id:gameId, user_id:userId});
		if (!player){
			throw new Meteor.Error('player-not-found', 'Player object not found');
		}
		// Check the target
		if (!player.target){
			throw new Meteor.Error('player-no-target', 'Player does not have a valid target');
		}
		target = Player.findOne({_id:player.target});
		if (target.secret_code !== secretCode){
			throw new Meteor.Error('incorrect-code', 'Incorrect Secret Code');
		}
		// Add the interaction
		Interaction.insert({
			user_id:userId,
			target_id:target._id,
			game_id:gameId
		});
		// Kill the target
		Player.update({_id:target._id}, {$set:{target:null, dead:true}});
		Meteor.users.update({_id:userId},{$inc:{kills:1}});
		Meteor.users.update({_id:target.user_id},{$inc:{killed:1}});
		// If the target's target is the user, the game is over!
		if (target.target === player._id){
			Game.update({_id:gameId}, {$set:{over:true, winner:userId}});
			//Email all the participants
			var game = Game.findOne({_id:gameId});
			var winner = Meteor.users.findOne({_id:userId}).profile;
			Player.find({game_id:gameId}).forEach(function(e){
				var user = Meteor.users.findOne({_id:e.user_id});
				var profile = user.profile;
				if (profile.email && profile.subscribed){
					var emailObj = {
						_id:user._id,
						subject:'The game "' + game.name + '" has ended!',
						image:winner.picture,
						title:'The game "' + game.name + '" has ended!',
						content:'<p>Breathe a sigh of relief - this ShankYou.me game is done. Congratulate ' + winner.name + ' for being the last person standing!</p><p>Want to keep playing? <a href="http://shankyou.me/join">Join a game</a> or <a href="http://shankyou.me/create">Create one</a>.</p>',
						email: profile.email,
						domain:Meteor.absoluteUrl()
					};
					emailObj = {
						from: Meteor.settings.email.from,
						to: profile.email,
						subject: emailObj.subject,
						html: Handlebars.templates.basic(emailObj)
					};
					Email.send(emailObj);
				}
			});
		} else {
			// Set the user's target to the target's target
			Player.update({_id:player._id}, {$set:{target:target.target}});
		}
		return true;
	},
	surrender:function(gameId){
		var userId = this.userId;
		var target = Player.findOne({game_id:gameId, user_id:userId});
		var player = Player.findOne({game_id:gameId, target:target._id});
		check(gameId, String);
		Interaction.insert({
			user_id:player.user_id,
			target_id:target._id,
			game_id:gameId
		});
		Player.update({_id:target._id}, {$set:{target:null, dead:true}});
		Meteor.users.update({_id:userId}, {$inc:{kills:1}});
		Meteor.users.update({_id:target.user_id}, {$inc:{killed:1}});
		// If the target's target is the user, the game is over!
		if (target.target === player._id){
			Game.update({_id:gameId}, {$set:{over:true, winner:userId}});
		} else {
			// Set the user's target to the target's target
			Player.update({_id:player._id}, {$set:{target:target.target}});
		}
		return true;
	},
	startGame:function(gameId){
		var game;
		// Check if the user is an admin or the user is null (run from the server);
		if (this.userId !== null){
			if (!Roles.userHasRole(this.userId, 'admin')){
				throw new Meteor.Error('not-admin', 'User is not admin; unable to access method');
			}
		}
		// Check if gameId is a thing,
		// Otherwise, loop through all games
		if (gameId){
			game = Game.findOne({_id:gameId});
			if (!game.started){
				// Don't worry about the startdate. This is a force-start;
				roundRobin(gameId);
			}
		} else {
			Game.find({started:false}).forEach(function(e){
				if (moment(e.startdate).isBefore(moment())){
					// The start date has passed; it's show time!
					roundRobin(e._id);
				}
			});
		}
	},
	whatTime:function(){
		console.log(moment().toDate());
		return moment().toDate();
	},
	addMessage:function(message, gameId){
		check(message, String);
		check(gameId, String);
		ChatMessage.insert({
			game_id:gameId,
			message:message,
			user_id:this.userId,
		});
	},
	fblogin: function(response) {
		var identity = Meteor.call('$getIdentity', response.access_token);
    // synchronous call to get the user info from Facebook

    var serviceData = {
    	accessToken: response.access_token,
    	expiresAt: (+new Date) + (1000 * response.expires_in)
    };
    // include all fields from facebook
    // http://developers.facebook.com/docs/reference/login/public-profile-and-friend-list/
    var whitelisted = ['id', 'email', 'name', 'first_name',
    'last_name', 'link', 'username', 'gender', 'locale', 'age_range'];

    var fields = _.pick(identity, whitelisted);
    _.extend(serviceData, fields);

    var stuff = {
    	serviceName : 'facebook',
    	serviceData: serviceData,
    	options: {profile: {name: identity.name}}
    };
    var userData = Accounts.updateOrCreateUserFromExternalService(stuff.serviceName, stuff.serviceData, stuff.options);
    console.log(userData);
    var x = DDP._CurrentInvocation.get();

    var token = Accounts._generateStampedLoginToken();
    Accounts._insertLoginToken(userData.userId, token);
    Accounts._setLoginToken(userData.userId, x.connection, Accounts._hashLoginToken(token.token))
    x.setUserId(userData.userId)

    return {
    	id: userData.userId,
    	token: token.token,
    	tokenExpires: Accounts._tokenExpiration(token.when)
    };

},
$getIdentity: function(accessToken) {
	try {
		var data = HTTP.get("https://graph.facebook.com/me?fields=id,name,email,gender", {
			params: {access_token: accessToken}}).data;
		return data;
	} catch (err) {
		throw _.extend(new Error("Failed to fetch identity from Facebook. " + err.message),
			{response: err.response});
	}
},
welcomeEmail:function(userId){
	 //Email brand new users.
	 var user = Meteor.users.findOne({_id:userId});
	 if (!user.profile.welcomed){
	 	console.log(user);
	 	var profile = user.profile;
	 	profile.welcomed = true;
	 	profile.subscribed = true;
	 	Meteor.users.update({_id:userId},{$set:{profile:profile}});
		//Send the email if they have an email address
		if (profile.email && profile.subscribed){
			var emailObj = {
				_id:user._id,
				subject:'Welcome to Shankyou.me',
				image:'https://s3.amazonaws.com/shankyou/shankyou-round.png',
				title:'Welcome Aboard!',
				content:'<p >Thanks for signing up for ShankYou.me. ShankYou.me uses email to notify you of important game events, such as when a game begins, or who wins when the game ends.</p><p >If you want to play, you had better <a href="http://shankyou.me/join">Join a game</a> or <a href="http://shankyou.me/create">Create one</a>. </p><p>Good Luck!</p>',
				email: profile.email,
				domain:Meteor.absoluteUrl()
			};
			console.log(emailObj);
			emailObj = {
				from: Meteor.settings.email.from,
				to: profile.email,
				subject: emailObj.subject,
				html: Handlebars.templates.basic(emailObj)
			};
			Email.send(emailObj);
		}
	}
}
});

function roundRobin(gameId){
	console.log(gameId);
	var players = Player.find({game_id:gameId}).fetch();
	console.log(players);
	var index = Math.round(Math.random() * (players.length - 1));
	console.log(index);
	var player = players[index];
	var firstPlayer = players[index];
	console.log('First Player',firstPlayer);
	var target;
	players.splice(index, 1);
	while (players.length > 0){
		index = Math.round(Math.random() * (players.length - 1));
		target = players[index];
		Player.update({_id:player._id}, {$set:{target:target._id}});
		player = target;
		players.splice(index, 1);
	}
	console.log('First Player',firstPlayer);
	console.log('Last Player',player);
	Player.update({_id:player._id}, {$set:{target:firstPlayer._id}});
	Game.update({_id:gameId}, {$set:{started:true}});
	//Email all of the participants
	var game = Game.findOne({_id:gameId});
	Player.find({game_id:gameId}).forEach(function(e){
		var user = Meteor.users.findOne({_id:e.user_id});
		if (user){
			var profile = user.profile;
			if (profile){
				if (profile.email && profile.subscribed){
					var emailObj = {
						_id:user._id,
						subject:'The game "' + game.name + '" has begun!',
						image:'https://s3.amazonaws.com/shankyou/shankyou-round.png',
						title:'The game "' + game.name + '" has begun!',
						content:'<p>You had better start watching your back, because your ShankYou.me game has begun. Check the website for game instructions and to find your target!</p><p>Good Luck!</p>',
						email: profile.email,
						domain:Meteor.absoluteUrl()
					};
					emailObj = {
						from: Meteor.settings.email.from,
						to: profile.email,
						subject: emailObj.subject,
						html: Handlebars.templates.basic(emailObj)
					};
					Email.send(emailObj);
				}
			}
		}
	});
}

console.log('Interval Started');
Meteor.setInterval(function(){
	console.log('Within Interval:',Date());
	Meteor.call('startGame');
}, 10 * 60 * 1000);

