const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('protection')
    .setDescription('Configures the server\'s protection settings.')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .addSubcommand(subcommand =>
      subcommand
        .setName('anti-link')
        .setDescription('Enable or disable the anti-link filter.')
        .addBooleanOption(option => option.setName('enabled').setDescription('Set to true to enable, false to disable.').setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('anti-spam')
        .setDescription('Enable or disable the anti-spam filter.')
        .addBooleanOption(option => option.setName('enabled').setDescription('Set to true to enable, false to disable.').setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('anti-raid')
        .setDescription('Enable or disable anti-raid mode.')
        .addBooleanOption(option => option.setName('enabled').setDescription('Set to true to enable, false to disable.').setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('anti-nuke')
        .setDescription('Enable or disable protection against server nuking attempts.')
        .addBooleanOption(option => option.setName('enabled').setDescription('Set to true to enable, false to disable.').setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('anti-scam')
        .setDescription('Enable or disable the AI-powered anti-scam filter.')
        .addBooleanOption(option => option.setName('enabled').setDescription('Set to true to enable, false to disable.').setRequired(true))),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const enabled = interaction.options.getBoolean('enabled');
    const status = enabled ? 'Enabled' : 'Disabled';

    // TODO: Here you would find the ProtectionConfig for interaction.guild.id in your database
    // and update the corresponding field (e.g., 'antiLink', 'antiSpam') to the 'enabled' value.

    try {
      // Example: await ProtectionConfig.update({ serverId: interaction.guild.id }, { [subcommand]: enabled });
      await interaction.reply({
        content: `✅ Successfully **${status}** the **${subcommand}** protection module.`,
        ephemeral: true
      });
    } catch (error) {
      console.error(`Failed to update protection status for ${subcommand}:`, error);
      await interaction.reply({
        content: `❌ Failed to update the **${subcommand}** setting. Please try again later.`,
        ephemeral: true
      });
    }
  },
};
