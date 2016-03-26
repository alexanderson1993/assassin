Collections = {};

Users = Collections.Users = Meteor.users;
Player = Collections.Player = new orion.collection('player',{
	singularName:'player',
	pluralName:'players',
	title:'Players',
	link:{
		title:'Players'
	},
	tabular:{
		columns:[
		{ data:'user_id', title:'User Id' }
		]
	}
});
Game = Collections.Game = new orion.collection('game', {
	singularName:'game',
	pluralName:'games',
	title:'Games',
	link:{
		title:'Games'
	},
	tabular:{
		columns:[
		{ data:'name', title:'Name' }
		]
	}
});
Interaction = Collections.Interaction = new orion.collection('interaction', {
	singularName:'interaction',
	pluralName:'interactions',
	title:'Interactions',
	link:{
		title:'Interactions'
	},
	tabular:{
		columns:[
		{ data:'timestamp', title:'Date' },
		{ data:'user_id', title:'User' },
		{ data:'target_id', title:'Target' }
		]
	}
});
ChatMessage = Collections.ChatMessage = new Mongo.Collection('chatmessage');
