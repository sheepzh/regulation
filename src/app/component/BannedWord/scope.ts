import { defineComponent, h, reactive } from 'vue'
import XGFLFG from '../../..'
import ScopeTest from './scope-test'
import ScopeAdd from './scope-add'
import ScopeList from './scope-list'
import './style/scope'
import { ElMessage, ElSpace } from 'element-plus'
import DictionaryDb from '../../../database/dictionary-db'
import { unreactive } from '../../../common/vue3-extent'

const db: DictionaryDb = new DictionaryDb(chrome.storage.local)

interface Props {
  dict: XGFLFG.Dictionary
}

export default defineComponent({
  name: 'word-scope',
  props: {
    dict: {
      type: Object,
      default: {}
    }
  },
  setup(_prop: any) {
    const dict = (_prop.dict || {}) as XGFLFG.Dictionary
    if (!dict.scopes) {
      dict.scopes = {}
    }
    return reactive({
      dict
    } as Props)
  },
  render(_ctx: any) {
    const scopes = _ctx.dict.scopes || {}
    return h(ElSpace,
      { direction: 'vertical', style: 'width:100%' },
      () => [
        h(ScopeTest, { scopes }),
        h(ScopeAdd, {
          onSaved: (scope: XGFLFG.Scope) => {
            const dict: XGFLFG.Dictionary = _ctx.dict
            if (!dict.scopes) {
              dict.scopes = new Map<string, XGFLFG.Scope>()
            }
            dict.scopes[scope.type + scope.pattern] = scope
            db.update(unreactive(dict) as XGFLFG.Dictionary).then(() => {
              ElMessage.success('添加成功')
            })
          }
        }),
        h('div', { style: 'height:15px; width:100%;' }),
        h(ScopeList, {
          scopes, onDeleted: (key: string) => {
            const dict: XGFLFG.Dictionary = _ctx.dict
            delete dict.scopes[key]
            db.update(dict).then(() => {
              ElMessage.success('删除成功')
            })
          }
        })
      ]
    )
  }
})