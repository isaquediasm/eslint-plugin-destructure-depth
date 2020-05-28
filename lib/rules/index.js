module.exports.rules = {
  'max-depth': require('./rules/max-destructure-path'),
};

module.exports.configs = {
  recommended: {
    rules: {
      'destructure-depth/max-depth': 2,
    },
  },
};
