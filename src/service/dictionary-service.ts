import { matchScope } from '../common/matcher'
import DictionaryDb from '../database/dictionary-db'


export class DictionaryService {
    db: DictionaryDb

    constructor(storage: chrome.storage.StorageArea) {
        this.db = new DictionaryDb(storage)
    }

    listWordsBy(host: string, href: string, callback: (rows: XGFLFG.BannedWord[]) => void): void {
        const afterListAll = (all: XGFLFG.Dictionary[]) => {
            all = all
                .filter(dict => !!dict.enabled)
                .filter(dict => {
                    // No domain, means all
                    if (!dict.scopes) return true
                    const scopes = Object.values(dict.scopes)
                    if (!scopes.length) return true

                    for (const key in scopes) {
                        const scope = scopes[key] as XGFLFG.Scope
                        if (matchScope(scope, host, href)) {
                            return true
                        }
                    }
                    return false
                })
            const result: XGFLFG.BannedWord[] = []
            const exists = new Set()
            all.forEach(dict => {
                const words = dict.words
                for (let key in words) {
                    const word: XGFLFG.BannedWord = words[key]
                    const origin = word.origin
                    if (!exists.has(origin)) {
                        result.push(word)
                        exists.add(origin)
                    }
                }
            })

            callback(result)
        }

        this.db.listAll().then(afterListAll)
    }
}