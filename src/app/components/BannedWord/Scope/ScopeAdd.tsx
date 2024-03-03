import { ElButton, ElInput, ElOption, ElRow, ElSelect, ElSwitch, ElTooltip, ElCol, ElMessage } from 'element-plus'
import { defineComponent, ref } from 'vue'
import clipboardy from 'clipboardy'
import { t } from '@app/locale'
import { Plus, DocumentCopy } from '@element-plus/icons-vue'

export default defineComponent({
    emits: {
        save: (_scope: XGFLFG.Scope) => true,
    },
    setup(_, ctx) {
        const pattern = ref('')
        const useReg = ref(false)
        const type = ref<XGFLFG.ScopeType>('host')
        const inputRef = ref<HTMLInputElement>()

        const setPattern = (val?: string) => pattern.value = val?.trim?.()

        const validate = async (): Promise<XGFLFG.Scope> => {
            if (!pattern.value) throw new Error(t(msg => msg.dict.msg.noUrlError))
            if (useReg.value) {
                try {
                    new RegExp(pattern.value)
                } catch (e) {
                    throw new Error(t(msg => msg.dict.msg.invalidRegularError), { cause: e })
                }
            }
            return { useReg: useReg.value, pattern: pattern.value, type: type.value }
        }

        const handleSave = () => validate().then(val => {
            ctx.emit("save", val)
            setPattern()
        }).catch((e: Error) => {
            ElMessage.error(e?.message || "Unknown Error")
            inputRef.value?.focus?.()
        })

        return () => <ElRow gutter={20}>
            <ElCol span={2} class="reg-switch-cell">
                <ElTooltip content={t(msg => msg.dict.msg.useRegularMsg)} placement='left'>
                    <ElSwitch
                        modelValue={useReg.value}
                        onChange={(val: boolean) => useReg.value = val}
                    />
                </ElTooltip>
            </ElCol>
            <ElCol span={22}>
                <ElInput
                    ref={inputRef}
                    modelValue={pattern.value}
                    placeholder={t(msg => msg.dict.msg.urlPlaceholder)}
                    class="scope-input"
                    clearable
                    onInput={setPattern}
                    onKeydown={(e: KeyboardEvent) => e.code === "Enter" && handleSave()}
                    onClear={() => setPattern()}
                    v-slots={{
                        prepend: () => (
                            <ElSelect modelValue={type.value} onChange={(val: XGFLFG.ScopeType) => useReg.value = val === "url"}>
                                <ElOption label={t(msg => msg.item.scopeType.url)} value="url" />
                                <ElOption label={t(msg => msg.item.scopeType.host)} value="host" />
                            </ElSelect>
                        ),
                        append: () => <>
                            <ElButton icon={<Plus />} onClick={handleSave}>
                                {t(msg => msg.dict.button.add)}
                            </ElButton>
                            <ElButton icon={<DocumentCopy />} onClick={() => clipboardy.read().then(setPattern)}>
                                {t(msg => msg.dict.button.paste)}
                            </ElButton>
                        </>
                    }}
                />
            </ElCol>
        </ElRow>
    },
})