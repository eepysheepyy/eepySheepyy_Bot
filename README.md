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
- OAuth Token

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

- Rule 6 'Moderation' - There will be a sub-set of Automod which will jokingly react to messages that breach rule 6.
- The Rule 6 Game - Will be rebuilt, it is a quite complex system which will take me a bit to reconstruct on a different language!
- Unlurk Powers - Will be re-added, with hopefully a little flair, and maybe some Discord interactions (?)
- Websockets interact with Stagify - Will be rebuilt, it is a quite complex system which will take me a bit to reconstruct on a different language!

---------

### Planning Phase 3

Phase 3 expands upon the Twitch-Bot functionality, but this requires learning Twitch API, which is, by the looks of things, quite complex, I've also had 0 experience with it, so this will be in the future, hopefully by the middle of the year.

Planning on focusing on:

- Twitch Welcoming users to the stream.
- Twitch Alerts firing on OBS without 3rd party
- Twitch Automod


## Links

You can find my website is https://eepysheepyy.com/

And uou can find my Twitch here: https://www.twitch.tv/eepysheepyy

You can feel free to check out all my other socials and stuff here: https://linktr.ee/eepysheepyy

I hope you all have a BAA-Rilliant Day <33
