module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint'
    },
    env: {
        browser: true,
    },
    extends: [
        'plugin:vue/essential',
        'standard'
    ],
    plugins: [
        'vue'
    ],
    rules: {
        'generator-star-spacing': 'off',
        'no-console': 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        // 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'indent': 'off',
        'vue/script-indent': [
            'error',
            4,
            {
                'baseIndent': 1
            }
        ]
    }
}
