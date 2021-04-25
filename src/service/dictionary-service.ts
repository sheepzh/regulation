import XGFLFG from '..'
import DictionaryDb from '../database/dictionary-db'

export class DictionaryService {
    db: DictionaryDb

    constructor(storage: chrome.storage.StorageArea) {
        this.db = new DictionaryDb(storage)
    }

    listWordsByHost(host: string, callback: (rows: XGFLFG.BannedWord[]) => void): void {
        const afterListAll = (all: XGFLFG.Dictionary[]) => {
            all = all
                .filter(dict => !!dict.enabled)
                .filter(dict => {
                    const domains: RegExp[] = dict.domains || []
                    // No domain, means all
                    if (!domains || !domains.length) return true

                    for (const index in domains) {
                        const domain = domains[index]
                        if (domain.test(host)) {
                            return true
                        }
                    }
                    return false
                })
                .sort((a, b) => (a.priority || 0) - (b.priority || 0))
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