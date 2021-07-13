import path from 'path'
import GenerateJsonPlugin from 'generate-json-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import webpack from 'webpack'
import i18nChrome from '../src/util/i18n/chrome'

import manifest from '../src/manifest'

const optionGenerator = (outputPath: string, manifestHooker?: (manifest: any) => void) => {
    manifestHooker && manifestHooker(manifest)
    const plugins: webpack.WebpackPluginInstance[] = [
        // Generate json files 
        new GenerateJsonPlugin('manifest.json', manifest) as unknown as webpack.WebpackPluginInstance,
        // copy static resources
        new CopyWebpackPlugin({
            patterns: [
                { from: path.join(__dirname, '..', 'public'), to: path.join(outputPath, 'static') }
            ]
        }) as webpack.WebpackPluginInstance
    ]

    const localeJsonArr = Object.entries(i18nChrome)
        .map(([locale, message]) => new GenerateJsonPlugin(`_locales/${locale}/messages.json`, message))
        .map(plugin => plugin as unknown as webpack.WebpackPluginInstance)
    plugins.push(...localeJsonArr)

    const config: webpack.Configuration = {
        entry: {
            content_scripts: './src/content-script',
            app: './src/app',
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