import { Messages } from ".."

export type AppMessage = {
    name: string
    description: string
    iconTitle: string
}

/**
 * Use for chrome
 */
const _default: Messages<AppMessage> = {
    en: {
        name: 'Hammer - Word Replacer',
        description: 'Replace disliked words with other words or asterisks',
        iconTitle: 'Dictionary Management'
    },
    zh_CN: {
        name: '相关法律法规',
        description: '谁还能没点精神洁癖？我可以把你不想看见的词替换词其他词。',
        iconTitle: '违禁词管理'
    }
}

export default _default