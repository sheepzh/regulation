import { ElButton, ElLink, ElMessage, ElSpace } from 'element-plus'
import { defineComponent, h, Ref, ref } from 'vue'
import ListTable from './list-table'
import DictEdit from './dict-edit'
import XGFLFG from '../../..'
import { checkJSON } from '../../../util/file-util'
import DictionaryDb from '../../../database/dictionary-db'

// My email
const mailto = 'returnzhy1996@outlook.com'

const db: DictionaryDb = new DictionaryDb(chrome.storage.local)

// Ref of data edit dialog
const editRef = ref()
// Ref of file input
const fileInputRef = ref() as Ref<HTMLInputElement>
// Ref of table
const tableRef = ref()

// Handle after the file to import is selected
function handleFileSelected() {
  const files: FileList = fileInputRef.value.files
  if (!files.length) {
    return
  }
  const file: File = files[0]
  file.text()
    .then(str => checkJSON(str))
    .then(dict => db.import(dict))
    .then(() => {
      ElMessage.success('成功导入')
      tableRef.value.query()
    })
    .catch(ElMessage.error)
}

export default defineComponent(() => {


  const addButton = () => h(
    ElButton,
    {
      size: 'small',
      type: 'primary',
      icon: 'el-icon-plus',
      onClick: () => editRef.value.add()
    },
    { default: () => '新增词典' }
  )

  // Input with file type, which hide in the import button
  const fileInput = () => h('input', { ref: fileInputRef, type: 'file', accept: '.json', style: { display: 'none' }, onChange: handleFileSelected })

  const importButton = () => h(
    ElButton,
    {
      size: 'small',
      type: 'primary',
      icon: 'el-icon-document-copy',
      onClick: () => fileInputRef.value.click()
    },
    { default: () => ['导入词典', fileInput()] }
  )

  const feedbackLink = () => h(ElLink,
    {
      icon: "el-icon-edit-outline",
      href: `mailto:${mailto}?subject=扩展使用反馈`,
      target: '_blank'
    },
    () => '使用反馈'
  )

  const children = () => [
    h(
      'div',
      { class: 'filter-container' },
      h(
        ElSpace,
        { size: 'large' },
        () => [addButton(), importButton(), feedbackLink()]
      )
    ),
    h(ListTable, { ref: tableRef, onEdit: (row: XGFLFG.Dictionary) => editRef.value.edit(row) }),
    h(DictEdit, {
      ref: editRef,
      onSaved: () => tableRef.value.query()
    })
  ]

  return () => h('div', { class: 'app-container' }, children())
})