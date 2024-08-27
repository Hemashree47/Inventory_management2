const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'development', // or 'production' depending on your needs
    entry: './src/index.js', // or your entry file
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
    },
    resolve: {
        fallback: {
            "buffer": require.resolve("buffer/"),
            "crypto": require.resolve("crypto-browserify"),
            "stream": require.resolve("stream-browserify"),
            "util": require.resolve("util/")
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react', '@babel/preset-env'],
                    },
                },
            },
            // Add other loaders as needed
        ],
    },
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        compress: true,
        port: 3000,
    },
};
