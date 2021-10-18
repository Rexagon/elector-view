import path from 'path';
import webpack from "webpack";
import {Configuration as DevServerConfiguration} from "webpack-dev-server";
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

type WebpackConfig = webpack.Configuration & { devServer?: DevServerConfiguration };

export default (_: any, options: any): WebpackConfig => {
    const HOST = process.env.HOST ?? 'localhost';
    const PORT = parseInt(process.env.PORT ?? '3000', 10);

    const isProduction = options.mode === 'production';
    const isDevelopment = options.mode === 'development';

    const config: WebpackConfig = {};

    config.entry = {
        index: path.resolve(__dirname, 'src/index.tsx')
    };

    config.output = {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name]-[contenthash:6].js',
        publicPath: '/',
        clean: true,
    };

    config.optimization = isDevelopment ? {
        splitChunks: {
            cacheGroups: {
                default: false,
                vendors: false,
            },
        },
    } : {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    chunks: 'all',
                    name: 'vendors',
                    test: /(?<!node_modules.*)[\\/]node_modules[\\/]/,
                    priority: 40,
                    enforce: true,
                },
                common: {
                    name: 'commons',
                    test: /(common|layout|hooks|misc)/,
                    minChunks: 1,
                    priority: 30,
                    reuseExistingChunk: true,
                },
                default: false,
                vendors: false,
            },
            maxInitialRequests: 10,
            minSize: 30000,
        },
    };

    config.plugins = [];
    if (isDevelopment) {
        config.plugins.push(new webpack.HotModuleReplacementPlugin());
    }
    config.plugins.push(new HtmlWebpackPlugin({
        title: 'Elector View',
        template: 'public/index.html',
        filename: path.resolve(__dirname, 'dist/index.html'),
        inject: false
    }));
    if (isProduction) {
        config.plugins.push(new MiniCssExtractPlugin({
            filename: 'css/[name]-[contenthash:6].css',
            ignoreOrder: true,
        }));
    }

    config.module = {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
                type: 'asset/resource',
            },
        ]
    };

    config.resolve = {
        alias: {
            '@': path.resolve(__dirname, 'src')
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts', '.scss', '.css'],
        modules: [
            path.resolve(__dirname, 'src'),
            'node_modules',
        ]
    };

    if (isDevelopment) {
        config.devtool = 'inline-source-map';
    }

    if (isDevelopment) {
        config.devServer = {
            host: HOST,
            port: PORT,
            static: [
                path.join(__dirname + '/dist'),
            ],
            historyApiFallback: true,
        };

        config.watchOptions = {
            aggregateTimeout: 5,
            ignored: /node_modules/,
            poll: true,
        };
    }

    config.stats = 'summary';

    return config;
}
