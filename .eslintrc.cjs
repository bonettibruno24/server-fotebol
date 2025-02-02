const config = {
  root: true,
  env: {
    browser: true,
    es2024: true
  },
  extends: [
    'prettier',
    'next/typescript',
    'plugin:testing-library/react',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:tailwindcss/recommended',
    'plugin:react/jsx-runtime'
  ],
  plugins: ['prettier', 'testing-library'],
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    'prettier/prettier': 'error'
  }
}

module.exports = config
