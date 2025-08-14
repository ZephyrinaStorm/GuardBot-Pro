const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kicks a user from the server.')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('The user to kick')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('The reason for the kick')
        .setRequired(false)),
  async execute(interaction) {
    const target = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return interaction.reply({ content: 'You do not have permission to kick members.', ephemeral: true });
    }
    
    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.KickMembers)) {
        return interaction.reply({ content: 'I do not have permission to kick members.', ephemeral: true });
    }

    try {
      await interaction.guild.members.kick(target, { reason });
      // TODO: Save this action to the database as a ModerationCase
      await interaction.reply({ content: `Successfully kicked ${target.tag} for: ${reason}` });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: `Failed to kick ${target.tag}.`, ephemeral: true });
    }
  },
};
