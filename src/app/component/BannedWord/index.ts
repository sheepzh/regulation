import { ElButton, ElLink, ElSpace } from 'element-plus'
import { defineComponent, h, reactive, Ref, ref } from 'vue'
import ListTable from './list-table'
import DictEdit from './dict-edit'
import XGFLFG from '../../..'

interface Props {
  rows: XGFLFG.BannedWord[]
  dialog: Ref
}

export default defineComponent({
  setup() {
    const props: Props = {
      rows: [],
      dialog: ref()
    }
    return reactive(props)
  },
  render(_ctx: any) {
    const addButton = h(
      ElButton,
      {
        size: 'small',
        type: 'primary',
        icon: 'el-icon-plus',
        onClick: () => _ctx.$refs.edit.add()
      },
      { default: () => '新增词典' }
    )

    const mailto = 'returnzhy1996@outlook.com'

    const feedbackLink = h(ElLink, { icon: "el-icon-edit-outline", href: `mailto:${mailto}?subject=扩展使用反馈`, target: '_blank' }, () => '使用反馈')

    const children = [
      h('div', { class: 'filter-container' }, h(ElSpace, { size: 'large' }, () => [addButton, feedbackLink])),
      h(ListTable, { ref: 'table', onEdit: (row: XGFLFG.Dictionary) => { _ctx.$refs.edit.edit(row) } }),
      h(DictEdit, {
        ref: 'edit',
        onSaved: () => _ctx.$refs.table.query()
      })
    ]

    const div = h('div', { class: 'app-container' }, children)

    return div
  }
})
