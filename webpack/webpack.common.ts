import path from 'path'
import GenerateJsonPlugin from 'generate-json-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import webapck from 'webpack'

import manifest from '../src/manifest'

const optionGenerator = (outputPath: string, manifestHooker?: (manifest: any) => void) => {
    manifestHooker && manifestHooker(manifest)
    const plugins: webapck.WebpackPluginInstance[] = [
        // Generate json files 
        new GenerateJsonPlugin('manifest.json', manifest) as unknown as webapck.WebpackPluginInstance,
        // copy static resources
        new CopyWebpackPlugin({
            patterns: [
                { from: path.join(__dirname, '..', 'public'), to: path.join(outputPath, 'static') }
            ]
        }) as webapck.WebpackPluginInstance
    ]
    const config: webapck.Configuration = {
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
    return config
}


export default optionGenerator