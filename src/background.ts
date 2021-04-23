import { IS_FIREFOX } from "./util/constant/environment"

chrome.browserAction.onClicked.addListener((_tab: chrome.tabs.Tab) => {
    // FireFox use 'static' as prefix
    const url = IS_FIREFOX ? 'app.html' : 'static/app.html'
    chrome.tabs.create({ url })
})
