import { ElButton, ElLink, ElMessage, ElSpace } from 'element-plus'
import { defineComponent, Ref, ref } from 'vue'
import ListTable, { TableInstance } from './ListTable'
import DictEdit from './DictEdit'
import { checkJSON } from "@util/file-util"
import DictionaryDb from '@db/dictionary-db'
import { t } from '@app/locale'
import { FEEDBACK_LINK } from "@util/constant/link"
import { locale } from "@util/i18n"
import { DocumentCopy, Plus, Edit } from "@element-plus/icons-vue"

const db: DictionaryDb = new DictionaryDb(chrome.storage.local)

async function handleFileSelected(fileInput: HTMLInputElement, tableInstance: TableInstance) {
    const files: FileList | null = fileInput?.files
    const file = files?.[0]
    if (!file) return
    try {
        const str = await file.text()
        const dict = checkJSON(str)
        if (dict) {
            await db.import(dict)
            ElMessage.success(t(msg => msg.dict.msg.importedSuccessfully))
            tableInstance?.query?.()
        } else {
            ElMessage.error("Invalid format of file content")
        }
    } catch (e) {
        ElMessage.error(e)
    }
}

export default defineComponent(() => {
    const editRef = ref()
    const fileInputRef = ref() as Ref<HTMLInputElement>
    const tableRef = ref()
    return () => (
        <div class="app-container">
            <div class="filter-container">
                <ElSpace size="large">
                    <ElButton type="primary" icon={<Plus />} onClick={() => editRef.value?.add?.()}>
                        {t(msg => msg.dict.button.add)}
                    </ElButton>
                    <ElButton type="primary" icon={<DocumentCopy />}>
                        {t(msg => msg.dict.button.import)}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept='.json'
                            style={{ display: "none" }}
                            onChange={() => handleFileSelected(fileInputRef.value, tableRef.value)}
                        />
                    </ElButton>
                    {
                        locale === "zh_CN" && <ElLink icon={<Edit />} href={FEEDBACK_LINK}>{t(msg => msg.dict.button.feedback)}</ElLink>
                    }
                </ElSpace>
            </div>
            <ListTable ref={tableRef} onEdit={row => editRef.value?.edit?.(row)} />
            <DictEdit ref={editRef} onSave={() => tableRef.value?.query?.()} />
        </div>
    )
})