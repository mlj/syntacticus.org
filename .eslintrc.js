// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  extends: 'airbnb-base',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // check if imports actually resolve
  'settings': {
    'import/resolver': {
      'webpack': {
        'config': 'build/webpack.base.conf.js'
      }
    }
  },
  // add your custom rules here
  'rules': {
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      'js': 'never',
      'vue': 'never'
    }],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      'optionalDependencies': ['test/unit/index.js']
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,

    // FIXME: eliminate (some of) these smells when time permits
    'arrow-body-style': 0,
    'object-shorthand': 0,
    'max-len': 0,
    'no-unused-vars': 0,
    'semi': 0,
    'comma-dangle': 0,
    'arrow-parens': 0,
    'no-trailing-spaces': 0,
    'quotes': 0,
    'no-console': 0,
    'prefer-template': 0,
    'no-param-reassign': 0,

    'no-restricted-syntax': 0,
    'prefer-const': 0,
    'vars-on-top': 0,
    'no-var': 0,
    'curly': 0,
    'guard-for-in': 0,
    'no-else-return': 0,
    'no-plusplus': 0,
    'space-before-function-paren': 0,
    'func-names': 0,
    'no-prototype-builtins': 0,
    'spaced-comment': 0,
    'func-names': 0,
    'no-undef': 0,
    'prefer-arrow-callback': 0,
    'no-useless-concat': 0,
    'object-property-newline': 0,
    'no-mixed-operators': 0,
    'no-loop-func': 0,
  }
}
