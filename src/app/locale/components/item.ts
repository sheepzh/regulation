import { Messages } from "@util/i18n"

export type ItemMessage = {
    name: string
    wordCount: string
    scope: string
    scopeResult: {
        all: string
        some: string
    }
    scopeType: { [type in XGFLFG.ScopeType]: string },
    useRegSuffix: string
    remark: string
    enabled: string
    operation: string
    words: string
    word: {
        original: string
        mask: string
    }
    priority: string
}

const _default: Messages<ItemMessage> = {
    zh_CN: {
        name: '名称',
        wordCount: '词汇数量',
        scope: '生效范围',
        scopeResult: {
            all: '全部网站',
            some: '部分网站'
        },
        scopeType: {
            url: '网址',
            host: '域名'
        },
        useRegSuffix: '使用正则',
        remark: '备注',
        enabled: '开启/关闭',
        operation: '其他操作',
        words: '违禁词',
        word: {
            original: '敏感词',
            mask: '安全词',
        },
        priority: "优先级",
    },
    en: {
        name: 'Name',
        wordCount: 'Word count',
        scope: 'Scope',
        scopeResult: {
            all: 'All the sites',
            some: 'Some sites'
        },
        scopeType: {
            url: 'URL',
            host: 'Domain'
        },
        useRegSuffix: ' (Regular enabled)',
        remark: 'Remark',
        enabled: 'Enabled',
        operation: 'Operations',
        words: 'Words',
        word: {
            original: 'Original word',
            mask: 'Replaced word'
        },
        priority: "Priority",
    }
}

export default _default