import { ElButton, ElEmpty } from 'element-plus'
import { defineComponent, h, reactive, Ref, ref } from 'vue'
import AddDialog from './add-dialog'
import List from './list'
import BannedWordDb from '../../../database/banned-words'
import XGFLFG from '../../../global'

interface Props {
  rows: XGFLFG.BannedWord[]
  dialog: Ref
}

const db = new BannedWordDb(chrome.storage.local)

export default defineComponent({
  setup() {
    const props: Props = {
      rows: [],
      dialog: ref()
    }
    return reactive(props)
  },
  methods: {
    query() {
      db.listAll((records: XGFLFG.BannedWord[]) => {
        this.rows = records
        console.log(this)
      })
    }
  },
  created() {
    this.query()
  },
  render(_ctx: any) {
    const addDialog = h(AddDialog, {
      ref: 'dialog',
      onSaved: () =>
        _ctx.$refs.wordList ? _ctx.$refs.wordList.refresh() : _ctx.query()
    })
    const list = h(List, { ref: 'wordList', rows: _ctx.rows })
    let children = []

    const addButton = h(
      ElButton,
      {
        size: 'small',
        type: 'primary',
        icon: 'el-icon-plus',
        onClick: () => _ctx.dialog.open()
      },
      '新增'
    )

    children.push(
      h('div', { class: 'filter-container' }, [addButton]),
      addDialog
    )

    if (!_ctx.rows || !_ctx.rows.length) {
      // Append empty
      children.push(h(ElEmpty, { description: '你还没有设置违禁词' }))
    } else {
      children.push(list)
    }

    const div = h('div', { class: 'app-container' }, children)

    return div
  }
})
