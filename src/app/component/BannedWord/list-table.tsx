import {
  ElTable,
  ElTableColumn,
  ElSwitch,
  ElButton,
  ElTag,
  ElMessageBox,
  ElMessage,
  ElDialog
} from 'element-plus'
import { defineComponent, h, reactive } from 'vue'
import XGFLFG from '../../..'
import Word from './word'
import DictionaryDb from '../../../database/dictionary-db'

const db: DictionaryDb = new DictionaryDb(chrome.storage.local)

const align = 'center'

const wordRefName = 'word'

// Operations of table row
const renderOperationButton = (
  _ctx: any,
  name: string,
  callback: () => void
) => {
  return h(
    ElButton,
    { type: 'text', size: 'mini', onClick: callback },
    { default: () => name }
  )
}

// Table
const renderTable = (_ctx: any) => {
  const children = [
    // Name
    h(ElTableColumn, { prop: 'name', align, minWidth: 40, label: '名称' }),
    // Quantity or words
    h(ElTableColumn, {
      align,
      minWidth: 40,
      label: '词汇数量',
      formatter: (row: XGFLFG.Dictionary) => row.words.size
    }),
    // Scope of domain
    h(
      ElTableColumn,
      {
        align,
        minWidth: 40,
        label: '生效范围'
      },
      {
        default(data: any) {
          const row: XGFLFG.Dictionary = data.row
          const full = !row.domains || !row.domains.length
          return h(
            ElTag,
            { type: full ? 'info' : 'primary', size: 'mini' },
            { default: () => (full ? '全部网站' : '部分网站') }
          )
        }
      }
    ),
    // Remark
    h(ElTableColumn, { prop: 'remark', align, minWidth: 80, label: '备注' }),
    // Enabled
    h(
      ElTableColumn,
      {
        align,
        minWidth: 30,
        label: '开启/关闭'
      },
      {
        default: (data: any) => {
          const row: XGFLFG.Dictionary = data.row
          const id = row.id
          return h(ElSwitch, {
            modelValue: row && !!row.enabled,
            onChange: (val: boolean) => {
              id && db.updateEnabled(id, val).then(() => (row.enabled = val))
            }
          })
        }
      }
    ),
    // Operations
    h(
      ElTableColumn,
      { align, minWidth: 70, label: '其他操作' },
      {
        default: (data: any) => {
          const row: XGFLFG.Dictionary = data.row
          return [
            // Word management
            renderOperationButton(_ctx, '违禁词', () => {
              _ctx.current = row
              _ctx.wordOpen = true
              _ctx.$refs[wordRefName] && _ctx.$refs[wordRefName].closeInput()
            }),
            // Scope management
            renderOperationButton(_ctx, '生效范围', () => {}),
            // Delete
            renderOperationButton(_ctx, '删除', () => {
              ElMessageBox.confirm(
                `是否删除词典【${row.name}】？`,
                '操作提示',
                {
                  cancelButtonText: '放弃',
                  confirmButtonText: '是的',
                  type: 'warning'
                }
              )
                .then(() =>
                  db.delete(row.id || 0).then(() => {
                    ElMessage.success('删除成功')
                    _ctx.query()
                  })
                )
                .catch(() => ElMessage.info('放弃删除'))
            })
          ]
        }
      }
    )
  ]
  return h(
    ElTable,
    {
      data: _ctx.list,
      style: { width: '100%' },
      size: 'mini',
      border: true,
      fit: true
    },
    { default: () => children }
  )
}

// Word
const renderWord = (_ctx: any) => {
  return h(
    ElDialog,
    {
      title: '违禁词管理',
      modelValue: _ctx.wordOpen,
      onClosed: () => (_ctx.wordOpen = false)
    },
    { default: () => h(Word, { ref: wordRefName, dict: _ctx.current }) }
  )
}

export default defineComponent({
  name: 'list-table',
  setup() {
    return reactive({
      list: [],
      current: null,
      wordOpen: false
    } as { list: XGFLFG.Dictionary[]; current: XGFLFG.Dictionary | null; wordOpen: boolean })
  },
  created() {
    this.query()
  },
  methods: {
    query() {
      db.listAll().then((dictionaries) => (this.list = dictionaries))
    }
  },
  render(_ctx: any) {
    const word = renderWord(_ctx)
    const table = renderTable(_ctx)
    return (
      <div style="width:100%; margin-top:20px;">
        {table}
        {word}
      </div>
    )
  }
})
