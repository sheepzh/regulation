import { PropType, defineComponent, watch } from 'vue'
import ScopeTest from './ScopeTest'
import ScopeAdd from './ScopeAdd'
import ScopeList from './ScopeList'
import '../style/scope'
import { ElMessage, ElSpace } from 'element-plus'
import { t } from '@app/locale'
import dictionaryService from '@service/dictionary-service'
import { useShadow } from '@app/hooks/useShadow'

export default defineComponent({
    props: {
        dictId: Number,
        value: Object as PropType<XGFLFG.Scopes>
    },
    emit: {
        change: (_dictId: number, _scopes: XGFLFG.Scopes) => true
    },
    setup(props, ctx) {
        const dictId = useShadow(() => props.dictId)
        const scopes = useShadow(() => props.value)
        watch(scopes, () => ctx.emit("change", dictId.value, scopes.value))

        const handleScopeSave = async (scope: XGFLFG.Scope) => {
            scopes.value = await dictionaryService.saveScope(dictId.value, scope)
            ElMessage.success(t(msg => msg.dict.msg.savedSuccessfully))
        }
        const handleScopeDelete = async (scope: XGFLFG.Scope) => {
            scopes.value = await dictionaryService.removeScope(dictId.value, scope)
        }
        return () => (
            <ElSpace direction='vertical' style={{ width: "100%" }}>
                <ScopeTest scopes={scopes.value} />
                <ScopeAdd onSave={handleScopeSave} />
                <div style={{ height: "15px", width: "100%" }} />
                <ScopeList scopes={scopes.value} closable onDelete={handleScopeDelete} />
            </ElSpace>
        )
    }
})