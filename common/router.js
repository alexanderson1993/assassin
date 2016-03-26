if (Meteor.isMobile){
	Router.configure({
		layoutTemplate:'layout',
		onBeforeAction:function() {
			if (!Meteor.userId()){
				if (this.url == '/'){
					this.next();
					return;
				} else {
					if (this.url !== '/login'){
						Session.set('previous_url',this.originalUrl);
					}
					Router.go('/login');
				}
			}
			if (!Session.get('currentGame')){
				var player = Player.findOne({user_id:Meteor.userId()});
				if (player){
					if (Game.findOne({_id:player.game_id})){
						var game = Game.findOne({_id:player.game_id})._id;
						Session.set('currentGame',game);
					}
				}
			}
			Meteor.subscribe('game');
			this.next();
		},
	});
} else {
	Router.configure({
		layoutTemplate:'desktop',
		onBeforeAction:function() {
			if (!Meteor.userId()){
				if (this.url == '/'){
					this.next();
					return;
				} else {
					if (this.url !== '/login'){
						Session.set('previous_url',this.originalUrl);
					}
					Router.go('/login');
				}
			}
			if (!Session.get('currentGame')){
				var player = Player.findOne({user_id:Meteor.userId()});
				if (player){
					if (Game.findOne({_id:player.game_id})){
						var game = Game.findOne({_id:player.game_id})._id;
						Session.set('currentGame',game);
					}
				}
			}
			Meteor.subscribe('game');
			this.next();
		},
	});
}
Router.map(function(){
	this.route('index', {path:'/',
		action:function(){
			if (Meteor.isMobile){
				this.render('index');
			} else {
				this.render('index_desktop');
			}
		}
	});
	this.route('game', {
		path:'/game',
		waitOn:function(){
			return [Meteor.subscribe('game'), Meteor.subscribe('interaction')];
		},
		data:function(){
			return Game.findOne({_id:Session.get('currentGame')});
		},
		action:function(){
			var player = Player.findOne({user_id:Meteor.userId(), game_id:Session.get('currentGame')});
			if (player){
				Router.go('/game/' + Session.get('currentGame'))
			} else {
				Router.go('/join');
			}
		}
	});
	this.route('newGame',{
		path:'/newGame',
		action:function(){
			if (Session.get('donated')){
				this.render('newGame');
			} else {
				this.render('donation_desktop');
			}
		}
	});
	this.route('gameLink',{
		path:'/game/:id',
		waitOn:function(){
			return [Meteor.subscribe('game'), Meteor.subscribe('interaction')];
		},
		data:function(){
			return Game.findOne({_id:Session.get('currentGame')});
		},
		action:function(){
			var player = Player.findOne({user_id:Meteor.userId(), game_id:Session.get('currentGame')});
			if (player){
				if (Meteor.isMobile){
					this.render('game');
				} else {
					this.render('game_desktop');
				}
			} else {
				Router.go('/join');
			}
		}
	});
	this.route('gameOver', {
		path:'/gameOver',
		action:function(){
			this.render('gameOver');
		}
	});
	this.route('join', {
		path:'/join',
		waitOn:function(){
			return [Meteor.subscribe('game'),Meteor.subscribe('myPlayer')];
		},
		action:function(){
			var entry = this.params.query.id;
			if (entry && Meteor.user()){
				var game = Game.findOne({_id:entry});
				Router.go('/profile');
				Meteor.setTimeout(function(){
					if (game){
						if (Player.findOne({user_id:Meteor.userId(),game_id:entry})){
							sAlert.error('You are already part of this game.');
						} else {
							Player.insert({
								user_id:Meteor.userId(),
								game_id:game._id,
								target:null,
								secret_code:Meteor.generateCode()
							});
							Session.set('currentGame', game._id);
							sAlert.success('Congratulations! You have successfully joined this game!');
						}
					} else {
						sAlert.error('The secret code you entered does not correspond to any active games. Double check your capitalization and spelling.');
					}
				},1000);
			} else {
				IonModal.close('_gameList');
				if (Meteor.isMobile){
					this.render('joinGame');
				} else {
					this.render('joinGame_desktop');
				}
			}
		}
	});
	this.route('unsubscribe', {
		path:'/unsubscribe',
		action:function(){
			var entry = this.params.query.id;
			var profile = Meteor.users.findOne({_id:entry}).profile;
			Router.go('/profile');
			if (profile){
				profile.subscribed = false;
				Meteor.users.update({_id:entry},{$set:{profile:profile}});
				Meteor.setTimeout(function(){
					sAlert.success('You have been unsubscribed.');
				},1000);
			}
		}
	});
	this.route('kill', {
		path:'/kill',
		action:function(){
			this.render('kill');
		}
	});
	this.route('kills', {
		path:'/kills',
		waitOn:function(){
			return Meteor.subscribe('interaction');
		},
		action:function(){
			var player = Player.findOne({user_id:Meteor.userId(), game_id:Session.get('currentGame')});
			if (player){
				this.render('kills');
			} else {
				Router.go('/join');
			}
		}
	});
	this.route('target', {
		path:'/target',
		waitOn:function(){
			return Meteor.subscribe('myPlayer');
		},
		action:function(){
			var player = Player.findOne({user_id:Meteor.userId(), game_id:Session.get('currentGame')});
			var game = Game.findOne({_id:Session.get('currentGame')});
			if (player){
				if (player.dead){
					if (Meteor.isMobile){
						this.render('dead');
					} else {
						this.render('dead_desktop');
					}
				} else {
					if (game.winner === player.user_id){
						if (Meteor.isMobile){
							this.render('winner');
						} else {
							this.render('winner_desktop');
						}
					} else {
						if (Meteor.isMobile){
							this.render('target');
						} else {
							this.render('target_desktop');
						}
					}
				}
			} else {
				Router.go('/join');
			}
		}
	});
	this.route('profile', {
		path:'/profile',
		waitOn:function(){
			return Meteor.subscribe('myPlayer');
		},
		data:function(){
			if (Meteor.user()){
				return Meteor.user();
			}
		},
		action:function(){
			if (Meteor.isMobile){
				this.render('profile');
			} else {
				this.render('profile_desktop');
			}
		}
	});
	this.route('userProfile', {
		path:'/profile/:userId',
		waitOn:function(){
			return [Meteor.subscribe('myPlayer'), Meteor.subscribe('users')];
		},
		data:function(){
			userId = this.request.url.replace('/profile/', '');
			if (Meteor.users.findOne({_id:userId})){
				return Meteor.users.findOne({_id:userId});
			}
		},
		action:function(){
			if (Meteor.isMobile){
				this.render('profile');
			} else {
				this.render('profile_desktop');
			}
		}
	});
	this.route('chat', {
		path:'/chat',
		waitOn:function(){
			return [Meteor.subscribe('chats')];
		},
		action:function(){
			this.render('chat');
		}
	});
	this.route('oauth', {
		path: '/oauth',
		action: function() {
			debugger;
			var str = window.location.hash;
			if (this.url.match('(?=http%)([^]*)(?=#access_token)','g')){
				var redirectUrl = decodeURIComponent(this.url.match('(?=http%)([^]*)(?=#access_token)','g')[0]);
			}
			str = str.split('&');
			var accessToken = str[0];
			var expiresIn = str[1];
			accessToken = accessToken.split('=');
			expiresIn = expiresIn.split('=');
			var result = {
				access_token : accessToken[1],
				expires_in : expiresIn[1]
			};
			Meteor.call('fblogin', result, function(error, result) {
				Meteor.loginWithToken(result.token, function(err) {
					if (err) {
						Meteor._debug("Error logging in with token: " + err);
					}
					Meteor.call('welcomeEmail',Meteor.userId());
					if (redirectUrl){
						Router.go(redirectUrl);
					} else {
						Router.go('/game');
					}
				});
			});
		}
	});
});
	Router.route('/login', {
		action:function(){
			if (Meteor.userId()){
				if (Session.get('previous_url')){
					Router.go(Session.get('previous_url'));
				}
				Router.go('/game');
			} else {
				if (Meteor.isMobile){
					this.render('login');
				} else {
					this.render('login_desktop');
				}
			}
		}
	});
	Router.route('/sign-out', {
		action:function(){
			Meteor.logout();
			Router.go('/');
		}
	});
