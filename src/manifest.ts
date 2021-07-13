/**
 * Build the manifest.json in chrome extension directory via this file
 * 
 * @author zhy
 * @since 0.0.1
 */
//@ts-ignore
import { version, author, homepage } from '../package.json'
const manifest = {
    name: '__MSG_app_name__',
    description: "__MSG_app_description__",
    version,
    author,
    default_locale: 'en',
    homepage_url: homepage,
    manifest_version: 2,
    browser_action: {
        default_icon: "static/images/icon.png",
        default_title: "__MSG_app_iconTitle__"
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
            "run_at": "document_start",
            "all_frames": true
        }
    ],
    permissions: [
        'storage'
    ]
}

export default manifest