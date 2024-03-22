import { matchScope } from '../common/matcher'
import DictionaryDb from '../database/dictionary-db'

const keyOfScope = (scope: XGFLFG.Scope) => {
    if (!scope) return undefined
    const { type, pattern } = scope
    return type + pattern
}

class DictionaryService {
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
                return scopes?.some?.(scope => matchScope(scope, host, href))
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

    async saveScope(id: number, scope: XGFLFG.Scope): Promise<XGFLFG.Scopes> {
        const dict = await this.db.getById(id)
        if (!dict) return
        if (!dict.scopes) dict.scopes = {}
        dict.scopes[keyOfScope(scope)] = scope
        await this.db.update(dict)
        return dict.scopes
    }

    async removeScope(id: number, scope: XGFLFG.Scope): Promise<XGFLFG.Scopes> {
        const dict = await this.db.getById(id)
        if (!dict) return
        if (!dict.scopes) return {}
        delete dict.scopes[keyOfScope(scope)]
        await this.db.update(dict)
        return dict.scopes
    }

    getById(id: number): Promise<XGFLFG.Dictionary> {
        return this.db.getById(id)
    }

    async deleteWord(id: number, origin: string): Promise<XGFLFG.BannedWord[]> {
        const dict = await this.db.getById(id)
        if (!dict) return
        dict.words = (dict.words || []).filter(w => w.origin !== origin)
        await this.db.update(dict)
        return dict.words
    }

    async saveWord(id: number, origin: string, mask: string): Promise<XGFLFG.BannedWord[]> {
        const dict = await this.db.getById(id)
        if (!dict) return
        const words = dict.words || []
        const exist = words.find(w => w.origin === origin)
        if (exist) {
            exist.mask = mask
            dict.words = words
        } else {
            words.push({ mask, origin, priority: words?.length ?? 0 })
        }
        dict.words = words
        await this.db.update(dict)
        return words
    }
}

const dictionaryService = new DictionaryService(chrome.storage.local)

export default dictionaryService