import { defineComponent, ref, Ref } from 'vue'
import { ElButton, ElDialog, ElInput, ElMessage } from 'element-plus'
import './style/dict-add'
import DictionaryDb from '@db/dictionary-db'
import { I18nKey, t } from '@app/locale'
import { Close, Check } from "@element-plus/icons-vue"

const db: DictionaryDb = new DictionaryDb(chrome.storage.local)

async function save(data: XGFLFG.Dictionary): Promise<boolean> {
    // Update if ID exists, or add it
    const toDo: (dict: XGFLFG.Dictionary) => Promise<void> = data.id ? data => db.update(data) : data => db.add(data)
    await toDo(data)
    ElMessage.success(t(msg => msg.dict.msg.savedSuccessfully))
    return true
}

export type EditInstance = {
    add: () => void
    edit: (row: XGFLFG.Dictionary) => void
}

const _default = defineComponent({
    emits: {
        save: (_name: string, _remark: string) => true
    },
    setup(_, ctx) {
        const title: Ref<string> = ref()
        const open: Ref<boolean> = ref(false)
        const formName: Ref<string> = ref()
        const formRemark: Ref<string> = ref()
        let currentRow: XGFLFG.Dictionary = undefined
        const init = (titleKey: I18nKey, row?: XGFLFG.Dictionary) => {
            title.value = t(titleKey)
            currentRow = row
            formName.value = row?.name || ''
            formRemark.value = row?.remark || ''
            open.value = true
        }
        const instance: EditInstance = {
            add: () => init(msg => msg.dict.button.add),
            edit: (row: XGFLFG.Dictionary) => init(msg => msg.dict.button.edit, row)
        }
        ctx.expose(instance)
        const handleSave = async () => {
            const name = formName.value
            const remark = formName.value
            if (!name) return ElMessage.error(t(msg => msg.dict.msg.nameBlankError))
            const saved = await save({ ...currentRow, name, remark })
            if (saved) {
                ctx.emit('save', name, remark)
                // Clear all the form items
                formName.value = formRemark.value = ''
                open.value = false
            }
        }
        return () => (
            <ElDialog
                title={title.value}
                closeOnClickModal={false}
                width={400}
                modelValue={open.value}
                onClose={() => open.value = false}
                v-slots={{
                    default: () => <div>
                        <ElInput
                            placeholder={t(msg => msg.item.name)}
                            modelValue={formName.value}
                            onInput={(val: string) => formName.value = val?.trim?.()}
                            onClear={() => formName.value = formRemark.value = ''}
                            clearable
                            class="dict-field"
                        />
                        <ElInput
                            type='textarea'
                            class="dict-field"
                            autosize={{ maxRows: 4, minRows: 4 }}
                            placeholder={t(msg => msg.item.remark)}
                            modelValue={formRemark.value}
                            onInput={(val: string) => formRemark.value = val?.trim?.()}
                            clearable
                            onClear={() => formRemark.value = ''}
                        />
                    </div>,
                    footer: () => <div style={{ textAlign: "center" }}>
                        <ElButton type='success' size='small' icon={<Check />} onClick={handleSave}>
                            {t(msg => msg.dict.button.confirm)}
                        </ElButton>
                        <ElButton icon={<Close />} size='small' onClick={() => open.value = false}>
                            {t(msg => msg.dict.button.cancel)}
                        </ElButton>
                    </div>
                }}
            />
        )
    }
})

export default _default