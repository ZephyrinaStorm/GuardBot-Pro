require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, Events, PermissionsBitField } = require('discord.js');

// --- Bot Configuration ---
const SPAM_THRESHOLD = 5; // 5 messages
const SPAM_TIMEFRAME = 5000; // in 5 seconds
const token = process.env.DISCORD_BOT_TOKEN;

if (!token) {
  console.error("Error: DISCORD_BOT_TOKEN not found. Please add it to your Replit Secrets.");
  process.exit(1);
}

// --- Client Setup ---
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// --- Command Handling ---
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

// --- Anti-Spam Cache ---
const userMessageTimestamps = new Map();

// --- Event Listeners ---

// Bot Ready Event
client.once(Events.ClientReady, readyClient => {
  console.log(`✅ Ready! Logged in as ${readyClient.user.tag}`);
  console.log(`🤖 Bot is active in ${client.guilds.cache.size} servers.`);
});

// Interaction (Slash Command) Event
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
});

// Message Create Event (for passive protection)
client.on(Events.MessageCreate, async message => {
  if (message.author.bot || !message.guild) return;

  // --- Anti-Link Protection ---
  // TODO: Add a check here to see if anti-link is enabled for this server via database
  const linkRegex = /(https?:\/\/[^\s]+)|(discord\.gg\/[^\s]+)/gi;
  if (linkRegex.test(message.content)) {
    // Allow admins to post links
    if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;

    try {
      await message.delete();
      const warning = await message.channel.send(`${message.author}, links are not allowed here.`);
      setTimeout(() => warning.delete(), 5000);
      // TODO: Log this action to the database as a moderation event
    } catch (error) {
      console.error("Failed to delete a link message:", error);
    }
    return; // Stop processing after deleting
  }

  // --- Blacklisted Word Protection ---
  // TODO: Fetch blacklisted words from the database for this server
  const blacklistedWords = ['examplebadword1', 'examplebadword2']; // Placeholder
  const hasBlacklistedWord = blacklistedWords.some(word => message.content.toLowerCase().includes(word));
  if (hasBlacklistedWord) {
     if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;
    try {
      await message.delete();
      const warning = await message.channel.send(`${message.author}, your message contained a blacklisted term.`);
      setTimeout(() => warning.delete(), 5000);
      // TODO: Log this action to the database
    } catch (error) {
      console.error("Failed to delete a blacklisted word message:", error);
    }
    return;
  }

  // --- Anti-Spam Protection ---
  // TODO: Add a check here to see if anti-spam is enabled for this server via database
  if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;

  const now = Date.now();
  const userTimestamps = userMessageTimestamps.get(message.author.id) || [];
  const relevantTimestamps = userTimestamps.filter(timestamp => now - timestamp < SPAM_TIMEFRAME);
  
  relevantTimestamps.push(now);
  userMessageTimestamps.set(message.author.id, relevantTimestamps);

  if (relevantTimestamps.length > SPAM_THRESHOLD) {
    try {
      // Mute the user, delete messages, or take other action
      await message.channel.bulkDelete(SPAM_THRESHOLD);
      const warning = await message.channel.send(`${message.author}, you are sending messages too quickly! Please slow down.`);
      // TODO: Log this action and potentially apply a mute via the database
      userMessageTimestamps.delete(message.author.id); // Reset after action
      setTimeout(() => warning.delete(), 10000);
    } catch (error) {
      console.error("Failed to take anti-spam action:", error);
    }
  }
});

// --- Bot Login ---
client.login(token);
Step 4: Create the Command Deployment Script
This script is run once (or whenever you change commands) to tell Discord about your slash commands.

File: deploy-commands.js

require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  // Grab all the command files from the commands directory you created earlier
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN);

// and deploy your commands!
(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
      { body: commands },
    );

    console.log(`✅ Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
Step 5: Create the Command Files
Moderation Commands
File: commands/moderation/ban.js

const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bans a user from the server.')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('The user to ban')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('The reason for the ban')
        .setRequired(false)),
  async execute(interaction) {
    const target = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return interaction.reply({ content: 'You do not have permission to ban members.', ephemeral: true });
    }

    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
        return interaction.reply({ content: 'I do not have permission to ban members.', ephemeral: true });
    }

    try {
      await interaction.guild.members.ban(target, { reason });
      // TODO: Save this action to the database as a ModerationCase
      await interaction.reply({ content: `Successfully banned ${target.tag} for: ${reason}` });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: `Failed to ban ${target.tag}.`, ephemeral: true });
    }
  },
};
