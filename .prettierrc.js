module.exports = {
  semi: false,
  singleQuote: true,
  arrowParens: true,
  useTabs: false,
  printWidth: 80,
  tabWidth: 2,
  trailingComma: 'es5',
  jsxBracketSameLine: false,
  arrowParens: 'avoid',
  quoteProps: 'as-needed',
  bracketSpacing: true,
  addTrailingCommas: false,
  preferHashLabels: false,
  preferSingleQuotes: true,
  overrides: [
    {
      files: ['**/webpack.*.js'],
      options: {
        quoteProps: 'consistent',
        preferSingleQuotes: false,
      },
    },
  ],
}
