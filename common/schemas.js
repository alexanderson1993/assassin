Schemas = {};

// This users schema is just for autoform, not for attaching
// To the collection.
// Schemas.Profile = new SimpleSchema
Options.set('profileSchema', {
	firstname:{
		type:String
	},
	lastname:{
		type:String
	},
	email:{
		type:String,
		regEx:SimpleSchema.RegEx.Email
	},
	profilepicture:{
		type:String,
		regEx:SimpleSchema.RegEx.Url
	},
	kills:{
		type:Number,
		optional:true
	},
	killed:{
		type:Number,
		optional:true
	}
});

Schemas.Player = new SimpleSchema({
	user_id:{
		type:String,
		regEx:SimpleSchema.RegEx.Id,
		autoValue:function() {
			if (this.isInsert) {
				return Meteor.userId();
			}
		},
		autoform:{
			options:function() {
				return _.map(Meteor.users.find().fetch(), function(user) {
					return {
						label:user.emails[0].address,
						value:user._id
					};
				});
			}
		}
	},
	game_id:{
		type:String,
		regEx:SimpleSchema.RegEx.Id,
		autoform:{
			options:function() {
				return _.map(Game.find().fetch(), function(game) {
					return {
						label:game.name,
						value:game._id
					};
				});
			}
		}
	},
	target:{
		type:String,
		regEx:SimpleSchema.RegEx.Id,
		optional:true,
		autoform:{
			options:function() {
				return _.map(Meteor.users.find().fetch(), function(user) {
					return {
						label:user.emails[0].address,
						value:user._id
					};
				});
			}
		}
	},
	secret_code:{
		type:String,
		autoValue:function() {
			if (this.isInsert) {
				//Todo: Set this to be something awesome.
				return Meteor.generateCode();
			}
		},
	},
	dead:{
		type:Boolean,
		optional:true
	}
});

Schemas.Game = new SimpleSchema({
	name:{
		type:String
	},
	slug:{
		type:String,
		autoValue:function() {
			if (this.isInsert) {
				return Meteor.generateCode();
			}
		},
	},
	description:orion.attribute('summernote', {
		label: 'Description'
	}),
	stealthMode:{
		type: Boolean,
		optional:true,
		label: 'Stealth Mode: Other players are not known to each other'
	},
	startdate:{
		type:Date,
		/*autoform:{
			afFieldInput:{
				type:'bootstrap-datepicker'
			}
		}*/
	},
	over:{
		type:Boolean,
		optional:true
	},
	started:{
		type:Boolean,
		autoValue:function() {
			if (this.isInsert) {
				return false;
			}
		},
	},
	winner:{
		type:String,
		optional:true,
		autoform:{
			options:function() {
				return _.map(Meteor.users.find().fetch(), function(user) {
					return {
						label:user.emails[0].address,
						value:user._id
					};
				});
			}
		}
	}
});

Schemas.Interaction = new SimpleSchema({
	user_id:{
		type:String,
		regEx:SimpleSchema.RegEx.Id,
		autoform:{
			options:function() {
				return _.map(Meteor.users.find().fetch(), function(user) {
					return {
						label:user.emails[0].address,
						value:user._id
					};
				});
			}
		}
	},
	target_id:{
		type:String,
		regEx:SimpleSchema.RegEx.Id,
		autoform:{
			options:function() {
				return _.map(Meteor.users.find().fetch(), function(user) {
					return {
						label:user.emails[0].address,
						value:user._id
					};
				});
			}
		}
	},
	game_id:{
		type:String,
		regEx:SimpleSchema.RegEx.Id,
		autoform:{
			options:function() {
				return _.map(Game.find().fetch(), function(game) {
					return {
						label:game.name,
						value:game._id
					};
				});
			}
		}
	},
	timestamp:{
		type:Date,
		autoform:{
			type:'bootstrap-datepicker'
		},
		autoValue:function() {
			if (this.isInsert) {
				return new Date();
			}
		}
	}
});

Schemas.ChatMessage = new SimpleSchema({
	timestamp:{
		type:Date,
		autoform:{
			type:'bootstrap-datepicker'
		},
		autoValue:function() {
			if (this.isInsert) {
				return new Date();
			}
		}
	},
	message:{
		type:String,
	},
	user_id:{
		type:String,
		regEx:SimpleSchema.RegEx.Id,
		autoform:{
			options:function() {
				return _.map(Meteor.users.find().fetch(), function(user) {
					return {
						label:user.emails[0].address,
						value:user._id
					};
				});
			}
		}
	},
	game_id:{
		type:String,
		regEx:SimpleSchema.RegEx.Id,
		autoform:{
			options:function() {
				return _.map(Game.find().fetch(), function(game) {
					return {
						label:game.name,
						value:game._id
					};
				});
			}
		}
	},
});

Collections.Game.attachSchema(Schemas.Game);
Collections.Interaction.attachSchema(Schemas.Interaction);
Collections.Player.attachSchema(Schemas.Player);
Collections.ChatMessage.attachSchema(Schemas.ChatMessage);
