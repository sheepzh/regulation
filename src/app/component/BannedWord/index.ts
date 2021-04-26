import { ElButton } from 'element-plus'
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

    const children = [
      h('div', { class: 'filter-container' }, [addButton]),
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
