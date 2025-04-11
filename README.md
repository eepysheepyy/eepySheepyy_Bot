# eepySheepyy_Bot
A javascript based GPT bot that syncs across Twitch, Discord and OBS Websockets!

## Longer summary:

This is an ongoing project to eventually be a replacement for all 3rd party bots on my channel, so I can have full, customisable control of everything that happens, and comes into the stream, and other platforms. It has auto-mod capabilities, message reactivity, cross-platform integrations and much more planned for the future! 

## Requirements:

node.js - https://nodejs.org/en

dotenv - https://www.npmjs.com/package/dotenv

discord.js - https://www.npmjs.com/package/discord.js

- A discord application for your bot-user: https://discord.com/developers/applications

openai - https://www.npmjs.com/package/openai

- An Open AI Key: https://platform.openai.com/

tmi.js - https://www.npmjs.com/package/tmi.js

- An extra Twitch account for your bot user
- OAuth Token - Can be generated: https://twitchtokengenerator.com/

obs-websocket-js - https://www.npmjs.com/package/obs-websocket-js

- OBS Websocket Server - To setup the OBS Websockets side, (which is not essential) you can navigate to the Websockets setting inside OBS, and set a password if you haven't already, keep the port the same.

The Addon (only needed if using the OBS version before the OBS Websocket Update) https://obsproject.com/forum/resources/obs-websocket-remote-control-obs-studio-using-websockets.466/


## How to run: 

- Install packages above using npm/other installer
- Using env.txt as a layout, create a .env file, replacing the values with actual API keys, or respective information as explained in the file.
- run using node ~path/index.js

## Functionality: 

### Discord:

- Discord Basic Functionality - Reads and Creates Messages
- Discord Automod - AI Checks messages, deletes if innapropriate, and sends a follow up message to clarify rules, also sends follow up message to a moderator chat.
- Discord Message Reaction - AI will respond to message when bot user is Pinged, or if it's keyword is mentioned in specific channels.
- Discord Message Intent - AI checks and categorises a message based on it's intent.
- Discord Reminders - Sends reminder message to specific channel for follow up.
- Discord to Twitch - Can send a Discord message to be sent to Twitch.
- Memory from Twitch/Discord Link - Memory is recorded in history.txt, and AI accesses this and summarises. This history is reset every half hour to preserve storage.
- Rule 6 'Moderation' - There is a sub-set of Automod which jokingly reacts to messages that breach rule 6.

### Twitch:
- Twitch Basic Functionality - Reads and Creates Messages
- Twitch Message Reaction - AI will respond to message when bot user is Pinged
- Twitch Commands - If not a set of commands that require different interactions, AI will power text based commands.
- Twitch Message Intent: AI checks and categorises a message based on it's intent.
- Twitch Reminders - Same functionality as above, just on Twitch to write to Discord
- Twitch to Discord - Can send a Twitch message to be sent to Discord.
- Translation - Auto-translation for localisation.
- Memory from Twitch/Discord Link - Memory is recorded in history.txt, and AI accesses this and summarises. This history is reset every half hour to preserve storage.

### OBS:
- Links to OBS Websockets, OBS Functions independently from the rest of the bot
- Websockets respond to Commands 

---------

# Planning Phase 2 - Planning to Work on over April

- Unlurk Powers - Will be re-added, with hopefully a little flair, and maybe some Discord interactions (?)
- Websockets interact with Stagify - Will be rebuilt, it is a quite complex system which will take me a bit to reconstruct on a different language!

---------

### Planning Phase 3

Phase 3 expands upon the Twitch-Bot functionality, but this requires learning Twitch API, which is, by the looks of things, quite complex, I've also had 0 experience with it, so this will be in the future, hopefully by the middle of the year.

Planning on focusing on:

- Twitch Welcoming users to the stream.
- Twitch Alerts firing on OBS without 3rd party
- Twitch Automod
- The Rule 6 Game - Will be rebuilt, it is a quite complex system which will take me a bit to reconstruct on a different language!


## Links

You can find my website is https://eepysheepyy.com/

And uou can find my Twitch here: https://www.twitch.tv/eepysheepyy

You can feel free to check out all my other socials and stuff here: https://linktr.ee/eepysheepyy

I hope you all have a BAA-Rilliant Day <33


## Update Notes: 

V2.0.1: 
- Added a !connect command for personal use to attempt reconnection to OBS whilst allowing continuation of the rest of the script
- Tweaked some GPT prompts to add specifications
- Added Rule 6 Moderation on Discord - Messages will not be deleted, but will be alerted for breaking rule 6.

V2.0.2:
- !lurk now only registers once, and cannot be used multiple times by the same person
- Added an !unlurk command that removes one's lurk status, note this doesn't work when someone has not lurked. 
- Messages from users are now logged in Sheepy's memory for better context for 'history' categorisation, please note that history still has a span of half an hour, to preserve file space and privacy

V2.0.3:
- Tweaked some prompts to be a bit more specific, so that categorisation can be more correct
- Seperated the !gpt command from the rest of the commands due to ongoing issues with such command
- Added Twitch cooldowns for all commands and Sheepy-Bot Responses
- Added a !raid and !feedback command
- Added a Math and Philosophy Categorisation
- Added Husband Wall functionality
