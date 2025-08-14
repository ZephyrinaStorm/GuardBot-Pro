const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const ms = require('ms'); // You may need to run "npm install ms"

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mod')
    .setDescription('Advanced moderation commands.')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ModerateMembers)
    .addSubcommand(subcommand =>
      subcommand
        .setName('mute')
        .setDescription('Mutes a user for a specified duration.')
        .addUserOption(option => option.setName('target').setDescription('The user to mute').setRequired(true))
        .addStringOption(option => option.setName('duration').setDescription('Duration (e.g., 10m, 1h, 7d)').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for the mute').setRequired(false)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('unmute')
        .setDescription('Unmutes a user.')
        .addUserOption(option => option.setName('target').setDescription('The user to unmute').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for the unmute').setRequired(false)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('unban')
        .setDescription('Unbans a user from the server.')
        .addStringOption(option => option.setName('user-id').setDescription('The ID of the user to unban').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for the unban').setRequired(false)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('purge')
        .setDescription('Deletes a specified number of messages from a channel.')
        .addIntegerOption(option => option.setName('amount').setDescription('Number of messages to delete (2-100)').setRequired(true).setMinValue(2).setMaxValue(100))),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (!interaction.inGuild()) {
        return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
    }

    // --- Mute Command ---
    if (subcommand === 'mute') {
      const target = interaction.options.getMember('target');
      const durationStr = interaction.options.getString('duration');
      const reason = interaction.options.getString('reason') || 'No reason provided.';
      const durationMs = ms(durationStr);

      if (!durationMs) {
        return interaction.reply({ content: 'Invalid duration format. Use formats like "10m", "1h", "7d".', ephemeral: true });
      }
      if (!target.moderatable) {
        return interaction.reply({ content: 'I cannot mute this user. They may have a higher role than me.', ephemeral: true });
      }

      try {
        await target.timeout(durationMs, reason);
        // TODO: Save this action to the ModerationCase entity in the database.
        await interaction.reply({ content: `Successfully muted ${target.user.tag} for ${durationStr}. Reason: ${reason}` });
      } catch (error) {
        console.error('Mute error:', error);
        await interaction.reply({ content: 'Failed to mute the user.', ephemeral: true });
      }
    }

    // --- Unmute Command ---
    else if (subcommand === 'unmute') {
      const target = interaction.options.getMember('target');
      const reason = interaction.options.getString('reason') || 'No reason provided.';

      if (!target.moderatable) {
        return interaction.reply({ content: 'I cannot unmute this user.', ephemeral: true });
      }

      try {
        await target.timeout(null, reason); // Setting timeout to null removes it
        // TODO: Save this action to the ModerationCase entity in the database.
        await interaction.reply({ content: `Successfully unmuted ${target.user.tag}. Reason: ${reason}` });
      } catch (error) {
        console.error('Unmute error:', error);
        await interaction.reply({ content: 'Failed to unmute the user.', ephemeral: true });
      }
    }

    // --- Unban Command ---
    else if (subcommand === 'unban') {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
        return interaction.reply({ content: 'You do not have permission to unban members.', ephemeral: true });
      }
      const userId = interaction.options.getString('user-id');
      const reason = interaction.options.getString('reason') || 'No reason provided.';

      try {
        await interaction.guild.members.unban(userId, reason);
        // TODO: Save this action to the ModerationCase entity in the database.
        await interaction.reply({ content: `Successfully unbanned user with ID \`${userId}\`.` });
      } catch (error) {
        console.error('Unban error:', error);
        await interaction.reply({ content: 'Failed to unban user. Make sure the ID is correct and the user is banned.', ephemeral: true });
      }
    }

    // --- Purge Command ---
    else if (subcommand === 'purge') {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
        return interaction.reply({ content: 'You do not have permission to purge messages.', ephemeral: true });
      }
      const amount = interaction.options.getInteger('amount');

      try {
        await interaction.channel.bulkDelete(amount, true); // true filters messages older than 14 days
        await interaction.reply({ content: `Successfully deleted ${amount} messages.`, ephemeral: true });
      } catch (error) {
        console.error('Purge error:', error);
        await interaction.reply({ content: 'Failed to purge messages. I may not have permission or the messages are too old.', ephemeral: true });
      }
    }
  },
};
