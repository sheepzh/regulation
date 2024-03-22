import { PropType, StyleValue, defineComponent, ref, watch } from 'vue'
import { ElButton, ElInput, ElMessage, ElMessageBox, ElTag } from 'element-plus'
import { getRealMask } from '@common/default-word'
import './style/word'
import { t } from '@app/locale'
import { Plus, Close, Check } from "@element-plus/icons-vue"
import dictionaryService from '@service/dictionary-service'
import { useShadow } from '@app/hooks/useShadow'

const CONTAINER_STYLE: StyleValue = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
}

export default defineComponent({
    props: {
        dictId: Number,
        value: Array as PropType<XGFLFG.BannedWord[]>
    },
    setup(props) {
        const dictId = useShadow(() => props.dictId)
        const words = useShadow(() => props.value)

        const editing = ref(false)
        const editingOrigin = ref('')
        const originInput = ref<HTMLInputElement>()
        const editingMask = ref('')
        const handleDelete = async (origin: string) => {
            words.value = await dictionaryService.deleteWord(dictId.value, origin)
            ElMessage.success(t(msg => msg.dict.msg.wordDeleteConfirmMsg, { origin }))
        }
        const showInput = () => editing.value = true
        const saveOrigin = (val?: string) => editingOrigin.value = val
        const saveWord = () => {
            const origin = editingOrigin.value?.trim?.()
            if (!origin) return ElMessage.error(t(msg => msg.dict.msg.noOriginWordError))
            const mask = getRealMask(origin, editingMask.value)

            const doUpdate = async () => {
                words.value = await dictionaryService.saveWord(dictId.value, origin, mask)

                editingMask.value = editingOrigin.value = ''
                originInput.value?.focus?.()
            }

            const existing = words.value?.find(w => w.origin === origin)
            if (existing) {
                ElMessageBox.confirm(
                    t(msg => msg.dict.msg.wordExistConfirmation, { word: origin, oldMask: existing.mask, newMask: mask }),
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

        return () => <div style={CONTAINER_STYLE}>
            {
                (words.value || []).map(({ origin, mask }) => {
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
            <div v-show={editing.value} style={{ "margin-right": "auto" }}>
                <ElInput
                    modelValue={editingOrigin.value}
                    ref={originInput}
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
                            <ElButton icon={<Close />} size='small' onClick={() => editing.value = false} />
                        </>
                    }}
                />
            </div>
            <ElButton
                v-show={!editing.value}
                icon={<Plus />}
                size='small'
                style={{ height: "28px", "margin-right": "auto" }}
                onClick={showInput}
            >
                {t(msg => msg.dict.button.add)}
            </ElButton>
        </div>
    }
})
