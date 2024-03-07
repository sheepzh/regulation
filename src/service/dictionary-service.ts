import { matchScope } from '../common/matcher'
import DictionaryDb from '../database/dictionary-db'

export class DictionaryService {
    db: DictionaryDb

    constructor(storage: chrome.storage.StorageArea) {
        this.db = new DictionaryDb(storage)
    }

    async listWords(host: string, href: string): Promise<XGFLFG.BannedWord[]> {
        const allValid = (await this.listAllDicts())
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
        allValid.forEach(
            dict => (dict.words || [])
                .forEach(word => {
                    const origin = word.origin
                    if (exists.has(origin)) return
                    result.push(word)
                    exists.add(origin)
                })
        )
        return result
    }

    async listAllDicts(): Promise<XGFLFG.Dictionary[]> {
        let dicts = await this.db.listAll()
        dicts = dicts.sort((a, b) => (a.priority || 0) - (b.priority || 0))
        dicts?.forEach(dict => {
            const words = dict.words || []
            dict.words = words.sort((a, b) => (a.priority || 0) - (b.priority || 0))
        })
        return dicts
    }

    async saveAll(dicts: XGFLFG.Dictionary[]): Promise<void> {
        if (!dicts.length) return
        dicts.forEach((d, i) => d.priority = i)
        for (const dict of dicts) {
            await this.db.update(dict)
        }
    }

    async deleteById(id: number) {
        await this.db.delete(id)
    }

    async updateEnabled(id: number, val: boolean) {
        await this.db.updateEnabled(id, val)
    }

    async save(toSave: XGFLFG.Dictionary) {
        await this.db.update(toSave)
    }

    async add(toAdd: XGFLFG.Dictionary) {
        const all = await this.listAllDicts()
        const beforePriority = all.findLast(_ => true)?.priority ?? -1
        toAdd.priority = beforePriority + 1
        await this.db.add(toAdd)
    }
}