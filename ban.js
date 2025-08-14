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
