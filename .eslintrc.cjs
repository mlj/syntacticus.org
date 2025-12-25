module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-unused-vars': 0,
    'no-prototype-builtins': 0,
    'vue/multi-word-component-names': 0,
    'vue/no-use-v-if-with-v-for': 0,
    'vue/require-v-for-key': 0,
    'vue/valid-v-for': 0,
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],
};
