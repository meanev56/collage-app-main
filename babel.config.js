module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'], // ← keep this if you're using Expo
    // or ['module:metro-react-native-babel-preset'] if bare RN

    plugins: [
      // ← add this line
      'react-native-reanimated/plugin',
    ],
  };
};