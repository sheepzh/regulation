import { Messages } from ".."

export type RestoreMessage = {
    restoreButton: string
    hideButton: string
}

const _default: Messages<RestoreMessage> = {
    zh_CN: {
        restoreButton: '显示违禁词',
        hideButton: '替换违禁词'
    },
    en: {
        restoreButton: 'Restore words',
        hideButton: 'Replace words'
    }
}

export default _default