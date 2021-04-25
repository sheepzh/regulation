import { defineComponent, h, reactive } from 'vue'
import XGFLFG from '../../..'
import ScopeTest from './scope-test'
import ScopeAdd from './scope-add'
import './style/scope'
import { ElMessage, ElSpace } from 'element-plus'
import DictionaryDb from '../../../database/dictionary-db'

const db: DictionaryDb = new DictionaryDb(chrome.storage.local)

interface Props {
  dict: XGFLFG.Dictionary
}

export default defineComponent({
  name: 'word-scope',
  setup(_ctx: any) {
    const dict = _ctx.dict as XGFLFG.Dictionary || {}

    return reactive({
      dict
    } as Props)
  },
  render(_ctx: any) {
    return h(ElSpace,
      { direction: 'vertical', style: 'width:100%' },
      () => [
        h(ScopeTest, { scopes: _ctx.dict.scopes || [] }),
        h(ScopeAdd, {
          onSaved: (scope: XGFLFG.Scope) => {
            const dict: XGFLFG.Dictionary = _ctx.dict
            console.log(dict)
            if (!dict.scopes) {
              const scopes = []
              dict.scopes = reactive(scopes)
            }
            dict.scopes.push(scope)
            console.log(scope, dict)
            db.update(dict).then(() => {
              ElMessage.success('添加成功')
            })
          }
        })
      ]
    )
  }
})