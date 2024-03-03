import type { PropType } from "vue"

import { ElAlert, ElInput, ElCol, ElRow, ElButton } from "element-plus"
import { defineComponent, ref, watch } from "vue"
import clipboardy from 'clipboardy'
import { matchScope } from "@common/matcher"
import Url from 'url-parse'
import { t } from "@app/locale"
import { Search, DocumentCopy } from "@element-plus/icons-vue"

const url2Host = (urlStr: string) => {
    const url = Url(urlStr)
    return url.host
}

type TestResult = {
    type: 'info' | 'success' | 'error',
    msg: string
}

type Props = {
    scopes: XGFLFG.Scopes
}

const test = (url: string, scopes: XGFLFG.Scopes): TestResult => {
    if (!scopes || !Object.keys(scopes)?.length) {
        return { type: 'success', msg: t(msg => msg.dict.testResult.effectiveNoWord) }
    }
    if (!url) return NO_MSG_RESULT()

    const host = url2Host(url)
    for (const index in scopes) {
        const scope: XGFLFG.Scope = scopes[index]
        try {
            if (matchScope(scope, host, url)) {
                return { type: 'success', msg: t(msg => msg.dict.testResult.effectiveWithPattern, { pattern: scope.pattern }) }
            }
        } catch {
            return { type: 'error', msg: t(msg => msg.dict.testResult.wrongRegular) }
        }
    }
    return { type: 'error', msg: t(msg => msg.dict.testResult.wrongRegular) }
}

const NO_MSG_RESULT: () => TestResult = () => { return { type: 'info', msg: t(msg => msg.dict.testResult.noTestUrl) } }

const _default = defineComponent({
    props: {
        scopes: Object as PropType<XGFLFG.Scopes>
    },
    setup: (props: Props) => {
        const url = ref<string>()
        const scopes = ref<XGFLFG.Scopes>(props.scopes || {})
        const testResult = ref<TestResult>(NO_MSG_RESULT())

        const setUrl = (val?: string) => url.value = val?.trim?.() || ''
        const handleTest = () => testResult.value = test(url.value, scopes.value)

        // Watch the target url
        watch([url], () => !url.value && (testResult.value = NO_MSG_RESULT()))

        return () => (
            <div>
                <ElRow gutter={20}>
                    <ElCol span={10}>
                        <ElAlert showIcon title={testResult.value?.msg} type={testResult.value?.type} closable={false} />
                    </ElCol>
                    <ElCol span={14}>
                        <ElInput
                            modelValue={url.value}
                            clearable
                            placeholder={t(msg => msg.dict.msg.testUrlPlaceholder)}
                            onInput={setUrl}
                            onKeydown={(e: KeyboardEvent) => e.code === "Enter" && handleTest()}
                            onClear={() => setUrl()}
                            v-slots={{
                                append: () => <>
                                    <ElButton icon={<Search />} onClick={handleTest}>
                                        {t(msg => msg.dict.button.test)}
                                    </ElButton>
                                    <ElButton icon={<DocumentCopy />} onClick={() => clipboardy.read().then(setUrl)}>
                                        {t(msg => msg.dict.button.paste)}
                                    </ElButton>
                                </>
                            }}
                        />
                    </ElCol>
                </ElRow>
            </div>
        )
    }
})

export default _default
