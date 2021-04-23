/**
 * Build the manifest.json in chrome extension directory via this file
 * 
 * @author zhy
 * @since 0.0.1
 */
const { version, author, homepage } = require('../package.json')
module.exports = {
    name: '相关法律法规',
    description: "谁还没点精神洁癖咋滴？",
    version,
    author,
    homepage_url: homepage,
    manifest_version: 2,
    browser_action: {
        default_icon: "static/images/icon.png",
        default_title: "违禁词管理"
    },
    icons: {
        16: "static/images/icon.png",
        48: "static/images/icon.png",
        128: "static/images/icon.png"
    },
    background: {
        scripts: ['background.js'],
        persistent: false
    },
    content_scripts: [
        {
            "matches": [
                "<all_urls>"
            ],
            "js": [
                "content_scripts.js"
            ],
            "run_at": "document_start"
        }
    ],
    permissions: [
        'storage',
        'tabs',
    ]
}