module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      ["module:react-native-dotenv"],
      [
        "module-resolver",
        {
          alias: {
            components: "./src/Components",
            views: "./src/Views",
            hooks: "./src/Hooks",
            helpers: "./helpers",
            icons: "./icons",
            assets: "./assets",
            context: "./context",
            constants: "./constants",
            gql: "./gql",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
