
import { ElAlert, ElInput, ElCol, ElRow, ElButton } from "element-plus"
import { defineComponent, h, reactive, ref, SetupContext, UnwrapRef, VNode, watch, watchEffect } from "vue"
import { read as readClipboard } from 'clipboardy'
import { matchScope } from "../../../common/matcher"
import Url from 'url-parse'
import XGFLFG from "../../.."

const url2Host = (urlStr: string) => {
  const url = Url(urlStr)
  return url.host
}

type TestResult = {
  type: 'info' | 'success' | 'error',
  msg: string
}

type RawBinding = {
  targetUrl: string,
  scopes: XGFLFG.Scopes
  testResult: TestResult
}

type Props = {
  scopes: XGFLFG.Scopes
}

const NO_MSG_RESULT: () => TestResult = () => { return { type: 'info', msg: '请输入待测试网址' } }

const comp = defineComponent(
  (_props: Props, context: SetupContext) => {
    const scopes: XGFLFG.Scopes = (context.attrs.scopes || {}) as XGFLFG.Scopes
    const binding: UnwrapRef<RawBinding> = reactive({
      targetUrl: '',
      scopes,
      testResult: NO_MSG_RESULT()
    })


    // Methods 
    const wrapByCol = (span: number, cell: VNode) => h(ElCol, { span }, () => cell)
    const updateTargetUrl = (val: string) => binding.targetUrl = (val || '').trim()
    const test: () => TestResult = () => {
      const scopes = binding.scopes
      if (!scopes || !Object.values(scopes).length) {
        return { type: 'success', msg: '字典有效，未指定范围。' }
      }
      const url = binding.targetUrl
      if (!url || url === '') {
        return NO_MSG_RESULT()
      }
      const host = url2Host(url)
      for (const index in scopes) {
        const scope: XGFLFG.Scope = scopes[index]
        try {
          if (matchScope(scope, host, url)) {
            return { type: 'success', msg: `字典有效：${scope.pattern}` }
          }
        } catch {
          return { type: 'error', msg: '错误的正则表达式' }
        }
      }
      return { type: 'error', msg: '字典在该网址下无效' }
    }

    const handleTestResult = (result: TestResult) => {
      binding.testResult.msg = result.msg
      binding.testResult.type = result.type
    }
    // Watch the target url
    watchEffect(() => !binding.targetUrl && handleTestResult(NO_MSG_RESULT()))

    const testResult: TestResult = binding.testResult

    return () => h('div',
      h(ElRow, { gutter: 20 },
        () => [
          wrapByCol(10, h(ElAlert, { showIcon: true, title: testResult.msg, type: testResult.type, closable: false })),
          wrapByCol(14,
            h(ElInput,
              {
                modelValue: binding.targetUrl,
                clearable: true,
                placeholder: '输入网址判断词典是否生效：https://www.baidu.com/?q=xxx',
                onInput: updateTargetUrl,
                onKeyup: (event: KeyboardEvent) => event.code === 'Enter' && handleTestResult(test()),
                onClear: () => updateTargetUrl('')
              },
              // Button to paste
              {
                append: () => [
                  h(ElButton, {
                    icon: 'el-icon-search', onClick: () => handleTestResult(test())
                  }, () => '测试'),
                  h(ElButton,
                    {
                      icon: 'el-icon-document-copy',
                      onClick: () => readClipboard().then(updateTargetUrl)
                    },
                    () => '粘贴'
                  )
                ]
              }
            )
          )
        ]
      )
    )
  }
)

export default comp

export type ScopeTestProps = Props