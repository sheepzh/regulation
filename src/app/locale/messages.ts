import { Messages } from "@util/i18n"
import dictMessages, { DictMessage } from './components/dict'
import itemMessages, { ItemMessage } from './components/item'
import menuMessages, { MenuMessage } from './components/menu'
import settingMessages, { SettingMessage } from './components/setting'
import chromeAppMessages, { AppMessage as ChromeAppMessage } from "@util/i18n/components/app"
import restoreMessages, { RestoreMessage } from "@util/i18n/components/restore"

export type AppMessage = {
    menu: MenuMessage
    dict: DictMessage
    item: ItemMessage
    app: ChromeAppMessage
    setting: SettingMessage
    restore: RestoreMessage
}

const _default: Messages<AppMessage> = {
    zh_CN: {
        app: chromeAppMessages.zh_CN,
        menu: menuMessages.zh_CN,
        dict: dictMessages.zh_CN,
        item: itemMessages.zh_CN,
        setting: settingMessages.zh_CN,
        restore: restoreMessages.zh_CN
    },
    en: {
        app: chromeAppMessages.en,
        menu: menuMessages.en,
        dict: dictMessages.en,
        item: itemMessages.en,
        setting: settingMessages.en,
        restore: restoreMessages.en
    }
}

export default _default