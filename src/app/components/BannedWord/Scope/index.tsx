import { PropType, defineComponent, ref } from 'vue'
import ScopeTest from './ScopeTest'
import ScopeAdd from './ScopeAdd'
import ScopeList from './ScopeList'
import '../style/scope'
import { ElMessage, ElSpace } from 'element-plus'
import DictionaryDb from '@db/dictionary-db'
import { t } from '@app/locale'

const db: DictionaryDb = new DictionaryDb(chrome.storage.local)

export default defineComponent({
    props: {
        dict: Object as PropType<XGFLFG.Dictionary>
    },
    setup({ dict }) {
        const myDict = ref(dict)
        const handleScopeSave = async (scope: XGFLFG.Scope) => {
            const val = { ...myDict.value || {} }
            !val.scopes && (val.scopes = {})
            val.scopes[scope.type + scope.pattern] = scope
            await db.update(val as XGFLFG.Dictionary)
            ElMessage.success(t(msg => msg.dict.msg.savedSuccessfully))
        }
        const handleScopeDelete = async (key: string) => {
            const val = { ...myDict.value || {} }
            delete val?.scopes?.[key]
            await db.update(val as XGFLFG.Dictionary)
        }
        return () => (
            <ElSpace direction='vertical' style={{ width: "100%" }}>
                <ScopeTest scopes={dict?.scopes} />
                <ScopeAdd onSave={handleScopeSave} />
                <div style={{ height: "15px", width: "100%" }} />
                <ScopeList scopes={dict.scopes} closable onDelete={handleScopeDelete} />
            </ElSpace>
        )
    }
})