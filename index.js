const Discord = require("discord.js");
let client = new Discord.Client();
const Limiter = require("./limit.js");
let limit = new Limiter(15000);
const fs = require("fs");

const clockEmoji = ["🕐", "🕑", "🕒", "🕓", "🕔", "🕕", "🕖", "🕗", "🕘", "🕙", "🕚", "🕛", "🕜", "🕝", "🕞", "🕟", "🕠", "🕡", "🕢", "🕣", "🕤", "🕥", "🕦", "🕧"];

const re = /^(\>\s?r+o+ll+|\>\s?s+h+a+k+e+)(?:\s(.+))?/gim; // Regex to find out if a user types ">roll"
let responses;
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
	let matches = re.exec(msg.content);

  	if (!msg.author.bot && matches) {
  		if(limit && limit.exists(msg.author.id)) { // Checks if a usage limit is in place
  			for(let i = 0; i < Math.floor(Math.random()*5); i++) {
				msg.react(clockEmoji[Math.floor(Math.random()*clockEmoji.length)]);
  			}
		} else {
			var rand = Math.floor(Math.random()*responses.length);
	  		if(matches[2]) {
	  			msg.reply("You asked: \"" + matches[2] + "\" - " + responses[rand]);
	  		} else {
	  			msg.reply(responses[rand]);
	  		}
	  		limit.add(msg.author.id);
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