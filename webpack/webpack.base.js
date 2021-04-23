const path = require('path')
const GenerateJsonPlugin = require('generate-json-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

// Generate json files 
const manifest = require('../src/manifest')
const generateJsonPlugins = [new GenerateJsonPlugin('manifest.json', manifest)]

const optionGenerator = (outputPath, manifestHooker) => {
    manifestHooker && manifestHooker(manifest)
    const plugins = [
        ...generateJsonPlugins,
        // copy static resources
        new CopyWebpackPlugin({
            patterns: [
                { from: path.join(__dirname, '..', 'public'), to: path.join(outputPath, 'static') }
            ]
        })
    ]
    return {
        entry: {
            content_scripts: './src/content-script',
            app: './src/app/main',
            background: './src/background'
        },
        output: {
            filename: '[name].js',
        },
        plugins,
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    exclude: '/node_modules/',
                    use: ['ts-loader']
                },
                {
                    test: /\.tsx$/,
                    exclude: '/node_modules/',
                    use: [
                        'babel-loader',
                        'ts-loader'
                    ]
                },
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"],
                }, {
                    test: /\.scss$/,
                    use: ['style-loader', 'css-loader', 'sass-loader']
                }, {
                    test: /\.(jpg|jpeg|png|woff|woff2|eot|ttf|svg)$/,
                    // exclude: /node_modules/,
                    use: ['url-loader?limit=100000']
                }, {
                    test: /\.m?js$/,
                    exclude: /(node_modules)/,
                }
            ]
        },
        resolve: {
            extensions: [".tsx", '.ts', ".js", '.css', '.scss'],
        }
    }
}


module.exports = optionGenerator