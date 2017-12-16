const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");

const re = /^(\>\s?r+o+ll+|\>\s?s+h+a+k+e+)(?:\s(.+))?/gim; // Regex to find out if a user types ">roll"
var responses;
fs.readFile('./responses.txt', "utf8", function(err, data) { // Allows custom responses
	if(err) {
		console.log("Can't read or find responses.txt, setting defaults");
		responses = ["It is certain", "It is decidedly so", "Without a doubt", "Yes, definitely",
					"You may rely on it", "As I see it, yes", "Most Likely", "Outlook good", "Yes",
					"Signs point to yes", "Reply hazy try again", "Ask again later"];
	} else {
		responses = data.split("\n"); // Responses are each individual line
	}
});

client.on('ready', () => {
  	console.log(`Logged in as ${client.user.tag}!`);
	console.log("Available responses: " + responses.length);
	client.user.setGame(">roll or >shake");
});

client.on('message', msg => {
	var matches = re.exec(msg.content);
  	if (!msg.author.bot && matches) {
  		var rand = Math.floor(Math.random()*responses.length);
  		if(matches[2]) {
  			msg.reply("You asked: \"" + matches[2] + "\" - " + responses[rand]);
  		} else {
  			msg.reply(responses[rand]);
  		}
  	}
});

fs.readFile('./token.key', "utf8", function(err, data) { // Keep this in a seperate file, trust me
	if(err) {
		console.log("Can't read or find token.key, make a token.key file if you haven't already"); 
		client.login('my token');
	} else {
		client.login(data);
	}
});