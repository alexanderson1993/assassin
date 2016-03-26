Template.profile.helpers({
	killCount:function(){
		return this.profile.kills || 0;
	},
	killed:function(){
		return this.profile.killed || 0;
	},
	secretCode:function(){
		return Player.findOne({user_id:Meteor.userId()}).secret_code;
	},
	isUser:function(){
		return this._id === Meteor.userId();
	},
	dead:function(){
		return Player.findOne({user_id:Meteor.userId()}).dead;
	}
});

Template.profile.events({
	'click .logout':function(){
		Router.go('sign-out');
	},
	'click .surrender':function(){
		IonPopup.confirm({
			title:'Are you sure?',
			template:'Are you <strong>really</strong> sure you want to surrender?',
			onOk:function() {
				var gameId = Session.get('currentGame');
				Meteor.call('surrender', gameId);
			}
		});
	},
});

Template.profile_desktop.helpers({
	killCount:function(){
		return this.profile.kills || 0;
	},
	killed:function(){
		return this.profile.killed || 0;
	},
	secretCode:function(){
		return Player.findOne({user_id:Meteor.userId()}).secret_code;
	},
	isUser:function(){
		return this._id === Meteor.userId();
	},
	dead:function(){
		return Player.findOne({user_id:Meteor.userId()}).dead;
	}
});

Template.profile_desktop.events({
	'click .logout':function(){
		Router.go('sign-out');
	},
	'click .surrender':function(){
		IonPopup.confirm({
			title:'Are you sure?',
			template:'Are you <strong>really</strong> sure you want to surrender?',
			onOk:function() {
				var gameId = Session.get('currentGame');
				Meteor.call('surrender', gameId);
			}
		});
	},
});
