import { ElButton, ElLink, ElMessage, ElSpace } from 'element-plus'
import { defineComponent, h, reactive, Ref, ref } from 'vue'
import ListTable from './list-table'
import DictEdit from './dict-edit'
import XGFLFG from '../../..'
import { checkJSON } from '../../../util/file-util'
import DictionaryDb from '../../../database/dictionary-db'

interface Props {
  rows: XGFLFG.BannedWord[]
  dialog: Ref
}

const db: DictionaryDb = new DictionaryDb(chrome.storage.local)

const fileInputRef = 'file-import-input'

export default defineComponent({
  setup() {
    const props: Props = {
      rows: [],
      dialog: ref()
    }
    return reactive(props)
  },
  methods: {
    handleFileSelected() {
      const files: FileList | null = (this.$refs[fileInputRef] as HTMLInputElement).files
      if (!files || !files.length) {
        return
      }
      const file: File = files[0]
      const _this: any = this
      file.text()
        .then(str => checkJSON(str))
        .then(dict => db.import(dict))
        .then(() => {
          ElMessage.success('成功导入')
          _this.$refs.table.query()
        })
        .catch(ElMessage.error)
    }
  },
  render(_ctx: any) {
    const addButton = () => h(
      ElButton,
      {
        size: 'small',
        type: 'primary',
        icon: 'el-icon-plus',
        onClick: () => _ctx.$refs.edit.add()
      },
      { default: () => '新增词典' }
    )

    const fileInput = h('input', { ref: fileInputRef, type: 'file', accept: '.json', style: { display: 'none' }, onChange: _ctx.handleFileSelected })

    const importButton = () => h(
      ElButton,
      {
        size: 'small',
        type: 'primary',
        icon: 'el-icon-document-copy',
        onClick: () => { _ctx.$refs[fileInputRef].click() }
      },
      { default: () => ['导入词典', fileInput] }
    )

    const mailto = 'returnzhy1996@outlook.com'

    const feedbackLink = () => h(ElLink,
      {
        icon: "el-icon-edit-outline",
        href: `mailto:${mailto}?subject=扩展使用反馈`,
        target: '_blank'
      },
      () => '使用反馈'
    )

    const children = [
      h(
        'div',
        { class: 'filter-container' },
        h(
          ElSpace,
          { size: 'large' },
          () => [addButton(), importButton(), feedbackLink()]
        )
      ),
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
