import { GameDig } from 'gamedig';
import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const prefix = "!";

client.on("ready", function(){
	console.log("Logged in as " + client.user.tag + ".");
});

var ServerInfo = {
	numplayers: 0,
	maxplayers: 0,
	players: null,
	map: "NO DATA",
	stat: true,

	fetch: function(){
		GameDig.query({
			type: 'garrysmod',
			host: '91.211.118.150',
			port: 27053
		}).then((state) => {
			ServerInfo.map = state.map;
			ServerInfo.numplayers = state.numplayers;
			ServerInfo.maxplayers = state.maxplayers;
			ServerInfo.players = state.players;

			ServerInfo.stat = true;
		}).catch((error) => {
			ServerInfo.stat = false;
		});
	},

	prettyInfo: function(){
		var playerList = "";

		for(var i = 0; i < ServerInfo.players.length; i++){
			var name = ServerInfo.players[i].name;

			if(name){
				playerList += "**" + ServerInfo.players[i].name + "**" + "\n";
			}
		}

		return playerList;
	},

	serverStateInfo: function(){
		if(ServerInfo.stat){
			return "Сервер `в норме`.";
		}
		else{
			return "Сервер `отключен`!";
		}
	}
};

client.on("messageCreate", message => {
        if(!message.author.bot){
                if(message.content.startsWith(prefix + "info")){
			if(ServerInfo.stat){
				message.channel.send(ServerInfo.serverStateInfo() + " Играем на карте **" + ServerInfo.map + "**, " + "\n" + "Онлайн: " + ServerInfo.numplayers + "/" + ServerInfo.maxplayers + ". Игроки : \n" + ServerInfo.prettyInfo());
			}
			else{
				message.channel.send(ServerInfo.serverStateInfo());
			}
		}
        }
});

setInterval(ServerInfo.fetch, 1000);

client.login("TOKEN");
