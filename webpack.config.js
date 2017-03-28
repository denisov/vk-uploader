var path = require('path')
var webpack = require('webpack')

module.exports = {
    //entry: ['./app/main.js'],

    entry: {
        'dist/build': './app/main.js',
        'bundle': './main.js'
    },
    // output: {
    //     path: path.resolve(__dirname, './dist'),
    //     filename: 'build.js'
    // },
    output: {
        path: './',
        filename: '[name].js'
    },

    module: {
        loaders: [
            {
                test: /\.coffee$/,
                use: [ 'coffee-loader' ]
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015'],
                    plugins: ['transform-runtime']
                }
            }
        ]
    },

    plugins: [
        new webpack.ExternalsPlugin('commonjs', [
            'electron'
        ]),
        new webpack.IgnorePlugin(/cls-bluebird/, /request-promise/)
    ],

    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.common.js'
        }
    },
    "target": "node",
    node: {
        __dirname: false,
        __filename: false
    }
};