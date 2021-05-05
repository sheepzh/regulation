function openAppPage() {
    const url = 'static/app.html'
    chrome.tabs.create({ url })
}

chrome.browserAction.onClicked.addListener(openAppPage)

chrome.runtime.onInstalled.addListener(details => details.reason === 'install' && openAppPage())