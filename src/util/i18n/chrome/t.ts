import { router, ChromeMessage } from "./messages"

export const keyPathOf = (key: (root: ChromeMessage) => string) => key(router)

// Bug of chrome： 
// chrome.i18n.getMessage may not work in background
// @see https://stackoverflow.com/questions/6089707/calling-chrome-i18n-getmessage-from-a-content-script
export const t2Chrome = (key: (root: ChromeMessage) => string) => chrome.i18n.getMessage(keyPathOf(key))