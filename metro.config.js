// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Auttaa Metron "package exports" -resolvausta
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = [
  "require",
  "react-native",
  "development",
];

// Alias: pakotetaan tslib:n ES6 build (ei modules/index.js)
const ALIASES = {
  tslib: "tslib/tslib.es6.js",
};

config.resolver.resolveRequest = (context, moduleName, platform) => {
  return context.resolveRequest(
    context,
    ALIASES[moduleName] ?? moduleName,
    platform
  );
};

module.exports = config;
