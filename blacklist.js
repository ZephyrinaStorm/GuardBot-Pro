const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('blacklist')
    .setDescription('Manages the server blacklist.')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Add an item to the blacklist.')
        .addStringOption(option =>
          option.setName('type')
            .setDescription('The type of item to blacklist')
            .setRequired(true)
            .addChoices(
              { name: 'Word', value: 'word' },
              { name: 'User', value: 'user' },
              { name: 'Domain', value: 'domain' }
            ))
        .addStringOption(option =>
          option.setName('value')
            .setDescription('The value to blacklist (e.g., a word, user ID, or domain.com)')
            .setRequired(true))
        .addStringOption(option =>
          option.setName('reason')
            .setDescription('Reason for blacklisting')
            .setRequired(false)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Remove an item from the blacklist.')
        .addStringOption(option =>
          option.setName('type')
            .setDescription('The type of item to remove')
            .setRequired(true)
            .addChoices(
              { name: 'Word', value: 'word' },
              { name: 'User', value: 'user' },
              { name: 'Domain', value: 'domain' }
            ))
        .addStringOption(option =>
          option.setName('value')
            .setDescription('The value to remove from the blacklist')
            .setRequired(true))),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const type = interaction.options.getString('type');
    const value = interaction.options.getString('value');
    const reason = interaction.options.getString('reason') || 'No reason provided.';

    if (subcommand === 'add') {
      // TODO: Add logic to save this to the Blacklist entity in your database
      await interaction.reply({ content: `Successfully added \`${value}\` to the **${type}** blacklist.`, ephemeral: true });
    } else if (subcommand === 'remove') {
      // TODO: Add logic to remove this from the Blacklist entity in your database
      await interaction.reply({ content: `Successfully removed \`${value}\` from the **${type}** blacklist.`, ephemeral: true });
    }
  },
};
