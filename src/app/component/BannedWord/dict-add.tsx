import { defineComponent, reactive, unref } from 'vue'
import { ElMessage } from 'element-plus'
import './style/dict-add'
import XGFLFG from '../../..'
import DictionaryDb from '../../../database/dictionary-db'

interface Props {
  isOpen: boolean
  formData: XGFLFG.Dictionary
}

const db: DictionaryDb = new DictionaryDb(chrome.storage.local)

export default defineComponent({
  emits: ['saved'],
  methods: {
    open() {
      this.isOpen = true
    },
    save() {
      const data: XGFLFG.Dictionary = this.formData
      if (!data.name) {
        ElMessage.error('词典名称不能为空')
      } else {
        db.add(unref(data)).then(() => {
          ElMessage.success('新增成功')
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
      }
    } as Props)
  },
  render(_ctx: any) {
    const body = (
      <el-dialog
        title="新增违禁词词典"
        closeOnClickModal={false}
        width={400}
        modelValue={_ctx.isOpen}
        onClosed={() => (_ctx.isOpen = false)}
      >
        <div>
          <el-input
            placeholder="请输入词典名称"
            modelValue={_ctx.formData.name}
            onInput={(val: string) => (_ctx.formData.name = val.trim())}
            onClear={() => (_ctx.formData.name = _ctx.formData.remark = '')}
            clearable={true}
            class="dict-field"
          />
          <el-input
            type="textarea"
            rows={4}
            class="dict-field"
            placeholder="词典的备注信息"
            modelValue={_ctx.formData.remark}
            onInput={(val: string) => (_ctx.formData.remark = val.trim())}
            clearable={true}
            onClear={() => (_ctx.formData.remark = '')}
          />
        </div>
        <slot name="footer">
          <div style="text-align:center">
            <el-button
              type="success"
              size="mini"
              icon="el-icon-check"
              onClick={_ctx.save}
            >
              确认
            </el-button>
            <el-button
              icon="el-icon-close"
              size="mini"
              onClick={() => (_ctx.isOpen = false)}
            >
              取消
            </el-button>
          </div>
        </slot>
      </el-dialog>
    )
    return body
  }
})
