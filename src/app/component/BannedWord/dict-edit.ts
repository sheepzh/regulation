import { defineComponent, h, reactive } from 'vue'
import { ElButton, ElDialog, ElInput, ElMessage } from 'element-plus'
import './style/dict-add'
import XGFLFG from '../../..'
import DictionaryDb from '../../../database/dictionary-db'

interface Props {
  isOpen: boolean
  formData: XGFLFG.Dictionary
  title: string
}

const db: DictionaryDb = new DictionaryDb(chrome.storage.local)

export default defineComponent({
  name: 'dict-edit',
  emits: ['saved'],
  methods: {
    add() {
      this.title = '新增违禁词词典'
      this.isOpen = true
    },
    edit(row: XGFLFG.Dictionary) {
      this.title = '编辑违禁词词典'
      this.formData = row
      this.isOpen = true
    },
    save() {
      const data: XGFLFG.Dictionary = this.formData
      if (!data.name) {
        ElMessage.error('词典名称不能为空')
      } else {
        // Update if ID exists, or add it
        const toDo: (dict: XGFLFG.Dictionary) => Promise<void> = data.id ? data => db.update(data) : data => db.add(data)

        toDo(data).then(() => {
          ElMessage.success(data.id ? '修改成功' : '新增成功'),
            this.$emit('saved', data)

          // Clear all the form items
          this.formData.name = this.formData.remark = ''
          this.isOpen = false
        })
      }
    }
  },
  setup() {
    return reactive({
      isOpen: false,
      formData: {
        name: '',
        remark: ''
      },
      title: '',
    } as Props)
  },
  render(_ctx: any) {
    const dialogBody = () =>
      h('div', [
        h(ElInput, {
          placeholder: '请输入词典名称',
          modelValue: _ctx.formData.name,
          onInput: (val: string) => (_ctx.formData.name = val.trim()),
          onClear: () => (_ctx.formData.name = _ctx.formData.remark = ''),
          clearable: true,
          class: 'dict-field'
        }),
        h(ElInput, {
          type: 'textarea',
          rows: 4,
          class: 'dict-field',
          placeholder: '词典的备注信息',
          modelValue: _ctx.formData.remark,
          onInput: (val: string) => (_ctx.formData.remark = val.trim()),
          clearable: true,
          onClear: () => (_ctx.formData.remark = '')
        })
      ])
    const dialogFooter = () =>
      h('div', { style: 'text-align:center' }, [
        h(
          ElButton,
          {
            type: 'success',
            size: 'mini',
            icon: 'el-icon-check',
            onClick: _ctx.save
          },
          () => '确认'
        ),
        h(
          ElButton,
          {
            icon: 'el-icon-close',
            size: 'mini',
            onClick: () => (_ctx.isOpen = false)
          },
          () => '取消'
        )
      ])

    return h(
      ElDialog,
      {
        title: _ctx.title,
        closeOnClickModal: false,
        width: 400,
        modelValue: _ctx.isOpen,
        onClosed: () => (_ctx.isOpen = false)
      },
      {
        default: dialogBody,
        footer: dialogFooter
      }
    )
  }
})
