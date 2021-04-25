
import { ElAlert, ElInput, ElCol, ElRow, ElButton } from "element-plus"
import { defineComponent, h, reactive, VNode } from "vue"
import XGFLFG from "../../.."
import { read as readClipboard } from 'clipboardy'
import { matchScope } from "../../../common/matcher"
import Url from 'url-parse'

const url2Host = (urlStr: string) => {
  const url = Url(urlStr)
  return url.host
}

interface TestResult {
  type: 'info' | 'success' | 'error',
  msg: string
}

interface Props {
  targetUrl: '',
  scopes: XGFLFG.Scope[]
}
export default defineComponent({
  name: 'word-scope',
  setup(_props: any) {
    const scopes = (_props.scope || {}) as XGFLFG.Scope[]

    return reactive({
      targetUrl: '',
      scopes,
      testResult: { type: 'info', msg: '请输入待测试网址' }
    } as Props)
  },
  methods: {
    test(): TestResult {
      const scopes = this.scopes as XGFLFG.Scope[]
      if (!scopes || !scopes.length) {
        return { type: 'success', msg: '字典有效，未指定范围。' }
      }
      const url = this.targetUrl
      if (!!url) {
        return { type: 'info', msg: '请输入待测试网址' }
      }
      const host = url2Host(url)
      for (const index in scopes) {
        const scope = scopes[index]
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
  },
  render(_ctx: any) {
    const testResult: TestResult = _ctx.testResult
    const wrapByCol = (span: number, cell: VNode) => h(ElCol, { span }, () => cell)

    const updateTargetUrl = (val: string) => _ctx.targetUrl = (val || '').trim()

    return h('div',
      h(ElRow, { gutter: 20 },
        () => [
          wrapByCol(10, h(ElAlert, { showIcon: true, title: testResult.msg, type: testResult.type, closable: false })),
          wrapByCol(14,
            h(ElInput,
              {
                modelValue: _ctx.targetUrl,
                clearable: true,
                placeholder: '输入网址判断词典是否生效：https://www.baidu.com/?q=xxx',
                onInput: updateTargetUrl,
                onClear: () => updateTargetUrl('')
              },
              // Button to paste
              {
                append: () => [
                  h(ElButton, { icon: 'el-icon-search', onClick: () => _ctx.testResult = _ctx.test() }, () => '测试'),
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
})