import { Messages } from "@util/i18n"

export type MenuMessage = {
    dictionary: string
    setting: string
}

const _default: Messages<MenuMessage> = {
    zh_CN: {
        dictionary: '违禁词管理',
        setting: '扩展设置'
    },
    en: {
        dictionary: 'Dictionary',
        setting: 'Setting'
    }
}

export default _default