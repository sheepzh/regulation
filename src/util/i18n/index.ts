export type Locale = 'zh_CN' | 'en'

const FEEDBACK_LOCALE: Locale = 'en'

export const defaultLocale: Locale = 'zh_CN'

export type Messages<T> = {
    [key in Locale]: T
}

// Standardize the locale code according to the Chrome locale code
const chrome2I18n: { [key: string]: Locale } = {
    'zh-CN': 'zh_CN',
    'zh-TW': 'zh_CN',
    'en-US': 'en',
    'en-GB': 'en',
    'en': 'en',
}

/**
 * Codes returned by getUILanguage() are defined by Chrome browser
 * @see https://src.chromium.org/viewvc/chrome/trunk/src/third_party/cld/languages/internal/languages.cc 
 * But supported locale codes in Chrome extension
 * @see https://developer.chrome.com/docs/webstore/i18n/#localeTable
 * 
 * They are different, so translate
 */
const chromeLocale2ExtensionLocale: (chromeLocale: string) => Locale = (chromeLocale: string) => {
    if (!chromeLocale) {
        return defaultLocale
    }
    return chrome2I18n[chromeLocale] || FEEDBACK_LOCALE
}

export const locale = chromeLocale2ExtensionLocale(chrome.i18n.getUILanguage())

export function getI18nVal<MessageType>(messages: MessageType, keyPath: I18nKey<MessageType>): string {
    const result = keyPath(messages)
    return typeof result === 'string' ? result : JSON.stringify(result)
}

export type TranslateProps<MessageType> = {
    key: I18nKey<MessageType>,
    param?: { [key: string]: string | number }
}

/**
 * Translate
 * @param key     keyPath 
 * @param param   param
 * @returns string or VNodes[]
 */
export function t<MessageType>(messages: MessageType, props: TranslateProps<MessageType>): string {
    const { key, param } = props
    let result: string = getI18nVal(messages, key)
    if (param) {
        for (const [key, value] of Object.entries(param)) {
            result = (result as string).replace(`{${key}}`, value.toString())
        }
    }
    return result
}

export type I18nKey<MessageType> = (messages: MessageType) => any
