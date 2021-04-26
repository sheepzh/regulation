import { IS_FIREFOX } from "./util/constant/environment"

function openAppPage() {
    // FireFox use 'static' as prefix
    const url = IS_FIREFOX ? 'app.html' : 'static/app.html'
    chrome.tabs.create({ url })
}

chrome.browserAction.onClicked.addListener(openAppPage)

chrome.runtime.onInstalled.addListener(details => details.reason === 'install' && openAppPage())