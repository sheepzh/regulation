import { PropType, defineComponent, ref } from 'vue'
import { ElButton, ElInput, ElMessage, ElMessageBox, ElTag } from 'element-plus'
import { getRealMask } from '@common/default-word'
import './style/word'
import BannedWordDb from '@db/dictionary-db'
import { t } from '@app/locale'
import { Plus, Close, Check } from "@element-plus/icons-vue"

const db = new BannedWordDb(chrome.storage.local)

export default defineComponent({
    props: {
        dict: Object as PropType<XGFLFG.Dictionary>
    },
    setup(prop) {
        const dict = ref<XGFLFG.Dictionary>(prop.dict)
        const editing = ref(false)
        const editingOrigin = ref('')
        const editingMask = ref('')
        const handleDelete = async (origin: string) => {
            const newVal = dict.value
            delete newVal?.words?.[origin]
            await db.update(newVal)
            ElMessage.success(t(msg => msg.dict.msg.wordDeleteConfirmMsg, { origin }))
        }
        const closeInput = () => editing.value = false
        const showInput = () => editing.value = true
        const saveOrigin = (val?: string) => editingOrigin.value = val
        const saveWord = () => {
            const origin = editingOrigin.value?.trim?.()
            if (!origin) {
                ElMessage.error(t(msg => msg.dict.msg.noOriginWordError))
                return
            }
            const dictVal = dict.value
            const words = dictVal?.words
            const current = { origin, mask: getRealMask(origin, editingMask.value) }

            const doUpdate = async () => {
                words[origin] = current
                await db.update(dictVal)
                editingMask.value = editingOrigin.value = ''
            }

            const existing = words[origin]
            if (existing) {
                ElMessageBox.confirm(
                    t(msg => msg.dict.msg.wordExistConfirmation, { word: origin, oldMask: existing.mask, newMask: current.mask }),
                    t(msg => msg.dict.msg.operationConfirmation),
                    {
                        confirmButtonText: t(msg => msg.dict.button.replace),
                        cancelButtonText: t(msg => msg.dict.button.giveUp)
                    }
                ).then(doUpdate).catch(() => { })
            } else {
                doUpdate()
            }
        }

        return () => <div style={{ display: "flex" }}>
            {
                Object.values(dict.value?.words || {}).map(({ origin, mask }) => {
                    return <ElTag
                        closable
                        size='small'
                        class='word-item'
                        onClose={() => handleDelete(origin)}
                    >
                        {`${origin} => ${getRealMask(origin, mask)}`}
                    </ElTag>
                })
            }
            <div v-show={editing.value} style={{ display: "inline-flex" }}>
                <ElInput
                    modelValue={editingOrigin.value}
                    placeholder={t(msg => msg.item.word.original)}
                    clearable
                    size='small'
                    onClear={() => saveOrigin()}
                    class="word-input-left"
                    onInput={saveOrigin}
                    onKeydown={(e: KeyboardEvent) => e.code === "Enter" && saveWord()}
                />
                <ElInput
                    modelValue={editingMask.value}
                    placeholder={t(msg => msg.item.word.mask)}
                    clearable
                    size='small'
                    onClear={() => editingMask.value = ''}
                    class="word-input-right"
                    onInput={val => editingMask.value = val}
                    onKeydown={(e: KeyboardEvent) => e.code === "Enter" && saveWord()}
                    v-slots={{
                        append: () => <>
                            <ElButton icon={<Check />} size='small' onClick={saveWord} />
                            <ElButton icon={<Close />} size='small' onClick={closeInput} />
                        </>
                    }}
                />
            </div>
            <ElButton
                v-show={!editing.value}
                icon={<Plus />}
                size='small'
                style={{ height: "28px" }}
                onClick={showInput}
            >
                {t(msg => msg.dict.button.add)}
            </ElButton>
        </div>
    }
})
