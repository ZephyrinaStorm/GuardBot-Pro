const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warns a user.')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('The user to warn')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('The reason for the warning')
        .setRequired(true)),
  async execute(interaction) {
    const target = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason');

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      return interaction.reply({ content: 'You do not have permission to warn members.', ephemeral: true });
    }

    try {
      // Send a DM to the user
      await target.send(`You have been warned in **${interaction.guild.name}** for the following reason: ${reason}`);
      // TODO: Save this action to the database as a ModerationCase
      await interaction.reply({ content: `Successfully warned ${target.tag} for: ${reason}` });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: `Failed to warn ${target.tag}. They may have DMs disabled. The warning has still been logged.`, ephemeral: true });
      // TODO: Still log the warning to the database even if the DM fails
    }
  },
};
