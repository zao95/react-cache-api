const path = require('path')

module.exports = {
    entry: {
        index: './src/index.js',
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'index.js',
        library: ['useCacheApi', 'CacheApiConfig'],
        libraryTarget: 'commonjs2',
        globalObject: 'this',
    },
    externals: {
        react: 'commonjs react',
        'react-dom': 'commonjs react-dom',
    },
}
