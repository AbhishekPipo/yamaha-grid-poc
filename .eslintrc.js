module.exports = {
  root: true,
  env: {
    node: true,
    "vitest/globals": true, // Add this line to recognize Vitest globals
    "browser": true,

  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    "plugin:vitest/recommended" // If you installed the vitest plugin

  ],
  "plugins": ["vitest"],
  "rules": {
    // Your custom rules
  }
}
