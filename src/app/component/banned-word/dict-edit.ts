import { defineComponent, h, ref, Ref } from 'vue'
import { ElButton, ElDialog, ElInput, ElMessage } from 'element-plus'
import './style/dict-add'
import DictionaryDb from '../../../database/dictionary-db'
import { t } from '../../locale'
import { Close, Check } from "@element-plus/icons-vue"

const db: DictionaryDb = new DictionaryDb(chrome.storage.local)

async function save(data: XGFLFG.Dictionary): Promise<boolean> {
    // Update if ID exists, or add it
    const toDo: (dict: XGFLFG.Dictionary) => Promise<void> = data.id ? data => db.update(data) : data => db.add(data)
    await toDo(data)
    ElMessage.success(t(msg => msg.dict.msg.savedSuccessfully))
    return true
}

const renderForm = (formName: Ref<string>, formRemark: Ref<string>) => h('div', [
    h(ElInput, {
        placeholder: t(msg => msg.item.name),
        modelValue: formName.value,
        onInput: (val: string) => formName.value = val.trim(),
        onClear: () => formName.value = formRemark.value = '',
        clearable: true,
        class: 'dict-field'
    }),
    h(ElInput, {
        type: 'textarea',
        rows: 4,
        class: 'dict-field',
        placeholder: t(msg => msg.item.remark),
        modelValue: formRemark.value,
        onInput: (val: string) => formRemark.value = val.trim(),
        clearable: true,
        onClear: () => formRemark.value = ''
    })
])

const renderFooter = (handleSave: () => void, handleClose: () => void) => h('div', { style: 'text-align:center' }, [
    h(ElButton, {
        type: 'success',
        size: 'small',
        icon: Check,
        onClick: handleSave,
    }, () => t(msg => msg.dict.button.confirm)),
    h(ElButton, {
        icon: Close,
        size: 'small',
        onClick: () => handleClose()
    }, () => t(msg => msg.dict.button.cancel))
])

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
        const init = (row?: XGFLFG.Dictionary) => {
            currentRow = row
            formName.value = row?.name || ''
            formRemark.value = row?.remark || ''
            open.value = true
        }
        ctx.expose({
            add: () => {
                title.value = t(msg => msg.dict.button.add)
                init()
            },
            edit(row: XGFLFG.Dictionary) {
                title.value = t(msg => msg.dict.button.edit)
                init(row)
            }
        })
        const handleSave = async () => {
            const name = formName.value
            const remark = formName.value
            if (!name) {
                ElMessage.error(t(msg => msg.dict.msg.nameBlankError))
                return
            }
            const saved = await save({ ...currentRow, name, remark })
            if (saved) {
                ctx.emit('save', name, remark)
                // Clear all the form items
                formName.value = formRemark.value = ''
                open.value = false
            }
        }
        return () => h(ElDialog, {
            title: title.value,
            closeOnClickModal: false,
            width: 400,
            modelValue: open.value,
            onClosed: () => open.value = false
        }, {
            default: () => renderForm(formName, formRemark),
            footer: () => renderFooter(handleSave, () => open.value = false),
        })
    }
})

export default _default