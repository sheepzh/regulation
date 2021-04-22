import { defineComponent, h, reactive } from 'vue'
import { ElMessage, ElTag } from 'element-plus'
import { getRealMask } from '../../../common/default-word'
import XGFLFG from '../../../global'
import './style/list'
import BannedWordDb from '../../../database/banned-words'

interface Props {
  rows: XGFLFG.BannedWord[]
}

const db = new BannedWordDb(chrome.storage.local)

export default defineComponent({
  props: {
    rows: {
      type: Array,
      default: []
    }
  },
  methods: {
    delete(origin: string, index: number) {
      db.delete(origin, () => {
        this.rows.splice(index, 1)
        ElMessage.success(`违禁词【${origin}】删除成功！`)
      })
    },
    refresh() {
      db.listAll((rows) => {
        console.log(rows)
        this.rows.splice(0, this.rows.length)
        rows.forEach((row) => this.rows.push(row))
        console.log(this.rows)
      })
    }
  },
  setup(props) {
    return reactive({ rows: props.rows as XGFLFG.BannedWord[] })
  },
  name: 'banned-word-list',
  render(_ctx: Props) {
    const tags = _ctx.rows.map(({ origin, mask }, index) =>
      h(
        ElTag,
        {
          closable: true,
          class: 'word-item',
          onClose: () => this.delete(origin, index)
        },
        `${origin} => ${getRealMask(origin, mask)}`
      )
    )
    return h('div', { class: 'list-container' }, tags)
  }
})
