import { defineComponent, reactive } from 'vue'
import { getDefaultMask } from '../../../common/default-word'
import XGFLFG from '../../../global'
import BannedWordDb from '../../../database/banned-words'
import { ElMessage } from 'element-plus'

interface Props {
  isOpen: boolean
  formData: XGFLFG.BannedWord
}

const db: BannedWordDb = new BannedWordDb(chrome.storage.local)

export default defineComponent({
  emits: ['saved'],
  methods: {
    open() {
      this.isOpen = true
    },
    save() {
      const data = this.formData
      if (!data.origin) {
        ElMessage.error('违禁词不能为空')
      } else {
        db.add(data, (succeded: boolean, msg: string) => {
          if (succeded) {
            ElMessage.success('新增成功')
            this.$emit('saved', data)

            // Clear all the form items
            this.formData.origin = this.formData.mask = ''
            this.isOpen = false
          } else {
            ElMessage.error(msg)
          }
        })
      }
    }
  },
  setup() {
    return reactive({
      isOpen: false,
      formData: {
        origin: '',
        mask: ''
      }
    } as Props)
  },
  computed: {
    /**
     * The placeholder of the mask
     *
     * @param _ctx this
     */
    maskPlaceholder(_ctx: Props) {
      const currentOrigin: string = _ctx.formData.origin || ''
      return getDefaultMask(currentOrigin)
    }
  },
  render(_ctx: any) {
    const intputStyle = 'width: 100%'
    // Template
    const body = (
      <el-dialog
        title="新增违禁词"
        closeOnClickModal={false}
        width={400}
        modelValue={_ctx.isOpen}
        onClosed={() => (_ctx.isOpen = false)}
      >
        <el-form label-width="80px">
          <el-row>
            <el-col span={24}>
              <el-form-item label="违禁词">
                <el-input
                  placeholder="不允许空格噢"
                  modelValue={_ctx.formData.origin}
                  onInput={(val: string) => (_ctx.formData.origin = val.trim())}
                  onClear={() =>
                    (_ctx.formData.origin = _ctx.formData.mask = '')
                  }
                  style={intputStyle}
                  clearable={true}
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col span={24}>
              <el-form-item label="安全词">
                <el-input
                  placeholder={_ctx.maskPlaceholder}
                  modelValue={_ctx.formData.mask}
                  onInput={(val: string) => (_ctx.formData.mask = val.trim())}
                  style={intputStyle}
                  clearable={true}
                  onClear={() => (_ctx.formData.mask = '')}
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
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
