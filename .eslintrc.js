module.exports = {
    parser: 'babel-eslint',
    env: {
        commonjs: true,
        es6: true,
        node: true,
        mocha: true,
    },
    extends: [
        'airbnb-base',
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
        ecmaVersion: 2018,
    },
    rules: {
        'semi': 'off',
        'indent': [
            'error',
            4,
            {
                SwitchCase: 1
            },
        ],
        'object-curly-newline': 'off',
        'no-console': 'off',
    },
    overrides: [
        {
            files: '*.spec.js',
            rules: {
                'no-unused-expressions': 'off'
            }
        }
    ]
}
