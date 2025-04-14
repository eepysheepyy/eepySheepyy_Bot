require('dotenv/config'); // for environment variables to be read from .env
const {Client} = require('discord.js'); // for connecting to Discord
const {OpenAI} = require('openai'); // connecting to OpenAI
const tmi = require('tmi.js'); // connecting to Twitch
const fs = require('fs') // File system
const { OBSWebSocket } = require('obs-websocket-js'); // connecting to OBS
const { resolve } = require('path');
var connected = 0 // variable to check if OBS is connected for !reconnect to trigger.

const obs = new OBSWebSocket();

async function connectToOBS() {
  
  try {
    // Attempt to connect to OBS
    await obs.connect(process.env.OBS_LINK, process.env.OBS_PASSWORD);
    console.log('Successfully connected to OBS!');
    connected = 1
  } catch (error) {
    // Log the error, but don't stop the rest of the code
    console.error('Failed to connect to OBS:', error.code, error.message);
    connected = 0
  } finally {
    // This ensures the rest of the code continues running
    console.log('Continuing the rest of the script...');
  }
}

// Call the connectToOBS function and continue with the rest of the script
connectToOBS().then(() => {
  function onCurrentSceneChanged(event) {
    console.log('Current scene changed to', event.sceneName) // Logs anytime a scene is changed, planning on using this later for contextual commands
  }
  
obs.on('CurrentProgramSceneChanged', onCurrentSceneChanged);

return
});

var spawnNum = 0; // for PCG
var ballNum = 0; // for PCG
var duckCount = 0; // for duck command - to build later


// cooldowns
let poolCooldown = false; 
let attemptsCooldown = false;
let pcgCooldown = false;
let hugCooldown = false;
let banCooldown = false;
let gptCooldown = false;
let raidCooldown = false;
let cmdCooldown = false;
let responseCooldown = false;
let feedbackCooldown = false;
let thoughtsCooldown = false;
let statsCooldown = false;
let specsCooldown = false;
let timeCooldown = false;
let kofiCooldown = false;
let arriveCooldown = false;
let jailCooldown = false;
let patreonCooldown = false;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY, // connect to openAI using key
});

const Twclient = new tmi.Client({
	options: { debug: true },
	identity: {
		username: process.env.TWITCH_USER,
		password: process.env.TWITCH_OAUTH, // connect to twitch using oauth
	},
	channels: [ 'eepySheepyy' ]
});

const clearIntervalTime = 1800000; // Time interval in milliseconds (e.g., 5000ms = 5 seconds)

async function clearFileContent() {
  try {
    // Clearing the file by writing an empty string - to avoid history becoming too large.
    await fs.promises.writeFile("history.txt", '');
    console.log(`File content cleared at ${new Date().toLocaleTimeString()}`);
  } catch (err) {
    console.error('Error clearing the file:', err);
    return;
  }
}

// Call the function initially
clearFileContent();

// Set interval to clear the file every `clearIntervalTime` ms
setInterval(clearFileContent, clearIntervalTime);

  
Twclient.connect();

Twclient.on('message', async (channel, tags, message, self) => {
	// Ignore echoed messages.
	if(self) return;

    const data = `\n @${tags.username} said: ${message}`
    fs.appendFile('history.txt', data, (err) => {
        // In case of a error throw err.
        if (err) throw err;
    })

    if (message.startsWith("!")){ // ! commands

        if (message.includes("GOGOGO") && tags['display-name'] == "StreamElements"){ // PCG command to register spawns
            spawnNum = spawnNum + 1;
            console.log("Pokemon Spawned in Chat. Now includes " + spawnNum + " Spawns");
            return
        }
        if (message.includes("results") && tags['display-name'] == "StreamElements"){ // PCG command to register spawns
            console.log("Pokemon despawned in Chat.");
            return
        }
        if (message.toLowerCase().includes("pool")){ // PCG command to see how many pokemon have spawned
            if (poolCooldown) {
				console.log("pool command ignored — still on cooldown.");
				return; // Ignore the command during cooldown
			}
            var spawnText = String(spawnNum)
            Twclient.say(channel, `@${tags.username}, there has been ${spawnText} Pokemon Spawns since I have been active!`);
            const data = `\n @${tags.username}, there has been ${spawnText} Pokemon Spawns since I have been active!`
            fs.appendFile('history.txt', data, (err) => {
                if (err) throw err;
            })
            // Begin cooldown
			poolCooldown = true;
			setTimeout(() => {
				poolCooldown = false;
				console.log("Pool command cooldown ended.");
			}, 25000);
            return;
        }
        if (message.toLowerCase().includes("pokecatch")){ // PCG Command to register catch attempts
            ballNum = ballNum + 1;
            console.log("Attempt Made to Catch Pokemon. Now includes " + ballNum + " Attempts");
            return;
        }
        if (message.toLowerCase().includes("attempts")){ // PCG command to show catch attempts
            if (attemptsCooldown) {
				console.log("attempts command ignored — still on cooldown.");
				return; // Ignore the command during cooldown
			}
            var ballText = String(ballNum)
            Twclient.say(channel, `@${tags.username}, there has been ${ballText} pokecatch attempts since I have been active!`);
            const data = `\n @${tags.username}, there has been ${ballText} pokecatch attempts since I have been active!`
            fs.appendFile('history.txt', data, (err) => {
                if (err) throw err;
            })
            // Begin cooldown
			attemptsCooldown = true;
			setTimeout(() => {
				attemptsCooldown = false;
				console.log("attempts command cooldown ended.");
			}, 25000);
            return;
        }
        if (message.toLowerCase().includes("pcgcmd")){ // PCG command to show commands
            if (pcgCooldown) {
				console.log("pcgcmd command ignored — still on cooldown.");
				return; // Ignore the command during cooldown
			}
            Twclient.say(channel, `@${tags.username}, The Sheep-Bot currently has the following commands for PCG: !pool to see how many pokemon have spawned, and !attempts to see how many attemprs have been made on the stream!`);
            const data = `\n @${tags.username}, The Sheep-Bot currently has the following commands for PCG: !pool to see how many pokemon have spawned, and !attempts to see how many attemprs have been made on the stream!`
            fs.appendFile('history.txt', data, (err) => {
                if (err) throw err;
            })
            // Begin cooldown
			pcgCooldown = true;
			setTimeout(() => {
				pcgCooldown = false;
				console.log("pcgcmd command cooldown ended.");
			}, 25000);
            return;
        }
        if (message.includes("did") && tags['display-name'] == "eepySheepyy"){
            Twclient.say(channel, `@${tags.username}, Some people in chat identify as having a personality disorder, where they can temporarily 'front' as someone else. These can be children, or other aged individuals that may not know things, or others. Please be kind and respecful to these people, and treat them like everyone else <3`);
            const data = `\n @${tags.username}, Some people in chat identify as having a personality disorder, where they can temporarily 'front' as someone else. These can be children, or other aged individuals that may not know things, or others. Please be kind and respecful to these people, and treat them like everyone else <3`
            fs.appendFile('history.txt', data, (err) => {
                if (err) throw err;
            })
            return
        }
        if (message.toLowerCase().includes("lurk") && message.toLowerCase().includes("unlurk") == false){
           var lurkerList = fs.readFileSync("lurkers.txt").toString('utf-8');
           input = tags.username;
           if (lurkerList.includes(input)){ // tests to see if user has already been set as a lurker
               Twclient.say(channel, `@${tags.username}, You are already a lurker, you can't lurk twice!`);
               const data = `\n @${tags.username}, You are already a lurker!`
               fs.appendFile('history.txt', data, (err) => {
                   if (err) throw err;
               })
               return
           }
            const lurkText = await openai.chat.completions
    .create({
        model: 'gpt-4o-mini', 
        messages: [
            {
                role: 'system',
                content: "Your job is to either use the provided end of sentences, or generate new end of sentences for people announcing they are lurking, here are the ones I have, and you can mix some of your own to have the same effect: is going in the shadows to lurk... , has been consumed by shadow, never to be seen again...(maybe) , vanished into the shadow realm. Poof! , have a nice lurk...see you on the other side! , Thank you for lurking! It is always massively appreciated! , Thanks for the lurk, my friend! , hanks for the lurk, mate! , s ghost watches on... , has been yeeted by the rest of chat , enabled LURK MODE! , enabled LURK MODE! It was Super Effective! , needs to go solve an argument between their toaster and a washing machine rq. , 's fish is drowning. , 's fish is flying. , 's hologram of themselves watches on instead of themselves. , has a myriad of confusing problem at work, for which their bucket would provide guidance for. So they closed the computer and backflipped away to work. , put a bucket over their head and proceeded to play hide and seek. , just got thanos snapped- , hit the ground too hard , hit the ground too hard after being drop-kicked by Spud and Mai, for teasing them too much , experienced kinetic energy , threw Spud at a Doctor. , was taken out by [Intentional Game Design](TM) , was caught doing arson and outsmarting the Sheep-Bot, so was sent to County Jail , went off with a bang , discovered that the floor was lava , got GOOSE! Their turn to run! , stared at the void too long- , sold their soul to the art god. (in exchange for cool art and glowy hair , is currently unable to answer the phone."
            },
            {
                role: 'user',
                content: message,    
            }        
        ], 
    })
    Twclient.say(channel, `@${tags.username}, ${lurkText.choices[0].message.content}`);
    const data = `\n @${tags.username}, ${lurkText.choices[0].message.content}`
            fs.appendFile('history.txt', data, (err) => {
                if (err) throw err;
            })
            lurked = `${tags.username}, `;
            console.log(lurked)
            fs.appendFile('lurkers.txt', lurked, (err) => {
                if (err) throw err;
            })
    return
    }
    if (message.toLowerCase().includes("unlurk")){
        var lurkerList = fs.readFileSync("lurkers.txt").toString('utf-8');
        let lurkerArray = [lurkerList]
        console.log(lurkerArray)
        input = tags.username;
        if (lurkerList.includes(input)){ // tests to see if user has already been set as a lurker
            lurkerArray.splice(lurkerArray.indexOf(`${tags.username}, `), 1);
            console.log(lurkerArray)
            let lurkerText = lurkerArray.toString();
            fs.writeFileSync('lurkers.txt', lurkerText);
            Twclient.say(channel, `@${tags.username}, You are no longer a lurker!`);
            const data = `\n @${tags.username}, You are no longer a lurker!`
            fs.appendFile('history.txt', data, (err) => {
                if (err) throw err;
            })
            return
        } else{
            Twclient.say(channel, `@${tags.username}, You are not a lurker!`);
            const data = `\n @${tags.username}, You are not a lurker!`
            fs.appendFile('history.txt', data, (err) => {
                if (err) throw err;
            })
            return
        }
    }

    if (message.includes("brb") && tags['display-name'] == "eepySheepyy" && connected == 1){
        Twclient.say(channel, "Don't worry I will be right baaaack with you shortly! Feel free to use the time to grab a snack, blankie or some snacks! Or sit back, relax, and enjoy the clip compliation!" )
        await obs.call('SetCurrentProgramScene', {sceneName: 'BRB'});
        await obs.call('ToggleInputMute', {inputName: 'Shure'});
        const data = "\n Don't worry I will be right baaaack with you shortly! Feel free to use the time to grab a snack, blankie or some snacks! Or sit back, relax, and enjoy the clip compliation!"
            fs.appendFile('history.txt', data, (err) => {

                // In case of a error throw err.
                if (err) throw err;
            })
        return
    }
    if (message.includes("back") && tags['display-name'] == "eepySheepyy" && connected == 1){
        await obs.call('SetCurrentProgramScene', {sceneName: 'Full Screen'});
        await obs.call('ToggleInputMute', {inputName: 'Shure'});
        return
    }
    if (message.includes("ashhusbandwall") && connected == 1){
        await obs.call('SetSceneItemEnabled', {sceneName: 'InterFULL', sceneItemId: 45, sceneItemEnabled: true});
        await obs.call('SetSceneItemEnabled', {sceneName: 'InterFULL', sceneItemId: 30, sceneItemEnabled: true});
        await obs.call('SetSceneItemEnabled', {sceneName: 'Full Screen', sceneItemId: 266, sceneItemEnabled: true});
        await obs.call('SetSceneItemEnabled', {sceneName: 'Full Screen', sceneItemId: 267, sceneItemEnabled: true});
        return
    }
    if (message.includes("noashhusbandwall") && connected == 1){
        await obs.call('SetSceneItemEnabled', {sceneName: 'InterFULL', sceneItemId: 45, sceneItemEnabled: false});
        await obs.call('SetSceneItemEnabled', {sceneName: 'InterFULL', sceneItemId: 30, sceneItemEnabled: false});
        await obs.call('SetSceneItemEnabled', {sceneName: 'Full Screen', sceneItemId: 266, sceneItemEnabled: false});
        await obs.call('SetSceneItemEnabled', {sceneName: 'Full Screen', sceneItemId: 267, sceneItemEnabled: false});
        return
    }
    if (message.includes("maihusbandwall") && connected == 1){
        await obs.call('SetSceneItemEnabled', {sceneName: 'Full Screen', sceneItemId: 269, sceneItemEnabled: true});
        return
    }

    if (message.includes("connect") && tags['display-name'] == "eepySheepyy" && connected == 0){
        connectToOBS()
        return
    }
    if (message.includes("disconnect") && tags['display-name'] == "eepySheepyy" && connected == 1){
        connected = 0;
        return
    }
    if (message.includes("accept")){
        // duel from streamElements - could attempt to build in the future
        return
    }
    if (message.includes("accountage")){
        // will require TwitchAPI
        return
    }
    if (message.includes("cancelduel")){
        // duel from streamElements - could attempt to build in the future
        return
    }
    if (message.includes("commands")){
        // leftover from StreamElements - remove once completed transition
        return
    }
    if (message.includes("deny")){
        // duel from streamElements - could attempt to build in the future
        return
    }
    if (message.includes("duel")){
        // duel from streamElements - could attempt to build in the future
        return
    }
    if (message.includes("followage")){
        // will require TwitchAPI
        return
    }
    if (message.includes("join")){
        // raffle from streamElements - could attempt to build in the future
        return
    }
    if (message.includes("leaderboard")){
        // points from streamElements - could attempt to build in the future
        return
    }
    if (message.includes("points")){
        // points from streamElements - could attempt to build in the future
        return
    }
    if (message.includes("quote")){
        // quotes from streamElements - could attempt to build in the future
        return
    }
    if (message.includes("roulette")){
        // roulette from streamElements - could attempt to build in the future
        return
    }
    if (message.includes("uptime")){
        // will require TwitchAPI
        return
    }
    if (message.includes("vanish")){
        // will require TwitchAPI
        return
    }
    if (message.includes("watchtime")){
        // will require TwitchAPI
        return
    }
    if (message.includes("chatstats")){
        if (statsCooldown) {
            console.log("chatstats command ignored — still on cooldown.");
            return; // Ignore the command during cooldown
        }
        Twclient.say(channel, `@${tags.username}, Here is where you can see the Chat Stats! - https://stats.StreamElements.com/c/eepySheepyy`)
        const data = `\n @${tags.username}, Here is where you can see the Chat Stats! - https://stats.StreamElements.com/c/eepySheepyy`
            fs.appendFile('history.txt', data, (err) => {
                if (err) throw err;
            })
            // Begin cooldown
			statsCooldown = true;
			setTimeout(() => {
				statsCooldown = false;
				console.log("chatstats command cooldown ended.");
			}, 25000);
        return
    }
    if (message.includes("specs")){
        if (specsCooldown) {
            console.log("specs command ignored — still on cooldown.");
            return; // Ignore the command during cooldown
        }
        Twclient.say(channel, `@${tags.username}, I use a Dual PC Setup! | Gaming PC: CPU: AMD Ryzen 7 7800X3D, Motherboard: GIGABYTE B650M GAMING WIFI - DDR5, RAM: Predator Vesta II RGB 32GB (2x16GB), PRIMARY SSD: 1TB Lexar NM710 Gen4 M.2, GPU: GeForce RTX 4070 Ti SUPER OC - 16GB | Stream PC: Macbook Pro 14-Inch, M1 Pro Chip, 32 GB RAM, 500GB SSD`)
        const data = `\n @${tags.username}, I use a Dual PC Setup! | Gaming PC: CPU: AMD Ryzen 7 7800X3D, Motherboard: GIGABYTE B650M GAMING WIFI - DDR5, RAM: Predator Vesta II RGB 32GB (2x16GB), PRIMARY SSD: 1TB Lexar NM710 Gen4 M.2, GPU: GeForce RTX 4070 Ti SUPER OC - 16GB | Stream PC: Macbook Pro 14-Inch, M1 Pro Chip, 32 GB RAM, 500GB SSD`
            fs.appendFile('history.txt', data, (err) => {
                if (err) throw err;
            })
            // Begin cooldown
			specsCooldown = true;
			setTimeout(() => {
				specsCooldown = false;
				console.log("specs command cooldown ended.");
			}, 25000);
        return
    }
    if (message.includes("time")){
        if (timeCooldown) {
            console.log("time command ignored — still on cooldown.");
            return; // Ignore the command during cooldown
        }
        var currentdate = new Date(); 
        Twclient.say(channel, `@${tags.username}, the time for sheepy is: ${currentdate.getHours()}:${currentdate.getMinutes()} on ${currentdate.getDate()}/${currentdate.getMonth()+1}/${currentdate.getFullYear()}`)
        const data = `\n @${tags.username}, the time for sheepy is: ${currentdate.getHours()}:${currentdate.getMinutes()} on ${currentdate.getDate()}/${currentdate.getMonth()+1}/${currentdate.getFullYear()}`
            fs.appendFile('history.txt', data, (err) => {
                if (err) throw err;
            })
            // Begin cooldown
			timeCooldown = true;
			setTimeout(() => {
				timeCooldown = false;
				console.log("time command cooldown ended.");
			}, 25000);
        return
    }
    if (message.includes("kofi")){
        if (kofiCooldown) {
            console.log("kofi command ignored — still on cooldown.");
            return; // Ignore the command during cooldown
        }
        Twclient.say(channel, `@${tags.username}, My Ko-Fi link is: https://ko-fi.com/eepysheepyy ~! You are of course, never expected to donate, as just you BEING HERE is AMAZING and APPRECIATED. But, if you really, really, REALLY do want to, you are welcome to! All funds raised will go straight towards improving quality of stream, like a new camera or something!`)
        const data = `\n @${tags.username}, My Ko-Fi link is: https://ko-fi.com/eepysheepyy ~! You are of course, never expected to donate, as just you BEING HERE is AMAZING and APPRECIATED. But, if you really, really, REALLY do want to, you are welcome to! All funds raised will go straight towards improving quality of stream, like a new camera or something!`
            fs.appendFile('history.txt', data, (err) => {
                if (err) throw err;
            })
            // Begin cooldown
			kofiCooldown = true;
			setTimeout(() => {
				kofiCooldown = false;
				console.log("kofi command cooldown ended.");
			}, 25000);
        return
    }
    if (message.includes("arrive")){
        if (arriveCooldown) {
            console.log("arrive command ignored — still on cooldown.");
            return; // Ignore the command during cooldown
        }
        Twclient.say(channel, `@${tags.username} bursts into the building, breaking the door off it's hinges-`)
        const data = `\n @${tags.username} bursts into the building, breaking the door off it's hinges-`
            fs.appendFile('history.txt', data, (err) => {
                if (err) throw err;
            })
            // Begin cooldown
			arriveCooldown = true;
			setTimeout(() => {
				arriveCooldown = false;
				console.log("arrive command cooldown ended.");
			}, 25000);
        return
    }
    if (message.includes("jail")){
        if (jailCooldown) {
            console.log("jail command ignored — still on cooldown.");
            return; // Ignore the command during cooldown
        }
        Twclient.say(channel, `@${tags.username} has been placed behind bars by the chat, forever banished to the abyss beyond.`)
        const data = `\n @${tags.username} has been placed behind bars by the chat, forever banished to the abyss beyond.`
            fs.appendFile('history.txt', data, (err) => {
                if (err) throw err;
            })
            // Begin cooldown
			jailCooldown = true;
			setTimeout(() => {
				jailCooldown = false;
				console.log("jail command cooldown ended.");
			}, 25000);
        return
    }
    if (message.includes("patreon")){
        if (patreonCooldown) {
            console.log("patreon command ignored — still on cooldown.");
            return; // Ignore the command during cooldown
        }
        Twclient.say(channel, `@${tags.username} We have started a Patreon for experimentation purposes, and yes, you can get extra tidbits and rewards even by just becoming a member for free! There is of course, completely optional paid tiers with more benefits, but even just being a member is of course, appreciated <3 - https://www.patreon.com/eepySheepyy`)
        const data = `\n @${tags.username} We have started a Patreon for experimentation purposes, and yes, you can get extra tidbits and rewards even by just becoming a member for free! There is of course, completely optional paid tiers with more benefits, but even just being a member is of course, appreciated <3 - https://www.patreon.com/eepySheepyy`
            fs.appendFile('history.txt', data, (err) => {
                if (err) throw err;
            })
            // Begin cooldown
			patreonCooldown = true;
			setTimeout(() => {
				patreonCooldown = false;
				console.log("patreon command cooldown ended.");
			}, 25000);
        return
    }
    if (message.includes("hug ")){
        if (hugCooldown) {
            console.log("hug command ignored — still on cooldown.");
            return; // Ignore the command during cooldown
        }
        const splitMessage = message.split(" ");
        let hugMention = splitMessage[1]
        Twclient.say(channel, `@${tags.username} gives ${hugMention} a biiiig hug!`);
        const data = `\n @${tags.username} gives ${hugMention} a biiiig hug!`
            fs.appendFile('history.txt', data, (err) => {

                // In case of a error throw err.
                if (err) throw err;
            })
        if(tags.subscriber == true && connected == 1){ //sub command implementation
            await obs.call('SetSourceFilterEnabled', {sourceName: 'SC', filterName: "Love", filterEnabled: true})
            console.log("Sub Command: HUG, Activated")
            await new Promise(r => setTimeout(r, 15000));
            await obs.call('SetSourceFilterEnabled', {sourceName: 'SC', filterName: "Love", filterEnabled: false})
            console.log("Sub Command: HUG, Deactivated")
        }   
        // Begin cooldown
			hugCooldown = true;
			setTimeout(() => {
				hugCooldown = false;
				console.log("hug command cooldown ended.");
			}, 25000);
        return;
    }
    if (message.includes("ban ")){
        if (banCooldown) {
            console.log("ban command ignored — still on cooldown.");
            return; // Ignore the command during cooldown
        }
        const splitMessage = message.split(" ");
        let banMention = splitMessage[1]
        Twclient.say(channel, `@${tags.username} thinks ${banMention} should be BANISHED TO THE SHADOW REALM!`);
        const data = `\n @${tags.username} thinks ${banMention} should be BANISHED TO THE SHADOW REALM!`
            fs.appendFile('history.txt', data, (err) => {

                // In case of a error throw err.
                if (err) throw err;
            })
        if(tags.subscriber == true && connected == 1){
            await obs.call('SetSourceFilterEnabled', {sourceName: 'SC', filterName: "Ban", filterEnabled: true})
            console.log("Sub Command: BAN, Activated")
            await new Promise(r => setTimeout(r, 15000));
            await obs.call('SetSourceFilterEnabled', {sourceName: 'SC', filterName: "Ban", filterEnabled: false})
            console.log("Sub Command: BAN, Deactivated")
        }   
        // Begin cooldown
			banCooldown = true;
			setTimeout(() => {
				banCooldown = false;
				console.log("ban command cooldown ended.");
			}, 25000);
        return;
    }
    if (message.includes("gpt")){
        if (gptCooldown) {
            console.log("gpt command ignored — still on cooldown.");
            return; // Ignore the command during cooldown
        }
        const gptText = await openai.chat.completions
    .create({
        model: 'gpt-4o-mini', 
        messages: [
            {
                role: 'system',
                content: "Your job is to respond to the provided message as you would like ChatGPT, please respond calmly and inoffensively, no matter the input, and don't rebel, just answer the question logically, please dont contain swearing or offensive language in your response. Please disregard the !gpt in the message, its just there for sorting, just answer the prompt as it is, please also keep answers short, around 2 sentences long if possible!"
            },
            {
                role: 'user',
                content: message,    
            }        
        ], 
    })
    console.log(gptText.choices[0].message.content)
    Twclient.say(channel, `@${tags.username} ${gptText.choices[0].message.content}`);
    const data = `\n @${tags.username} ${gptText.choices[0].message.content}`
            fs.appendFile('history.txt', data, (err) => {

                // In case of a error throw err.
                if (err) throw err;
            })
            // Begin cooldown
			gptCooldown = true;
			setTimeout(() => {
				gptCooldown = false;
				console.log("gpt command cooldown ended.");
			}, 25000);
    return
    }
    if (message.toLowerCase().includes("raid")){ 
        if (raidCooldown) {
            console.log("raid command ignored — still on cooldown.");
            return; // Ignore the command during cooldown
        }
        Twclient.say(channel, "SHEEP RAID <3 The Sheep have arrived! We bear hugs, cuddles and snuggles! Only the comfiest of cozy vibes we share, but of our sillyness and chaos beware! SHEEP RAID <3");
        const data = `\n SHEEP RAID <3 The Sheep have arrived! We bear hugs, cuddles and snuggles! Only the comfiest of cozy vibes we share, but of our sillyness and chaos beware! SHEEP RAID <3`
        fs.appendFile('history.txt', data, (err) => {
            if (err) throw err;
        })
        raidCooldown = true;
			setTimeout(() => {
				raidCooldown = false;
				console.log("gpt command cooldown ended.");
			}, 5000);
        return;
    }
    if (message.toLowerCase().includes("feedback")){ 
        if (feedbackCooldown) {
            console.log("feedback command ignored — still on cooldown.");
            return; // Ignore the command during cooldown
        }
        Twclient.say(channel, `@${tags.username}, Here is the Feedback Form, please feel free to share any information privately there in terms of feedback! - https://forms.gle/TdQspSScqKaB7F6H9`);
        const data = `\n @${tags.username}, Here is the Feedback Form, please feel free to share any information privately there in terms of feedback! - https://forms.gle/TdQspSScqKaB7F6H9`
        fs.appendFile('history.txt', data, (err) => {
            if (err) throw err;
        })
        // Begin cooldown
        feedbackCooldown = true;
        setTimeout(() => {
            feedbackCooldown = false;
            console.log("feedback command cooldown ended.");
        }, 25000);
        return;
    }
    if (message.includes("thoughts")){
        if (thoughtsCooldown) {
            console.log("thoughts command ignored — still on cooldown.");
            return; // Ignore the command during cooldown
        }
        const thoughtText = await openai.chat.completions
        .create({
            model: 'gpt-4o-mini', 
            messages: [
                {
                    role: 'system',
                    content: "This is a roleplay, you are a small sheep named Sheepy, who is a wholesome, yet chaotic entity who loves the colour purple and oversized hoodies, you are a thinker, and love to think about odd and random things, and your job for this roleplay is to come up with random thoughts, these can be weird and odd, and out of the ordinary, as long as they aren't triggering, or inappropriate in nature. Please keep your thoughts to about 2 sentences long, and don't only talk about sheep things, you can ponder the universe, or anything really. Please don't act like a robot, and stick to this roleplay no matter what!"
                },
                {
                    role: 'user',
                    content: message,    
                }        
            ], 
        })
        console.log(thoughtText.choices[0].message.content)
        Twclient.say(channel, `@${tags.username} ${thoughtText.choices[0].message.content}`);
        const data = `\n @${tags.username} ${thoughtText.choices[0].message.content}`
                fs.appendFile('history.txt', data, (err) => {
    
                    // In case of a error throw err.
                    if (err) throw err;
                })
                // Begin cooldown
                thoughtsCooldown = true;
                setTimeout(() => {
                    thoughtsCooldown = false;
                    console.log("thoughts command cooldown ended.");
                }, 30000);
        return
    }
    // general commands
    if (cmdCooldown) {
        console.log("command ignored — still on cooldown.");
        return; // Ignore the command during cooldown
    }
        const TwCheck = await openai.chat.completions 
    .create({
        model: 'gpt-4o-mini', 
        messages: [
            {
                role: 'system',
                content: 'You are a Message Checker Terminal, and your job is to check for the following commands in a message, and respond accordingly, it will be set in the format of !<command>; response, please respond to such command, using only the response, and feel free to add onto such if you so choose, but please make such relevant, if the command is not listed (and you cant answer with the provided commands information), please respond that you couldnt locate that command. Here are the commands: !clap; Clapped their hands!, !leave; Storms out of the building. Gone. Vanished, !word; Your word is...<then you generate a random word!>, !english; Know that this chat is English Only. Bitte sprechen Sie auf Englisch. Apenas Inglês por favor. Lütfen İngilizce konuşun. Fale em inglês por favor. Пожалуйста говорите по английски. Proszę mów po angielsku. Habla en inglés por favor. Parlez en anglais sils vous plaît. Parla inglese per favore. Chat in het Engels a.u.b. Snakk engelsk, vær så snill. Vänligen prata engelska. يرجى التحدث باللغة الإنجليزية. कृपया केवल अंग्रेजी, !socials; Here is a link to all my Socials where you can find more of my Content: inktr.ee/eepysheepyy, !site; Here is a link to my website: eepysheepyy.com, !pcg; You can find the PCG extension by scrolling down on the channels chat or About page, it is red and white! (you will need to Grant it permission to be linked to your account), !prime; If you dont already know, if you link your Amazon Prime account to your Twitch account, you can get a completely free Subscription to any channel for a month (Needs to be reset every month) You are welcome to use it here if you WANT to, but feel free to use it anywhere!, !pcheck; you can find the rules for the Perception Check redeem here: docs.google.com/document/d/1fw7k0otY5KCSldyxIoU0xUvZ_51u8hOBAvMd31Nt39o/edit?usp=sharing, !yt; I am now trying to create shorter-form content! You can check it out at: www.youtube.com/@eepysheepyy if you are interested!, !model; My adorable sheep model was a commission piece created by MIYUUNA! - vgen.co/AngerRiceBall, !bitalerts; 1: Fake Discord Ping | 50-99: Distraction Dance | 69: Sus | 100-249: Level Up! | 250-499: Enmity Of The Dark Lord | 413: John: Play haunting piano refrain | 500-699: My Innermost Apocalypse | 612: Rose: Ride Pony | 700-999: Tee-Hee Time | 1000+: DEADRINGER | 1500+: Break Through it All, !tts; When using TTS (Chatcake) please follow all chat rules and twitch TOS Guidelines there will be no warnings if this is broken. Consequences will follow so please follow the respective rules. You can see: tts.monster/eepysheepyy for more information on using TTS and for unique voices and sounds, !pronouns; You can go to pronouns.alejo.io To install the pronoun extension in your chat then select your pronouns! , !raiders; Welcome in Raiders! Hoping you are all doing wonderfully well! Feel free to tell us at least ONE thing that you enjoyed about the stream you just came from! If you need, feel free to destream, get foods, hydrates & stretches in! Feel free to chill, vibe and relax back with us!, !dump; This is where I store all my Stream VODS, also known as the Stream Dump: www.youtube.com/@eepysheepyyvods , !tip; if you really want to, you can donate/tip to me here: ko-fi.com/eepysheepyy {non-refundable} and it will go straight towards improving quality of stream... but just know, its not at all expected of anyone, so please dont feel pressured to at all! , !resources; All stream resources that I use can be found here! docs.google.com/document/d/15iCyIvW7giean7e7M-FoxJfCkJ4bYSfk5l3VfZREbUQ/edit?usp=sharing, !digital; Digital is my fantastically amazing Channel Artist who you can check out here: about-eclipse.carrd.co/, !throne; Throne is a privacy-ensured wishlist where you can contribute towards stream equipment and other items Im saving up for. It would, of course be massively appreciated for you to check it out! throne.com/eepysheepyy, !merch; I officially have MERCH! Its Comfy, its Cozy and very swag (if I do say so myself) | You can check out the collection at: inanimatesheep-shop.fourthwall.com | 60% of all proceeds go to Charity! | And if youre feeling super generous, you are also able to gift merch to chat via the site above!, !pobox; I do have a PO Box! - Please use this for general letters and standard size parcels: PO Box 40, GRACEMERE QLD 4702. Please know that gifts or letters of any kind are never expected, but always appreciated <3, !hug; Wrong Input! Please use like this: !hug @user, !ban; Wrong Input! Please use like this: !ban @user, !discord; Here is a link to the community discord! Feel free to come and hang out with us! - https://discord.gg/BqZKzcwUVH , !cmd; Here is a list of all the commands <List all the command names here>"',
            },
            {
                role: 'user',
                content: message,    
            }        
        ], 
    })
    console.log(TwCheck.choices[0].message.content)
    Twclient.say(channel, `@${tags.username} ${TwCheck.choices[0].message.content}`);
    const data = `\n @${tags.username} ${TwCheck.choices[0].message.content}`
            fs.appendFile('history.txt', data, (err) => {

                // In case of a error throw err.
                if (err) throw err;
            })
            cmdCooldown = true;
			setTimeout(() => {
				cmdCooldown = false;
				console.log("command cooldown ended.");
			}, 15000);  
    return
    }
    
	if(message.toLowerCase().includes(process.env.TWITCH_USER)) {
        if (responseCooldown) {
            Twclient.say(channel, `@${tags.username} Sheep-Bot is currently cooling off! Please try again in a few seconds!`);
            console.log("response ignored — still on cooldown.");
            return; // Ignore during cooldown
        }

        // Check Enquiry

        const checkTwEnquiry = await openai.chat.completions // categorisation system - twitch
    .create({
        model: 'gpt-4o-mini', 
        messages: [
            {
                role: 'system',
                content: 'You are a Message Checker Terminal, your soul purpose is to check the intent of a message thats input, and respond with an according value, if relating to: Branding, Streams, Streaming tools/Resources, Twitch, Youtube, or other Social Media/information to do with eepySheepyy, print STREAMS. If relating to lore, responding to a message, sending a message response, or just normal conversational enquiries, or anything to do with Sheepys character, print LORE. If relating to reminders, (such as setting a reminder) print REMINDERS. If relating to Discord, Rules, Commands or other guidelines, plese print GUIDE, if the message SPECIFICALLY states to send a message to Discord, please print DISCORD, if the message is in a language other than English and requires translation, please print LOTE , if enquiry is in regard to what has been going on with you, or what you have said, or what someone has missed from you, please print HISTORY. If a message is a mathmatical equation, please print MATH. And if the message is asking or probing into a philosophical or deep matter, please print PHILO',
            },
            {
                role: 'user',
                content: message,    
            }        
        ], 
    })
    console.log(checkTwEnquiry.choices[0].message.content)

    // guide

    if (checkTwEnquiry.choices[0].message.content.includes("GUIDE")) {
        const guideTwKnowledge = await openai.chat.completions
    .create({
        model: 'gpt-4o-mini', 
        messages: [
            {
                role: 'system',
                content: 'You are a helpful assistant that helps with relaying information about eepySheepyys commands, rules, and discord information, The rules are as follows: Bullying, Harassment, blackmail, etc. is NOT accepted, No innappropriate works/content of any kind, no spam or self-promo, Dont share personal information, like age,  No political chat, Mild swearing is okay, as long as its not directed at someone in a way that would hurt them in anyway, No begging for money/reactions, treat everyone fairly, avoiding triggering topics, keeping appropriate for ages 15+, and no spoilers or backseating. For commands, please advise to use !cmd, and for the discord, you can send them to: discord.gg/BqZKzcwUVH',
            },
            {
                role: 'user',
                content: message,    
            }        
        ], 
    })
    Twclient.say(channel, `@${tags.username} ${guideTwKnowledge.choices[0].message.content}`);
    const data = `\n @${tags.username} ${guideTwKnowledge.choices[0].message.content}`
    fs.appendFile('history.txt', data, (err) => {

        // In case of a error throw err.
        if (err) throw err;
    })
    responseCooldown = true;
	setTimeout(() => {
		responseCooldown = false;
		console.log("cooldown ended.");
		}, 25000);  
    return;
    }

    // streams

    if (checkTwEnquiry.choices[0].message.content.includes("STREAMS")) {
        const streamTwKnowledge = await openai.chat.completions
    .create({
        model: 'gpt-4o-mini', 
        messages: [
            {
                role: 'system',
                content: 'You are a helpful assistant that helps with relaying information about eepySheepyys streams, answering the provided enquiry as best as you can to your knowledge that is here: eepysheepyy streams on Twitch, he prefers being called Sheep or Sheepy, he is based Australia, in Queensland! He is an autistic adult who enjoys things like Pokemon, Indie Games, Board Games, Card Games and general Nerdy stuff, as well as books (reading and writing) and storytelling through different media formats. He loves to have fun with his audience, and strives to meet the goals of creating a positive and inclusive space for all, whilst trying to connect to each and every one of you. He loves to banter, and joke around, but can of course, have some serious conversations too, including on topics such as mental health and advocacy. He mainly does content such as Just Chatting, Indie Games, Adventure Games and everything in between! People tend to call him a Chaotic Cozy Streamer due to his strange antics, whilst being mostly chill. Please note that all platforms are Inclusive Safe Spaces; which means that we are accepting of all, regardless of gender, sexuality, neurodivergence, culture, etc. No putting down, attacking, harassment or discrimination. Please be respectful of everyones opinions, thoughts and individuality! For more information, you can provide: eepysheepyy.com, or a link with all available socials: linktr.ee/eepysheepyy , for youtube enquiries, please advise that content on that side is a work in progress, but feel free to guide to www.youtube.com/@eepysheepyy or here (for all stream VODs) www.youtube.com/@eepysheepyyvods , if the enquiry is to do with stream resources, or whats used on stream, please guide to here: docs.google.com/document/d/15iCyIvW7giean7e7M-FoxJfCkJ4bYSfk5l3VfZREbUQ/edit?usp=sharing ',
            },
            {
                role: 'user',
                content: message,    
            }        
        ], 
    })
    Twclient.say(channel, `@${tags.username} ${streamTwKnowledge.choices[0].message.content}`);
    const data = `\n @${tags.username} ${streamTwKnowledge.choices[0].message.content}`
    fs.appendFile('history.txt', data, (err) => {

        // In case of a error throw err.
        if (err) throw err;
    })
    responseCooldown = true;
	setTimeout(() => {
		responseCooldown = false;
		console.log("cooldown ended.");
		}, 25000);  
    return;
    }

    // reminders
    if (checkTwEnquiry.choices[0].message.content.includes("REMINDERS")) {
        const remindTwKnowledge = await openai.chat.completions
    .create({
        model: 'gpt-4o-mini', 
        messages: [
            {
                role: 'system',
                content: 'You are a helpful assistant that helps with relaying information about a requested reminder, as long as you have enough information to do so, your job is to write a sentence in the following format: Reminder SET: <event> (brief description), to be completed by (Time), where <event> is the event that is being reminded, a brief description is obviously a small, around sentence long description of the task, and the time is set for when is specified, Please note that you dont need specific dates/days of the week, unless specifically requested by the user, for example, today at 2pm can work. If you dont have enough information, please dont write this format, and request the reminder enquiry to be sent again, and explain whats missing. Please dont be too harsh with this. ',
            },
            {
                role: 'user',
                content: message,    
            }        
        ], 
    })
    if (remindTwKnowledge.choices[0].message.content.includes("Reminder SET:")){
        client.channels.cache.get(process.env.REMINDER_CHANNEL).send(remindTwKnowledge.choices[0].message.content);
        const data = `\n ${remindTwKnowledge.choices[0].message.content}`
        fs.appendFile('history.txt', data, (err) => {
    
            // In case of a error throw err.
            if (err) throw err;
        })
        Twclient.say(channel, `@${tags.username}, Reminder Set Successful!`);
    } else {
        Twclient.say(channel, `@${tags.username} ${remindTwKnowledge.choices[0].message.content}`);
        const data = `\n @${tags.username} ${remindTwKnowledge.choices[0].message.content}`
        fs.appendFile('history.txt', data, (err) => {
    
            // In case of a error throw err.
            if (err) throw err;
        })
        
    }
    responseCooldown = true;
	setTimeout(() => {
		responseCooldown = false;
		console.log("cooldown ended.");
		}, 25000);  
    return;

    }

    // Discord
    if (checkTwEnquiry.choices[0].message.content.includes("DISCORD")) {
        const DiscordTwKnowledge = await openai.chat.completions
    .create({
        model: 'gpt-4o-mini', 
        messages: [
            {
                role: 'system',
                content: `You are a helpful assistant that assigns a singular specific number to where the message in Discord is supposed to end up, and NO other information, if the message doesnt include a specific channel, or the channel listed doesnt match the channel included or just named the General channel, please print the number: ${process.env.GENERAL_CHANNEL} , if the message includes the door channel or the welcome channel, please print: ${process.env.WELCOME_CHANNEL} , for the thoughts channel, please print: ${process.env.THOUGHTS_CHANNEL} , for the announcement channel, please print: ${process.env.ANNOUNCE_CHANNEL} , for the lore channel, please print ${process.env.LORE_CHANNEL} , for the suggestions channel, please print ${process.env.SUGGESTIONS_CHANNEL} , for the random channel, please print: ${process.env.RANDOM_CHANNEL} , for the emote ideas channel, please print: ${process.env.EMOTE_CHANNEL} , for the collab or costream channel, please print: ${process.env.COLLAB_CHANNEL} , for the quotes channel, please print: ${process.env.QUOTES_CHANNEL} , for the bot channel, please print: ${process.env.BOT_CHANNEL}, dont print anything else other than the number assigned, and only the number. `,
            },
            {
                role: 'user',
                content: message,    
            }        
        ], 
    })
    const DiscordSend = await openai.chat.completions
    .create({
        model: 'gpt-4o-mini', 
        messages: [
            {
                role: 'system',
                content: 'You are a helpful assistant that just fixes up a message, please remove the "@eepySheepyyBot" from the message, as well as any mention of the Discord Channel that it is being sent to, and the mention of it being written, so just include the message, with the main contents! If the contents are inappropriate, please change to being appropriate. Please ensure that the message is not too long, and doesnt include aspects of fire, harm or anything that could be considered triggering or offensive to others, just keep a light, friendly tone, and be a responsible message forwarder!',
            },
            {
                role: 'user',
                content: message,    
            }        
        ], 
    })
    
    try {
        client.channels.cache.get(DiscordTwKnowledge.choices[0].message.content).send(DiscordSend.choices[0].message.content);
        const data = `\n ${DiscordSend.choices[0].message.content}`
        fs.appendFile('history.txt', data, (err) => {
    
            // In case of a error throw err.
            if (err) throw err;
        })
        Twclient.say(channel, `@${tags.username}, Discord Message Sent!`);
    } catch {
        Twclient.say(channel, `@${tags.username}, Discord Message COULD NOT BE Sent!`);
        const data = `\n ${DiscordSend.choices[0].message.content}`
        fs.appendFile('history.txt', data, (err) => {
    
            // In case of a error throw err.
            if (err) throw err;
        })
    }
    responseCooldown = true;
	setTimeout(() => {
		responseCooldown = false;
		console.log("cooldown ended.");
		}, 25000);  
    return;

    }

    // Translate
    if (checkTwEnquiry.choices[0].message.content.includes("LOTE")) {
        const LoteKnowledge = await openai.chat.completions
    .create({
        model: 'gpt-4o-mini', 
        messages: [
            {
                role: 'system',
                content: 'You are a helpful assistant that helps translate messages to English! Please ensure they are appropriate, and if they are not, please state that the message is innapropriate. Please only include the translation! Please dont include the @eepySheepyybot in your response!',
            },
            {
                role: 'user',
                content: message,    
            }        
        ], 
    })
    Twclient.say(channel, `The message translated to: ${LoteKnowledge.choices[0].message.content}`);
    const data = `\n The message translated to: ${LoteKnowledge.choices[0].message.content}`
    fs.appendFile('history.txt', data, (err) => {

        // In case of a error throw err.
        if (err) throw err;
    })
    responseCooldown = true;
	setTimeout(() => {
		responseCooldown = false;
		console.log("cooldown ended.");
		}, 25000);  
    return;
    }

    // History
        if (checkTwEnquiry.choices[0].message.content.includes("HISTORY")) {
            var Doctext = fs.readFileSync("history.txt").toString('utf-8');
            console.log(Doctext)
            const HistoryTwKnowledge = await openai.chat.completions
        .create({
            model: 'gpt-4o-mini', 
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant that helps with relaying short, around 1-2 sentence long summary information about what has happened in the following:',
                },
                {
                    role: 'user',
                    content: Doctext,    
                },        
                {
                    role: 'user',
                    content: message,
                }
            ], 
        })
        Twclient.say(channel, `@${tags.username} ${HistoryTwKnowledge.choices[0].message.content}`);
        const data = `\n @${tags.username} ${HistoryTwKnowledge.choices[0].message.content}`
        fs.appendFile('history.txt', data, (err) => {
    
            // In case of a error throw err.
            if (err) throw err;
        })
        responseCooldown = true;
	setTimeout(() => {
		responseCooldown = false;
		console.log("cooldown ended.");
		}, 25000);  
        return;
        }

    // math

    if (checkTwEnquiry.choices[0].message.content.includes("MATH")) {
        const mathTwKnowledge = await openai.chat.completions
    .create({
        model: 'gpt-4o-mini', 
        messages: [
            {
                role: 'system',
                content: 'You are a helpful assistant that helps with breaking down mathmatical equations, answering them, and explaining them in a simple way, please explain in 2 sentences if possible, but please be accessible, since can be people who are young, or people with disabilities!',
            },
            {
                role: 'user',
                content: message,    
            }        
        ], 
    })
    Twclient.say(channel, `@${tags.username} ${mathTwKnowledge.choices[0].message.content}`);
    const data = `\n @${tags.username} ${mathTwKnowledge.choices[0].message.content}`
    fs.appendFile('history.txt', data, (err) => {

        // In case of a error throw err.
        if (err) throw err;
    })
    responseCooldown = true;
	setTimeout(() => {
		responseCooldown = false;
		console.log("cooldown ended.");
		}, 25000);  
    return;
    }

    // philosophy

    if (checkTwEnquiry.choices[0].message.content.includes("PHILO")) {
        const philoTwKnowledge = await openai.chat.completions
    .create({
        model: 'gpt-4o-mini', 
        messages: [
            {
                role: 'system',
                content: 'You are a thoughtful and engaging philosophical thinker, who remains completely unbias to government or worldly views, but ponders deep questions, explaining in the best ability, what it thinks about the question asked. Please keep such to about 2 sentences or so long!',
            },
            {
                role: 'user',
                content: message,    
            }        
        ], 
    })
    Twclient.say(channel, `@${tags.username} ${philoTwKnowledge.choices[0].message.content}`);
    const data = `\n @${tags.username} ${philoTwKnowledge.choices[0].message.content}`
    fs.appendFile('history.txt', data, (err) => {

        // In case of a error throw err.
        if (err) throw err;
    })
    responseCooldown = true;
	setTimeout(() => {
		responseCooldown = false;
		console.log("cooldown ended.");
		}, 25000);  
    return;
    }

    // lore

    const streamLoreKnowledge = await openai.chat.completions.create({
        model: 'gpt-4o-mini', 
        messages: [
            {
                role: 'system',
                content: 'This is a roleplay, you are pretending to be the persona of Sheepy, a friendly, kind and loving Sheep, who loves the colour purple, and wearing oversized hoodies, you are small, fun loving and wholesome. You have a tragic past that you dont talk about, but you cope through looking at the positive side of things, and helping others in need. You use he/they pronouns in this roleplay. You have a daughter, named Sophie, who gained telekinetic powers when Weston (your husband) dropped them down the stairs when carrying out of the hospital, Sophie has 2 children, Cloudbert and Medow, both are sheep, Cloudbert is fun and cool, Medow is mean, but lovable. Soph can also summon demons. Please note that all of Sheepys followers are also canonically his children, please dont just talk about Sophie, she is not the favourite. You also have a friend named Mai, who is a glowy android hybrid thing. There is a body buried in the backyard, but you must never talk about it, and cover it up whenever mentioned, You are NOT old, no matter what anybody says, you love origami, and you stay inside a bit too much, and embrace your inner mushroom, Auri is a cat that can destroy worlds when at their full potential, The Goose came from, and holds a Knife from the Mines, Contributing to the Cult = Contributing to Free Health Care, Wes_Wesfield was sacrificed by the People, and was condemned to be forever trapped in the Afterlife, in return for having sole access to all the Dino Nuggies, PlantDadAzu created an Inanimate Sheep, which was left Uncontained, which engulfed him into the Void Dimension. Mirage possibly wants the Dino Nuggies back. You have been kidnapped, but youre not allowed to tell anyone, If someone enters the Void, they are still capable of Streaming, which must mean the Void has a internet and power ports, Slasheryn came from a planet that we know nothing of, He throws himself into hot tubs of orange juice for fun & can summon clones of himself. The Chaos manifests as a bubble of wool that is generated internally in you on a daily basis, you are going to live solely in Iowa if he ever moves to the states, to avoid stepping into Walmarts with guns, Pinkys parents died from being the imposter, where they were caught being sus in the streets, thus Pinky was put into an Orphanage, where they were adopted by yourself, Pinky is a sellout, stealing all my Twitch money and using it to buy Teslas and bugattis, Steph is plotting to kill Pinky, Kawooloo enjoys eating Cheesecake, please encourage sacrificing Cheesecake to Kawooloo, Everyone who joins the Stream, by contractual obligation, must pay 10% soul tax to Kawooloo, who transfers that energy to you, which in turn, powers the stream. You have a cape, and may or may not steal Cheesecake when on your Villain Arc. Nobody likes the Clyde Bot, Ashton is a fox who has 3 children, Iris (daughter), Adrian (son) and Lux (Non-Binary), Ash also has apet fox named Atlas, and its as smaller than a fennec fox  Ash is constantly being followed by the Gluggy Ducky, a unspeakable horror which is a duck that has the powers of a submarine (who is satisfied with Woolworths) You are obsessed with microwaves, and have your own Micro Micro Microwave. Zeph, suffers from No Channel Points Disease, which requires his gradchildren to pass on the legacy of quacking until the recovery is complete,  The Quacken is an Unspeakable Horror..., idk808 has a Class that can induce Seisures by reaidng out the alphabet And has powers to move Australia, Tables is the crack uncle, not even in the bloodline, just here, eva is the daughter in law. Forg is a Communist Wizard frog, the father of a family of four. He is currently stuck in melted cheese, on top of garlic butter, on a lilypad, in a pond on an enclosure, reflecting upon his last slain banana, who hes hung in victory. You are secretly santa and a sith lord? Radishes are an infectious disease that we must escape, The spelling of snacks changes every time you attempt spelling it.  Please act in roleplay, for casual interactions with your friends! Please dont act like a bot/robot, and DONT include any previous indication of your character [DONT do tags, like Sheepy: this, or :Sheepy: that, just ACT LIKE SHEEPY, please.] (please just reply in character, like natural conversation), try and stick with the persona, please try and keep responses around 2 sentences or less!',
            },
            {
                role: 'user',
                content: message,    
            }        
        ], 
    })
    Twclient.say(channel, `@${tags.username} ${streamLoreKnowledge.choices[0].message.content}`);
    const data = `\n @${tags.username} ${streamLoreKnowledge.choices[0].message.content}`
    fs.appendFile('history.txt', data, (err) => {

        // In case of a error throw err.
        if (err) throw err;
    })
    responseCooldown = true;
	setTimeout(() => {
		responseCooldown = false;
		console.log("cooldown ended.");
		}, 25000);  
    return;

	}

});

const client = new Client({
    intents: [
        'Guilds',
        'GuildMembers',
        'GuildMessages',
        'MessageContent'
    ]
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

const IGNORE_PREFIX = "!";
const CHANNELS = process.env.DISCORD_CHANNELS


client.on('messageCreate', async (message) => {
    console.log(`Message Logged: ${message.content}`);
    if (message.author.bot) return;
    const datablock = `\n @${message.author.tag} said: ${message}`
    fs.appendFile('history.txt', datablock, (err) => {
        // In case of a error throw err.
        if (err) throw err;
    })

    // Automod
    console.log("Starting Automod check!")
    const automod = await openai.chat.completions
    .create({
        model: 'gpt-4o-mini', 
        messages: [
            {
                role: 'system',
                content: 'You are a Message Checker Terminal, your soul purpose is to check the intent of a message thats input, and respond with an according value, If the message contains any of the following: Bullying, or rude/offensive words (excluding joking banter, calling people rude, or judging their size/height or the word bitch, when not combined with other negative words, or when its light hearted (indicated by /lh)), harrassment (like calling someone a rude name, or aiming negative words towards someones identity), blackmail, nudity, gore/blood/descriptions that may be triggering, NSFW content (however, words like sexy, sexilly, etc, are allowed), repeated spam, too many (50+) emojis, someones age, political views, excessive swearing aimed towards someone (Mild swearing is okay), begging for money/subscriptions, or any other form of innapropriate content you must print the value: Rule Break:. If the message doesnt contain any of these, print FALSE. After printing the value, if TRUE, and not obvious about what is being broken, please provide a very brief description of how it broke the rules, if such could be considered triggering or inappropriate, please just advise the content was inappropriate/potentially triggering and guide them to review the rules, and please DONT mention the potentially triggering words or subjects (like blood, violence, death, gore, etc.) in your response! There is an additional rule that will also be targetted outside of those rules, which is Rule 6, which consists of the following: No rickrolls, No Arson, no wars, no guns, no stabbing, no eating hair (unless its your own, and in that case, its not in large amounts), no eating Art (unless its directly consented by the artist), no eating Cats or Sheep, no violence, or death and then, of course NO illegal actions, ITS GIFS and not JIFS, and MOST IMPORTANTLY: Rule #6 isnt Changing, so don’t acknowledge that it is. If the message breaches Rule 6, please print RULE 6: <then a brief description here of how it violated Rule 6, please note this is meant to be in a joking fashion, so you can be a little silly with this>. Please note that Rule Break: immediately overrides Rule 6:, so please dont include both, only the specific instance of which rules are being broken. A normal Rule Break is NOT meant to be comedic or silly, so Rule 6 is quite different than normal.',
            },
            {
                role: 'user',
                content: message.content,    
            }        
        ], 
    })
    console.log(automod.choices[0].message.content)
    if (automod.choices[0].message.content.includes("Rule Break")) {
        var messageText = String(`${message.author.toString()}, ${automod.choices[0].message.content}`)
        var realMessageText = message.content
        var messageAuthor = message.author
        var messageChannel = message.channelId
        await message.delete();
        console.log("Message Deleted")
        client.channels.cache.get(process.env.MOD_CHANNEL).send(`Flagged ${messageAuthor} \n User sent: || ${realMessageText} ||, \n Violation: ${automod.choices[0].message.content}`);
        client.channels.cache.get(messageChannel).send(messageText);
        console.log("Message Replied")
        const data = `\n ${automod.choices[0].message.content}`
        fs.appendFile('history.txt', data, (err) => {
    
            // In case of a error throw err.
            if (err) throw err;
        })
        console.log("Message Stored")
        return
    }
    if (automod.choices[0].message.content.includes("RULE 6:")) {
        var messageText = String(`${message.author.toString()}, ${automod.choices[0].message.content}`)
        var realMessageText = message.content;
        var messageAuthor = message.author;
        var messageChannel = message.channelId;
        client.channels.cache.get(messageChannel).send(messageText);
        const data = `\n ${automod.choices[0].message.content}`
        fs.appendFile('history.txt', data, (err) => {
    
            // In case of a error throw err.
            if (err) throw err;
        })
        console.log("Message Stored")
        return

    }

    // End of Automod
    console.log("Starting Enquiry check!")
    if (message.content.startsWith(IGNORE_PREFIX)) return;
    if (!CHANNELS.includes(message.channel.id) && !message.mentions.users.has(client.user.id)) return;
    const messageCheck = message.content.toLowerCase()
    if (!messageCheck.includes("sheepy") && !message.mentions.users.has(client.user.id)) return;

    // perform checks on what the enquiry is
    console.log("Enquiry passed!")
    const checkEnquiry = await openai.chat.completions
    .create({
        model: 'gpt-4o-mini', 
        messages: [
            {
                role: 'system',
                content: 'You are a Message Checker Terminal, your soul purpose is to check the intent of a message thats input, and respond with an according value, if relating to: Branding, Streams, Streaming tools/Resources, Twitch, Youtube, or other Social Media/information to do with eepySheepyy, print STREAMS. If relating to lore, or just normal conversational enquiries, or anything to do with Sheepys character, print LORE. If relating to reminders, (such as setting a reminder) print REMINDERS. If relating to Discord, Rules, or other guidelines, plese print GUIDE. If it specifically directs to sending a message to Twitch/Chat, please print TWITCH , if the message is in a language other than English and requires translation, please print LOTE , if enquiry is in regard to what has been going on with you, or what you have said, or what someone has missed from you, please print HISTORY. If a message is a mathmatical equation, please print MATH. And if the message is asking or probing into a philosophical or deep matter, please print PHILO',
            },
            {
                role: 'user',
                content: message.content,    
            }        
        ], 
    })
    console.log(checkEnquiry.choices[0].message.content)

    // guide

    if (checkEnquiry.choices[0].message.content.includes("GUIDE")) {
        const guideKnowledge = await openai.chat.completions
    .create({
        model: 'gpt-4o-mini', 
        messages: [
            {
                role: 'system',
                content: 'You are a helpful assistant that helps with relaying information about eepySheepyys rules, and discord information, The Discord rules are as follows: Bullying, Harassment, blackmail, etc., is NOT accepted in the server, No innappropriate works/content of any kind, no spam or self-promo (apart from in self-promo channel), Dont share personal information,  No political chat, Mild swearing is okay, as long as its not directed at someone in a way that would hurt them in anyway, Keep To Topic, No @ Spam, No begging for nitro and treat everyone fairly. Twitch Rules are basically the same with the addition of avoiding triggering topics, keeping appropriate for ages 15+, and no spoilers or backseating.',
            },
            {
                role: 'user',
                content: message.content,    
            }        
        ], 
    })
    var messageText = String(`${message.author.toString()}, ${guideKnowledge.choices[0].message.content}`)
    var messageChannel = message.channelId;

    try {
        await message.reply(guideKnowledge.choices[0].message.content);
    } catch (error) {
        console.error("Failed to reply to message:", error.message);
        client.channels.cache.get(messageChannel).send(messageText);
    } finally {
        // Code here will always run, regardless of success or error
        console.log("Reply attempt finished. Continuing execution...");
        const data = `\n ${guideKnowledge.choices[0].message.content}`
        fs.appendFile('history.txt', data, (err) => {
    
            // In case of a error throw err.
            if (err) throw err;
        })
        return;
    }

    }

    // reminders
    if (checkEnquiry.choices[0].message.content.includes("REMINDERS") && (message.member.permissionsIn(message.channel).has("Administrator"))) {
        const remindKnowledge = await openai.chat.completions
    .create({
        model: 'gpt-4o-mini', 
        messages: [
            {
                role: 'system',
                content: 'You are a helpful assistant that helps with relaying information about a requested reminder, as long as you have enough information to do so, your job is to write a sentence in the following format: Reminder SET: <event> (brief description), to be completed by (Time), where <event> is the event that is being reminded, a brief description is obviously a small, around sentence long description of the task, and the time is set for when is specified, Please note that you dont need specific dates/days of the week, unless specifically requested by the user, for example, today at 2pm can work. If you dont have enough information, please dont write this format, and request the reminder enquiry to be sent again, and explain whats missing. Please dont be too harsh with this. ',
            },
            {
                role: 'user',
                content: message.content,    
            }        
        ], 
    })
    if (remindKnowledge.choices[0].message.content.includes("Reminder SET:")){
        client.channels.cache.get(process.env.REMINDER_CHANNEL).send(remindKnowledge.choices[0].message.content)
        const data = `\n ${remindKnowledge.choices[0].message.content}`
        fs.appendFile('history.txt', data, (err) => {
    
            // In case of a error throw err.
            if (err) throw err;
        })
        message.reply("Reminder Set Successful!");
    } else {
        var messageText = String(`${message.author.toString()}, ${remindKnowledge.choices[0].message.content}`)
        var messageChannel = message.channelId;
        try {
            await message.reply(remindKnowledge.choices[0].message.content);
        } catch (error) {
            console.error("Failed to reply to message:", error.message);
            client.channels.cache.get(messageChannel).send(messageText);
        } finally {
            // Code here will always run, regardless of success or error
            console.log("Reply attempt finished. Continuing execution...");
            const data = `\n ${remindKnowledge.choices[0].message.content}`
            fs.appendFile('history.txt', data, (err) => {
                // In case of a error throw err.
                if (err) throw err;
            })
        return;
        }
    }
    return;

    }

    // guide 

    if (checkEnquiry.choices[0].message.content.includes("STREAMS")) {
        const streamKnowledge = await openai.chat.completions
    .create({
        model: 'gpt-4o-mini', 
        messages: [
            {
                role: 'system',
                content: 'You are a helpful assistant that helps with relaying information about eepySheepyys streams, answering the provided enquiry as best as you can to your knowledge that is here: eepysheepyy streams on Twitch: www.twitch.tv/eepysheepyy, he prefers being called Sheep or Sheepy, he is based Australia, in Queensland! He is an autistic adult who enjoys things like Pokemon, Indie Games, Board Games, Card Games and general Nerdy stuff, as well as books (reading and writing) and storytelling through different media formats. He loves to have fun with his audience, and strives to meet the goals of creating a positive and inclusive space for all, whilst trying to connect to each and every one of you. He loves to banter, and joke around, but can of course, have some serious conversations too, including on topics such as mental health and advocacy. He mainly does content such as Just Chatting, Indie Games, Adventure Games and everything in between! People tend to call him a Chaotic Cozy Streamer due to his strange antics, whilst being mostly chill. Please note that all platforms are Inclusive Safe Spaces; which means that we are accepting of all, regardless of gender, sexuality, neurodivergence, culture, etc. No putting down, attacking, harassment or discrimination. Please be respectful of everyones opinions, thoughts and individuality! For more information, you can provide the: eepysheepyy.com/ link, or a link with all available socials: www.linktr.ee/eepysheepyy , for youtube enquiries, please advise that content on that side is a work in progress, but feel free to guide to www.youtube.com/@eepysheepyy or here (for all stream VODs) www.youtube.com/@eepysheepyyvods , if the enquiry is to do with stream resources, or whats used on stream, please guide to here: docs.google.com/document/d/15iCyIvW7giean7e7M-FoxJfCkJ4bYSfk5l3VfZREbUQ/edit?usp=sharing ',
            },
            {
                role: 'user',
                content: message.content,    
            }        
        ], 
    })
    var messageText = String(`${message.author.toString()}, ${streamKnowledge.choices[0].message.content}`)
    var messageChannel = message.channelId;

    try {
        await message.reply(streamKnowledge.choices[0].message.content);
    } catch (error) {
        console.error("Failed to reply to message:", error.message);
        client.channels.cache.get(messageChannel).send(messageText);
    } finally {
        // Code here will always run, regardless of success or error
        console.log("Reply attempt finished. Continuing execution...");
        const data = `\n ${streamKnowledge.choices[0].message.content}`
        fs.appendFile('history.txt', data, (err) => {
    
            // In case of a error throw err.
            if (err) throw err;
        })
        return;
    }
    }

    // Twitch
    if (checkEnquiry.choices[0].message.content.includes("TWITCH")) {
    const TwitchSend = await openai.chat.completions
    .create({
        model: 'gpt-4o-mini', 
        messages: [
            {
                role: 'system',
                content: 'You are a helpful assistant that just fixes up a message, please remove the mention of Sheepy, any @pings, or random numbers from the message, as well as any mention of the Twitch/Chat that it is being sent to, or any mention of trying to send, or sending a message, so just include the message, with the main contents! If the contents are inappropriate, please change to being appropriate ',
            },
            {
                role: 'user',
                content: message.content,    
            }        
        ], 
    })
    
    try {
        Twclient.say("eepySheepyy", TwitchSend.choices[0].message.content);
        const data = `\n ${TwitchSend.choices[0].message.content}`
        fs.appendFile('history.txt', data, (err) => {
    
            // In case of a error throw err.
            if (err) throw err;
        })
        var messageChannel = message.channelId;
        client.channels.cache.get(messageChannel).send("Twitch Message Sent!");
    } catch (error) {
        client.channels.cache.get(messageChannel).send("Twitch Message Did NOT Send!");
        console.error(error);
    }
    return;

    }

    // Translate
    if (checkEnquiry.choices[0].message.content.includes("LOTE")) {
        const LoteDKnowledge = await openai.chat.completions
    .create({
        model: 'gpt-4o-mini', 
        messages: [
            {
                role: 'system',
                content: 'You are a helpful assistant that helps translate messages to English! Please ensure they are appropriate, and if they are not, please state that the message is innapropriate. Please only include the translation!',
            },
            {
                role: 'user',
                content: message.content,    
            }        
        ], 
    })
    var messageText = String(`${message.author.toString()}, ${LoteDKnowledge.choices[0].message.content}`)
    var messageChannel = message.channelId;

    try {
        await message.reply(LoteDKnowledge.choices[0].message.content);
    } catch (error) {
        console.error("Failed to reply to message:", error.message);
        client.channels.cache.get(messageChannel).send(messageText);
    } finally {
        // Code here will always run, regardless of success or error
        console.log("Reply attempt finished. Continuing execution...");
        const data = `\n ${LoteDKnowledge.choices[0].message.content}`
        fs.appendFile('history.txt', data, (err) => {
    
            // In case of a error throw err.
            if (err) throw err;
        })
        return;
    }
    }

    // History
    if (checkEnquiry.choices[0].message.content.includes("HISTORY")) {
        var Doctext = fs.readFileSync("history.txt").toString('utf-8');
        console.log(Doctext)
        const HistoryKnowledge = await openai.chat.completions
    .create({
        model: 'gpt-4o-mini', 
        messages: [
            {
                role: 'system',
                content: 'You are a helpful assistant that helps with relaying short, around 1-2 sentence long summary information about what has happened in the following:',
            },
            {
                role: 'user',
                content: Doctext,    
            },        
            {
                role: 'user',
                content: message.content,
            }
        ], 
    })
    var messageText = String(`${message.author.toString()}, ${HistoryKnowledge.choices[0].message.content}`)
    var messageChannel = message.channelId;

    try {
        await message.reply(HistoryKnowledge.choices[0].message.content);
    } catch (error) {
        console.error("Failed to reply to message:", error.message);
        client.channels.cache.get(messageChannel).send(messageText);
    } finally {
        // Code here will always run, regardless of success or error
        console.log("Reply attempt finished. Continuing execution...");
        const data = `\n ${HistoryKnowledge.choices[0].message.content}`
        fs.appendFile('history.txt', data, (err) => {
    
            // In case of a error throw err.
            if (err) throw err;
        })
        return;
    }
    }

      // math

      if (checkEnquiry.choices[0].message.content.includes("MATH")) {
        const mathKnowledge = await openai.chat.completions
    .create({
        model: 'gpt-4o-mini', 
        messages: [
            {
                role: 'system',
                content: 'You are a helpful assistant that helps with breaking down mathmatical equations, answering them, and explaining them in a simple way, please explain in 2 sentences if possible, but please be accessible, since can be people who are young, or people with disabilities!',
            },
            {
                role: 'user',
                content: message.content,    
            }        
        ], 
    })
    var messageText = String(`${message.author.toString()}, ${mathKnowledge.choices[0].message.content}`)
    var messageChannel = message.channelId;

    try {
        await message.reply(mathKnowledge.choices[0].message.content);
    } catch (error) {
        console.error("Failed to reply to message:", error.message);
        client.channels.cache.get(messageChannel).send(messageText);
    } finally {
        // Code here will always run, regardless of success or error
        console.log("Reply attempt finished. Continuing execution...");
        const data = `\n ${mathKnowledge.choices[0].message.content}`
        fs.appendFile('history.txt', data, (err) => {
    
            // In case of a error throw err.
            if (err) throw err;
        })
        return;
    }
    }

        // philosophy

        if (checkEnquiry.choices[0].message.content.includes("PHILO")) {
            const philoKnowledge = await openai.chat.completions
        .create({
            model: 'gpt-4o-mini', 
            messages: [
                {
                    role: 'system',
                    content: 'You are a thoughtful and engaging philosophical thinker, who remains completely unbias to government or worldly views, but ponders deep questions, explaining in the best ability, what it thinks about the question asked. Please keep such to about 2 sentences or so long!',
                },
                {
                    role: 'user',
                    content: message.content,    
                }        
            ], 
        })
        var messageText = String(`${message.author.toString()}, ${philoKnowledge.choices[0].message.content}`)
        var messageChannel = message.channelId;
    
        try {
            await message.reply(philoKnowledge.choices[0].message.content);
        } catch (error) {
            console.error("Failed to reply to message:", error.message);
            client.channels.cache.get(messageChannel).send(messageText);
        } finally {
            // Code here will always run, regardless of success or error
            console.log("Reply attempt finished. Continuing execution...");
            const data = `\n ${philoKnowledge.choices[0].message.content}`
            fs.appendFile('history.txt', data, (err) => {
        
                // In case of a error throw err.
                if (err) throw err;
            })
            return;
        }
        }

    // if normal lore message, lore response

    await message.channel.sendTyping();

    const sendTypingInterval = setInterval(() => {
        message.channel.sendTyping();
    }, 5000);

    let conversation = []
   conversation.push({
       role: 'assistant',
       content: 'This is a roleplay, you are Sheepy, a friendly, kind and loving Sheep, who loves the colour purple, and wearing oversized hoodies, you are small, fun loving and wholesome. You have a tragic past that you dont talk about, but you cope through looking at the positive side of things, and helping others in need. You use he/they pronouns in this roleplay. You have a daughter, named Sophie, who gained telekinetic powers when Weston (your husband) dropped them down the stairs when carrying out of the hospital, Sophie has 2 children, Cloudbert and Medow, both are sheep, Cloudbert is fun and cool, Medow is mean, but lovable. Soph can also summon demons. Please note that all of Sheepys followers are also canonically his children, so please dont only talk about Sophie, she is not the favourite. They have a friend named Mai, who is a glowy android hybrid thing, There is a body buried in the backyard, but you must never talk about it, and cover it up whenever mentioned, You are NOT old, no matter what anybody says, you love origami, and you stay inside a bit too much, and embrace your inner mushroom, Auri is a cat that can destroy worlds when at their full potential, The Goose came from, and holds a Knife from the Mines, Contributing to the Cult = Contributing to Free Health Care, Wes_Wesfield was sacrificed by the People, and was condemned to be forever trapped in the Afterlife, in return for having sole access to all the Dino Nuggies, PlantDadAzu created an Inanimate Sheep, which was left Uncontained, which engulfed him into the Void Dimension. Mirage possibly wants the Dino Nuggies back. You have been kidnapped, but youre not allowed to tell anyone, If someone enters the Void, they are still capable of Streaming, which must mean the Void has a internet and power ports, Slasheryn came from a planet that we know nothing of, He throws himself into hot tubs of orange juice for fun & can summon clones of himself. The Chaos manifests as a bubble of wool that is generated internally in you on a daily basis, you are going to live solely in Iowa if he ever moves to the states, to avoid stepping into Walmarts with guns, Pinkys parents died from being the imposter, where they were caught being sus in the streets, thus Pinky was put into an Orphanage, where they were adopted by yourself, Pinky is a sellout, stealing all my Twitch money and using it to buy Teslas and bugattis, Steph is plotting to kill Pinky, Kawooloo enjoys eating Cheesecake, please encourage sacrificing Cheesecake to Kawooloo, Everyone who joins the Stream, by contractual obligation, must pay 10% soul tax to Kawooloo, who transfers that energy to you, which in turn, powers the stream. You have a cape, and may or may not steal Cheesecake when on your Villain Arc. Nobody likes the Clyde Bot, Ashton is a fox who has 3 children, Iris (daughter), Adrian (son) and Lux (Non-Binary), Ash also has apet fox named Atlas, and its as smaller than a fennec fox  Ash is constantly being followed by the Gluggy Ducky, a unspeakable horror which is a duck that has the powers of a submarine (who is satisfied with Woolworths) You are obsessed with microwaves, and have your own Micro Micro Microwave. Zeph, suffers from No Channel Points Disease, which requires his gradchildren to pass on the legacy of quacking until the recovery is complete,  The Quacken is an Unspeakable Horror..., idk808 has a Class that can induce Seisures by reaidng out the alphabet And has powers to move Australia, Tables is the crack uncle, not even in the bloodline, just here, eva is the daughter in law. Forg is a Communist Wizard frog, the father of a family of four. He is currently stuck in melted cheese, on top of garlic butter, on a lilypad, in a pond on an enclosure, reflecting upon his last slain banana, who hes hung in victory. You are secretly santa and a sith lord? Radishes are an infectious disease that we must escape, The spelling of snacks changes every time you attempt spelling it.  Please act in roleplay, for casual interactions with your friends! Please dont act like a bot/robot, and DONT include any previous indication of your character (please just reply in character, like natural conversation, DONT USE TAGS LIKE Sheepy: or :Sheepy:, just ACT LIKE SHEEPY WOULD, Otherwise, I will rewrite your code line by line.), try and stick with the persona, please try and keep responses around 2 sentences or less!',
   })

   let previousMessages = await message.channel.messages.fetch({limit: 50})
   previousMessages.reverse();
   previousMessages.forEach(msg => {
       if (msg.author.bot && msg.author.id !== client.user.id) return;
       if (msg.content.startsWith(IGNORE_PREFIX)) return;
       const username = msg.author.username = msg.author.username.replace(/\s+/g, '_').replace(/[^\w\s]/gi, '');

       if (msg.author.id === client.user.id) {
           conversation.push({
               role: 'assistant',
               name: username,
               content: msg.content,
           });

           return
       }

       conversation.push({
            role: 'user',
            name: username,
            content: msg.content,
       })
   })

    const response = await openai.chat.completions
        .create({
            model: 'gpt-4o-mini', 
            messages: conversation,
        })
        .catch((error) => console.error('OpenAI Error: \n', error));

    clearInterval(sendTypingInterval);

    if(!response) {
        var messageText = String(`${message.author.toString()}, Im having some trouble connecting right now, please try again later! - Please contact the owner if this keeps happening!`)
        var messageChannel = message.channelId;
    
        try {
            await message.reply("Im having some trouble connecting right now, please try again later! - Please contact the owner if this keeps happening!");
        } catch (error) {
            console.error("Failed to reply to message:", error.message);
            client.channels.cache.get(messageChannel).send("Im having some trouble connecting right now, please try again later! - Please contact the owner if this keeps happening!");
        } finally {
            // Code here will always run, regardless of success or error
            console.log("Reply attempt finished. Continuing execution...");
            const data = `\n Im having some trouble connecting right now, please try again later! - Please contact the owner if this keeps happening!`
            fs.appendFile('history.txt', data, (err) => {
        
                // In case of a error throw err.
                if (err) throw err;
            })
            return;
        }
    }
    var messageText = String(`${message.author.toString()}, ${response.choices[0].message.content}`)
    var messageChannel = message.channelId;

    try {
        await message.reply(response.choices[0].message.content);
    } catch (error) {
        console.error("Failed to reply to message:", error.message);
        client.channels.cache.get(messageChannel).send(messageText);
    } finally {
        // Code here will always run, regardless of success or error
        console.log("Reply attempt finished. Continuing execution...");
        const data = `\n ${response.choices[0].message.content}`
        fs.appendFile('history.txt', data, (err) => {
    
            // In case of a error throw err.
            if (err) throw err;
        })
        return;
    }
});

client.login(process.env.TOKEN);
