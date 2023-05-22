function openAppPage() {
    const url = 'static/app.html'
    chrome.tabs.create({ url })
}

chrome.action.onClicked.addListener(openAppPage)

chrome.runtime.onInstalled.addListener(details => details.reason === 'install' && openAppPage())