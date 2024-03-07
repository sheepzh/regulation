import { ElTable, ElTableColumn, ElSwitch, ElButton, ElTag, ElMessageBox, ElMessage, ElDialog, ElTooltip, ElSpace } from 'element-plus'
import { defineComponent, ref, watch } from 'vue'
import Word from './Word'
import Scope from './Scope'
import ScopeList from './Scope/ScopeList'
import { nonreactive } from '@common/vue3-extent'
import { saveJSON } from "@util/file-util"
import { t } from '@app/locale'
import { Top, Bottom } from '@element-plus/icons-vue'
import { DictionaryService } from '@service/dictionary-service'

const service: DictionaryService = new DictionaryService(chrome.storage.local)

export type TableInstance = {
    query: () => void
}

const renderOperationButton = (
    name: string,
    onClick: () => void
) => <ElButton link size='small' type='primary' onClick={onClick}>
        {name}
    </ElButton>

const formatLength = (row: XGFLFG.Dictionary) => `${Object.values(row.words).length || 0}`

const doShift = (list: XGFLFG.Dictionary[], idx: number, topOrDown: boolean): XGFLFG.Dictionary[] => {
    if (!list?.length) return []
    const copy = [...list]
    const targetIdx = idx + (topOrDown ? -1 : 1)
    if (!Object.hasOwn(list, targetIdx)) return copy
    const temp = copy[idx]
    copy[idx] = copy[targetIdx]
    copy[targetIdx] = temp
    return copy
}

export default defineComponent({
    emits: {
        edit: (_row: XGFLFG.Dictionary) => true
    },
    setup: (_, ctx) => {
        const list = ref<XGFLFG.Dictionary[]>([])
        const current = ref<XGFLFG.Dictionary>()
        const wordOpen = ref(false)
        const scopeOpen = ref(false)

        const query = async () => {
            const dicts = await service.listAllDicts()
            list.value = dicts
            console.log(dicts)
        }
        query()
        const instance: TableInstance = { query }
        ctx.expose(instance)

        const handleShift = async (idx: number, topOrDown: boolean) => {
            const newList = doShift(list.value, idx, topOrDown)
            await service.saveAll(newList)
            query()
        }

        return () => (
            <div style={{ width: "100%", marginTop: "20px" }}>
                <ElTable data={list.value} style={{ width: "100%" }} size='small' border fit>
                    <ElTableColumn prop='name' align='center' minWidth={40} label={t(msg => msg.item.name)} />
                    <ElTableColumn align='center' minWidth={40} label={t(msg => msg.item.wordCount)} formatter={formatLength} />
                    <ElTableColumn align='center' minWidth={40} label={t(msg => msg.item.scope)}>
                        {({ row }: { row: XGFLFG.Dictionary }) => {
                            const full = !row.scopes || !Object.values(row.scopes).length
                            const tag = (
                                <ElTag type={full ? "info" : undefined} size='small'>
                                    {t(msg => full ? msg.item.scopeResult.all : msg.item.scopeResult.some)}
                                </ElTag>
                            )
                            return full
                                ? tag
                                : <ElTooltip
                                    placement='top'
                                    effect='light'
                                    v-slots={{
                                        default: tag,
                                        content: <ScopeList scopes={row.scopes || {}} tooltipEffect="light" />
                                    }}
                                />
                        }}
                    </ElTableColumn>
                    <ElTableColumn prop="remark" align="center" minWidth={80} label={t(msg => msg.item.remark)} />
                    <ElTableColumn align='center' minWidth={30} label={t(msg => msg.item.enabled)}>
                        {({ row }: { row: XGFLFG.Dictionary }) => {
                            const id = row.id
                            return <ElSwitch
                                modelValue={row?.enabled}
                                onChange={(val: boolean) => id && service.updateEnabled(id, val).then(() => row.enabled = val)}
                            />
                        }}
                    </ElTableColumn>
                    <ElTableColumn align='center' minWidth={30} label={t(msg => msg.item.priority)}>
                        {({ row, $index }: { row: XGFLFG.Dictionary, $index: number }) => {
                            const isFirst = $index === 0
                            const isLast = $index === (list.value?.length ?? 0) - 1
                            return <ElSpace>
                                <ElButton icon={<Top />} circle disabled={isFirst} onClick={() => handleShift($index, true)} />
                                <ElButton icon={<Bottom />} circle disabled={isLast} onClick={() => handleShift($index, false)} />
                            </ElSpace>
                        }}
                    </ElTableColumn>
                    <ElTableColumn align='center' minWidth={70} label={t(msg => msg.item.operation)}>
                        {({ row }: { row: XGFLFG.Dictionary }) => {
                            return [
                                // Word management
                                renderOperationButton(t(msg => msg.item.words), () => {
                                    current.value = row
                                    wordOpen.value = true
                                }),
                                // Scope management
                                renderOperationButton(t(msg => msg.item.scope), () => {
                                    current.value = row
                                    scopeOpen.value = true
                                }),
                                // Edit
                                renderOperationButton(t(msg => msg.dict.button.edit), () => ctx.emit("edit", row)),
                                // Delete
                                renderOperationButton(t(msg => msg.dict.button.delete), () => {
                                    ElMessageBox.confirm(
                                        t(msg => msg.dict.msg.deleteConfirmMsg, { name: row.name }),
                                        t(msg => msg.dict.msg.operationConfirmation),
                                        {
                                            cancelButtonText: t(msg => msg.dict.button.giveUp),
                                            confirmButtonText: t(msg => msg.dict.button.ok),
                                            type: 'warning'
                                        }
                                    )
                                        .then(() => service.deleteById(row.id || 0))
                                        .then(() => {
                                            ElMessage.success(t(msg => msg.dict.msg.deletedSuccessfully))
                                            query()
                                        }).catch(() => { })
                                }),
                                // Export
                                renderOperationButton(t(msg => msg.dict.button.export), () => {
                                    const toExport = nonreactive(row)
                                    delete toExport.id
                                    delete toExport.enabled
                                    saveJSON(toExport, `${t(msg => msg.app.name)}_${row.name || 'UNNAMED'}.json`)
                                })
                            ]
                        }}
                    </ElTableColumn>
                </ElTable>
                {
                    current.value && <>
                        <ElDialog
                            title={`${t(msg => msg.item.scope)} - ${current.value.name}`}
                            modelValue={scopeOpen.value}
                            destroyOnClose
                            onClosed={() => scopeOpen.value = false}
                        >
                            <Scope dict={current.value} />
                        </ElDialog>
                        <ElDialog
                            title={`${t(msg => msg.item.words)} - ${current.value?.name}`}
                            modelValue={wordOpen.value}
                            destroyOnClose
                            onClosed={() => wordOpen.value = false}
                        >
                            <Word dict={current.value} />
                        </ElDialog>
                    </>
                }
            </div>
        )
    }
})
