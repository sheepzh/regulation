import { defineComponent, h, reactive } from 'vue'
import { ElButton, ElInput, ElMessage, ElTag } from 'element-plus'
import { getRealMask } from '../../../common/default-word'
import './style/word'
import BannedWordDb from '../../../database/dictionary-db'
import XGFLFG from '../../..'

interface Props {
  dict: XGFLFG.Dictionary
  formData: XGFLFG.BannedWord
  isAdding: boolean
}

const db = new BannedWordDb(chrome.storage.local)

export default defineComponent({
  props: {
    dict: {
      type: Object,
      default: {}
    }
  },
  setup(_prop) {
    return reactive({
      dict: _prop.dict,
      isAdding: false,
      formData: { origin: '', mask: '' }
    } as Props)
  },
  methods: {
    delete(origin: string) {
      db.update(this.dict).then(() => {
        delete this.dict.words[origin]
        ElMessage.success(`违禁词【${origin}】删除成功！`)
      })
    },
    closeInput() {
      this.isAdding = false
    },
    showInput() {
      this.isAdding = true
    }
  },
  name: 'banned-word-list',
  render(_ctx: any) {
    const dict = _ctx.dict as XGFLFG.Dictionary
    const words = dict.words
    const tags = Array.from(Object.values(words)).map((word: any) => {
      const origin: string = word.origin || ''
      const mask: string = word.mask || ''
      return h(
        ElTag,
        {
          closable: true,
          size: 'mini',
          class: 'word-item',
          onClose: () => this.delete(origin)
        },
        { default: () => `${origin} => ${getRealMask(origin, mask)}` }
      )
    })

    let inputArea: any
    if (_ctx.isAdding) {
      inputArea = []
      inputArea.push(
        h(ElInput, {
          modelValue: _ctx.formData.origin,
          placeholder: '敏感词',
          clearable: true,
          size: 'mini',
          onClear: () => (_ctx.formData.origin = _ctx.formData.mask = ''),
          class: 'word-input-left',
          onInput: (val: string) => (_ctx.formData.origin = val.trim())
        }),
        h(
          ElInput,
          {
            modelValue: _ctx.formData.mask,
            placeholder: '安全词',
            clearable: true,
            size: 'mini',
            onClear: () => (_ctx.formData.mask = ''),
            class: 'word-input-right ',
            onInput: (val: string) => (_ctx.formData.mask = val.trim())
          },
          {
            append: () =>
              h('span', [
                h(ElButton, {
                  icon: 'el-icon-check',
                  size: 'mini',
                  onClick: () => {
                    const origin = _ctx.formData.origin
                    const words = _ctx.dict.words
                    if (!origin) {
                      ElMessage.error('未填写敏感词')
                      return
                    }
                    const existing = Object.keys(words).includes(origin)
                    if (existing) {
                      console.log(words, origin)
                      ElMessage.error(
                        '该敏感词已存在，需要修改安全词，请先删除原来的记录'
                      )
                      return
                    }
                    words[origin] = { origin, mask: _ctx.formData.mask }
                    db.update(_ctx.dict).then(() => {
                      _ctx.formData.origin = _ctx.formData.mask = ''
                    })
                  }
                }),
                h(ElButton, {
                  icon: 'el-icon-close',
                  size: 'mini',
                  onClick: _ctx.closeInput
                })
              ])
          }
        )
      )
    } else {
      inputArea = h(
        ElButton,
        {
          icon: 'el-icon-plus',
          size: 'mini',
          onClick: _ctx.showInput
        },
        { default: () => '新增' }
      )
    }

    return (
      <div>
        {tags}
        {inputArea}
      </div>
    )
  }
})
