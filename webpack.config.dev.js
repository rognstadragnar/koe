import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

export default {
    devtools: 'eval-source-map',
    entry: [
        'webpack-hot-middleware/client',
        path.join(__dirname, '/client/index.jsx')
    ],
    output: {
        path: '/',
        publicPath: '/',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                include: [
                    path.join(__dirname, 'client'),
                    path.join(__dirname, 'server')
                ],
                loaders: [ 'react-hot', 'babel' ]
            },
            {
                test: /\.jsx$/,
                include: [
                    path.join(__dirname, 'client'),
                    path.join(__dirname, 'server')
                ],
                loaders: [ 'react-hot', 'babel' ]
            },
            {
                test: /\.scss$/,
                include: [
                    path.join(__dirname, '/client/styles')
                ],
                loaders: [/*ExtractTextPlugin.extract("sass", "css", "style" )*/ "style", "css", "sass"]
            }
        ]
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin(path.join(__dirname, 'main.css'))
    ],
    resolve: {
        extensions: [ '', '.jsx', '.js', '.scss', '.pug']
    }
}