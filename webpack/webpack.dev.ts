import path from 'path'
import GenerateJsonPlugin from 'generate-json-webpack-plugin'
import FileManagerWebpackPlugin from 'filemanager-webpack-plugin'
import optionGenerator from './webpack.common'
import webpack from 'webpack'

const outputDir = path.resolve(__dirname, '..', 'dist_dev')

let manifest: any

const options = optionGenerator(
    outputDir,
    baseManifest => {
        baseManifest['name'] = 'IS DEV'
        manifest = baseManifest
    }
)

const manifestFirefoxName = 'manifest-firefox.json'
// The manifest.json is different from Chrome's with add-on ID
const firefoxManifestGeneratePlugin = new GenerateJsonPlugin(manifestFirefoxName,
    { ...manifest, browser_specific_settings: { gecko: { id: 'timer@zhy' } } }
) as unknown as webpack.WebpackPluginInstance
if (options.plugins) {
    options.plugins.push(firefoxManifestGeneratePlugin)
    const firefoxDevDir = path.join(__dirname, '..', 'firefox_dev')
    // Generate FireFox dev files
    options.plugins.push(
        new FileManagerWebpackPlugin({
            events: {
                onEnd: [
                    {
                        copy: [{ source: outputDir, destination: firefoxDevDir }],
                        delete: [path.join(outputDir, manifestFirefoxName), path.join(firefoxDevDir, 'manifest.json')],
                        move: [{ source: path.join(firefoxDevDir, manifestFirefoxName), destination: path.join(firefoxDevDir, 'manifest.json') }]
                    }
                ]
            }
        }) as webpack.WebpackPluginInstance)
}

options.output && (options.output.path = outputDir)

// no eval with development, but generate *.map.js
options.devtool = 'cheap-module-source-map'

// Use cache with filesystem
options.cache = { type: 'filesystem' }

export default options