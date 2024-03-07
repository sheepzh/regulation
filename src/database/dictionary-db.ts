import BaseDb from './common/base-db'

const KEY = '_DICT_'
const ID_KEY = '_DICT_ID'
const INITIAL_ID = 1

const keyOf = (id: number) => KEY + id.toString()

/**
 * @since 0.0.1
 */
export default class DictionaryDb extends BaseDb {
    private async getCurrentId(): Promise<number> {
        const data: any = await this.storage.get(ID_KEY)
        const before = data[ID_KEY]
        if (!before) {
            return INITIAL_ID
        } else {
            return (before as number) + 1
        }
    }

    private async updateId(id: number): Promise<void> {
        await this.setByKey(ID_KEY, id)
    }

    async getById(id: number): Promise<XGFLFG.Dictionary> {
        const key = keyOf(id)
        const data = await this.storage.get(key)
        const row = data[key] as XGFLFG.Dictionary
        if (!row) throw new Error('Not found')
        return this.compatibleElderFormat(row)
    }

    private compatibleElderFormat(dict: XGFLFG.Dictionary): XGFLFG.Dictionary {
        if (!dict) return dict
        if (typeof dict.words === "object" && !Array.isArray(dict.words)) {
            dict.words = Object.values(dict.words)
        }
        return dict
    }

    /**
     * List all the records
     * 
     * @param callback 
     */
    async listAll(): Promise<XGFLFG.Dictionary[]> {
        const allData = await this.storage.get()
        return Object.entries(allData)
            .filter(([key]) => key.startsWith(KEY) && key !== ID_KEY)
            .map(([_key, value]) => value as XGFLFG.Dictionary)
            .map(dict => this.compatibleElderFormat(dict))
    }

    /**
     * Add new record 
     * 
     * @param toAdd the record to add, without uuid in it
     */
    async add(toAdd: XGFLFG.Dictionary): Promise<void> {
        const id = await this.getCurrentId()
        const key = keyOf(id)
        toAdd.id = id
        toAdd.enabled = true
        toAdd.words = []
        await this.setByKey(key, toAdd)
        await this.updateId(id)
    }

    /**
     * Import from file 
     * 
     * @param toImport the record to import, without uuid in it
     * @since 0.0.5
     */
    async import(toImport: XGFLFG.Dictionary): Promise<void> {
        const id = await this.getCurrentId()
        const key = keyOf(id)
        toImport.id = id
        toImport.enabled = true
        await this.setByKey(key, toImport)
        await this.updateId(id)
    }

    /**
     * Delete by id
     * 
     * @since 0.0.1
     */
    async delete(id: number): Promise<void> {
        await this.storage.remove(keyOf(id))
    }

    /**
     * Update enabled
     * 
     * @param id id
     * @param enabled enabled
     */
    async updateEnabled(id: number, enabled: boolean,): Promise<void> {
        const exist = await this.getById(id)
        exist.enabled = enabled
        this.setByKey(keyOf(id), exist)
    }

    /**
     * Update the info
     */
    async update(dict: XGFLFG.Dictionary): Promise<void> {
        const id = dict.id
        if (!id) {
            return
        }
        await this.setByKey(keyOf(id), dict)
    }

    async updateAll(dicts: XGFLFG.Dictionary[]): Promise<void> {
        if (!dicts?.length) return
        for (const dict of dicts) {
            await this.update(dict)
        }
    }
}