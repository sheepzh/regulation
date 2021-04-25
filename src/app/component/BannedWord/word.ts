import { defineComponent, h, reactive } from 'vue'
import { ElButton, ElInput, ElMessage, ElMessageBox, ElTag } from 'element-plus'
import { getDefaultMask, getRealMask } from '../../../common/default-word'
import './style/word'
import BannedWordDb from '../../../database/dictionary-db'
import XGFLFG from '../../..'

interface Props {
  dict: XGFLFG.Dictionary
  formData: XGFLFG.BannedWord
  isAdding: boolean
}

const db = new BannedWordDb(chrome.storage.local)

/**
 * Save word
 * 
 * If exists, rewrite or give up, Or add new one
 * 
 * @param _ctx vm
 */
const saveWord = (_ctx: any) => {
  const origin = _ctx.formData.origin
  const words = _ctx.dict.words
  if (!origin) {
    ElMessage.error('未填写敏感词')
    return
  }

  const current = { origin, mask: getRealMask(origin, _ctx.formData.mask) }

  const update = () => {
    words[origin] = current
    db.update(_ctx.dict).then(() => {
      _ctx.formData.origin = _ctx.formData.mask = ''
      _ctx.$refs.originInput.focus()
    })
  }

  const existing = words[origin]
  if (existing) {
    ElMessageBox.confirm(
      `敏感词[${origin}]已存在，是否将原安全词[${existing.mask}]替换成[${current.mask}]?`, '操作提示', { confirmButtonText: '替换', cancelButtonText: '放弃' }
    ).then(update)
      .catch(() => ElMessage.info("取消保存"))
  } else {
    update()
  }
}

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
  computed: {
    maskPlaceholder(_ctx: any) {
      return getDefaultMask(_ctx.formData.origin)
    }
  },
  methods: {
    delete(origin: string) {
      db.update(this.dict).then(() => {
        delete this.dict.words[origin]
        ElMessage.success(`违禁词[${origin}]删除成功！`)
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
          ref: 'originInput',
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
            onInput: (val: string) => (_ctx.formData.mask = val.trim()),
            onKeyup: (event: KeyboardEvent) => {
              if (event.key === "Enter") {
                // Enter
                saveWord(_ctx)
              }
            }
          },
          {
            append: () =>
              h('span', [
                h(ElButton, {
                  icon: 'el-icon-check',
                  size: 'mini',
                  onClick: () => saveWord(_ctx)
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

    return h('div', [tags, inputArea])
  }
})
