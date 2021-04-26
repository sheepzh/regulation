import { ElTag, ElTooltip } from 'element-plus'
import { defineComponent, h, reactive } from 'vue'
import XGFLFG from '../../..'

export default defineComponent({
  name: 'scope-list',
  props: {
    scopes: {
      type: Object,
      required: true
    }
  },
  emits: ['deleted'],
  setup(_props: any) {
    const scopes = _props.scopes
    return reactive({
      scopes
    })
  },
  render(_ctx: any) {
    const scopes = _ctx.scopes || {}
    const tags = []
    for (const key in scopes) {
      const scope = scopes[key] as XGFLFG.Scope
      const tagType = { closable: true, onClose: () => _ctx.$emit('deleted', key), style: 'margin-right:6px;margin-bottom:6px;' }
      if (scope.useReg) {
        tagType['type'] = 'warning'
      }
      const i = h('i', { class: `el-icon-${scope.type === 'url' ? 'link' : 'collection'}`, style: 'margin-right:4px' })
      const tooltip = h(ElTooltip,
        {
          content: `${scope.type === 'url' ? '网址' : '域名'}${scope.useReg ? '(使用正则)' : ''}`,
          placement: 'bottom'
        },
        () => h(ElTag, tagType, () => [i, scope.pattern])
      )
      tags.push(tooltip)
    }
    return h('div', tags)
  }
})