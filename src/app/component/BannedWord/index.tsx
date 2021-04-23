import { ElButton } from 'element-plus'
import { defineComponent, h, reactive, Ref, ref } from 'vue'
import ListTable from './list-table'
import DictAdd from './dict-add'
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
        onClick: () => _ctx.$refs.add.open()
      },
      { default: () => '新增词典' }
    )

    const children = [
      h('div', { class: 'filter-container' }, [addButton]),
      h(ListTable, { ref: 'table' }),
      h(DictAdd, {
        ref: 'add',
        onSaved: () => _ctx.$refs.table.query()
      })
    ]

    const div = h('div', { class: 'app-container' }, children)

    return div
  }
})
