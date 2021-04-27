import { ElButton, ElInput, ElOption, ElRow, ElSelect, ElSwitch, ElTooltip, ElCol, ElMessage } from 'element-plus'
import { defineComponent, h, reactive } from 'vue'
import { read as readClipboard } from 'clipboardy'
import XGFLFG from '../../..'

const inputRef = 'scopeInput'

const save = (_ctx: any) => {
  const useReg = _ctx.useReg
  const pattern = _ctx.pattern
  const type = _ctx.type
  if (!pattern) {
    ElMessage.error('未输入网址或域名')
    _ctx.$refs[inputRef].focus()
    return
  }
  if (useReg) {
    // Check the regular expression is valid
    try {
      new RegExp(pattern)
    } catch (e) {
      ElMessage.error('无效的正则表达式')
      _ctx.$refs[inputRef].focus()
      return
    }
  }
  _ctx.$emit('saved', { useReg, pattern, type } as XGFLFG.Scope)
  _ctx.pattern = ''
  _ctx.$refs[inputRef].focus()
}

export default defineComponent({
  name: 'dict-scope-add',
  setup() {
    return reactive({
      pattern: '',
      useReg: false,
      type: 'host'
    } as XGFLFG.Scope)
  },
  emits: ['saved'],
  render(_ctx: any) {
    const updatePattern = (val: string) => _ctx.pattern = (val || '').trim()

    const typeSelect = h(ElSelect,
      {
        modelValue: _ctx.type,
        onChange: (val: string) => _ctx.useReg = (_ctx.type = val) === 'url'
      },
      {
        default: () => {
          const types = { 'host': '域名', 'url': '网址' }
          return Object.keys(types).map(key => h(ElOption, { label: types[key], value: key }))
        }
      }
    )

    const useRegSwitch = () => h(ElTooltip,
      {
        content: "是否启用正则匹配？",
        placement: "left",
      },
      { default: () => h(ElSwitch, { modelValue: _ctx.useReg, onChange: (val: boolean) => _ctx.useReg = val }) }
    )

    const saveButton = h(
      ElButton,
      {
        icon: 'el-icon-plus',
        onClick: () => save(_ctx)
      },
      { default: () => '新增' }
    )

    const pasteButton = h(ElButton,
      { icon: 'el-icon-document-copy', onClick: () => readClipboard().then(updatePattern) },
      { default: () => '粘贴' }
    )

    const input = () => h(ElInput,
      {
        ref: inputRef,
        modelValue: _ctx.pattern,
        placeholder: '输入字典的有效范围，网址或者域名。需要使用正则表达式，请打开左侧开关',
        class: 'scope-input',
        clearable: true,
        onInput: updatePattern,
        onKeyup: (event: KeyboardEvent) => event.code === 'Enter' && save(_ctx),
        onClear: () => updatePattern(''),
      },
      {
        prepend: () => typeSelect,
        append: () => [saveButton, pasteButton]
      }
    )
    return h(ElRow, { gutter: 20 },
      () => [
        h(ElCol, { span: 2, class: 'reg-switch-cell' }, useRegSwitch),
        h(ElCol, { span: 22 }, input)
      ]
    )
  }
})