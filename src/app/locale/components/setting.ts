import { Messages } from "@util/i18n"

export type SettingMessage = {
    restoreLabel: string
}

const _default: Messages<SettingMessage> = {
    zh_CN: {
        restoreLabel: '勾选该开关，界面右下角会出现【{buttonText}】按钮，点击之后页面里的安全词将还原成违禁词。'
    },
    en: {
        restoreLabel: 'The button [{buttonText}] will display at the right bottom corner of pages if this switch is on.'
    }
}

export default _default