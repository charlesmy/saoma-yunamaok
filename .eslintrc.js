/** @format */

module.exports = {
    extends: ['taro/react', 'plugin:prettier/recommended'],
    plugins: ['@typescript-eslint'],
    rules: {
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',
        'import/no-commonjs': 'off',
        'react/sort-comp': 'off',
        '@typescript-eslint/no-unused-vars': 'error',
    },
}
