module.exports =
{
  "parser": "@typescript-eslint/parser",
  "extends": [
    "react-app",
    // "plugin:prettier/recommended",
    // "prettier/@typescript-eslint",
    // "prettier/babel",
    // "prettier/react"
  ],
  "plugins": [
    "@typescript-eslint",
    "import",
    "jsx-a11y",
    // "prettier",
    "react",
    "react-hooks"
  ],
  "rules": {
    "no-use-before-define": "off",
    // "prettier/prettier": "error",
    "no-restricted-imports": [
      "error",
      {
        "paths": [
          {
            "name": "@material-ui/core",
            "importNames": ["makeStyles", "createMuiTheme"],
            "message": "Please import from @material-ui/core/styles instead. See https://material-ui.com/guides/minimizing-bundle-size/#option-2 for more information"
          }
        ]
      }
    ],
    "no-redeclare": "off",
    // "@typescript-eslint/no-redeclare": ["error"],
    //********
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/type-annotation-spacing': 'off',
    '@typescript-eslint/consistent-type-imports': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    '@typescript-eslint/array-type': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-shadow': 'off',
    '@typescript-eslint/camelcase': 'off',
    //********
    // "": "off",
    'react/prop-types': 'off',
    'eslint-comments/disable-enable-pair': 'off',
    'import/no-cycle': 'off',
    'import/no-mutable-exports': 'off',
    'import/prefer-default-export': 'off',
    'import/no-anonymous-default-export': 'off',
    'no-useless-escape': 'off',
    'no-param-reassign': 'off',
    'no-var': 'off',
    'prefer-rest-params': 'off',
    'no-use-before-define': 'off',
    //********
    // "": "off",
    'no-console': 'off',
    'space-before-function-paren': 'off',
    'no-unused-expressions': 'off',
    'prefer-const': 'off',
    'func-names': 'off',
    'global-require': 'off',
    'no-trailing-spaces': 'off',
    'operator-linebreak': 'off',
    'eslint-comments': 'off',
  }
}
