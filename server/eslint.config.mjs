import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
    { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
    pluginJs.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 'latest',
            globals: {
                ...globals.commonjs,
                ...globals.es2021,
                ...globals.node,
                ...globals.jest,
            },
        },
    },
];
