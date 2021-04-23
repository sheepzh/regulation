import XGFLFG from '..'


const KEY = '_DICT_'
const ID_KEY = '_DICT_ID'
const INITIAL_ID = 1

/**
 * @since 0.0.1
 */
export default class DictionaryDb {

    /**
     * The storage instance
     */
    private storage: chrome.storage.StorageArea

    constructor(storage: chrome.storage.StorageArea) {
        this.storage = storage
    }

    private keyOf(id: number): string {
        return KEY + id.toString()
    }

    private getCurrentId(): Promise<number> {
        return new Promise((resolve) => {
            this.storage.get(ID_KEY, (data: any) => {
                const before = data[ID_KEY]
                if (!before) {
                    resolve(INITIAL_ID)
                } else {
                    resolve((before as number) + 1)
                }
            })
        })
    }

    private updateId(id: number, callback: () => void) {
        const toUpdate = {}
        toUpdate[ID_KEY] = id
        this.storage.set(toUpdate, callback)
    }

    getById(id: number): Promise<XGFLFG.Dictionary> {
        const key = this.keyOf(id)
        return new Promise((resolve, reject) => {
            this.storage.get(key, data => {
                const row = data[key]
                !!row ? resolve(row as XGFLFG.Dictionary) : (reject(new Error('词典不存在')))
            })
        })

    }

    /**
     * List all the records
     * 
     * @param callback 
     */
    listAll(): Promise<XGFLFG.Dictionary[]> {
        return new Promise(resolve => {
            this.storage.get((data: any) => {
                const items: XGFLFG.Dictionary[] = []
                for (let key in data) {
                    if (key.startsWith(KEY) && key !== ID_KEY) {
                        items.push(data[key] as XGFLFG.Dictionary)
                    }
                }
                resolve(items)
            })
        })
    }

    /**
     * Add new record 
     * 
     * @param toAdd the record to add, without uuid in it
     */
    add(toAdd: XGFLFG.Dictionary): Promise<void> {
        return new Promise(
            resolve =>
                this.getCurrentId()
                    .then(
                        id => {
                            const key = this.keyOf(id)
                            toAdd.id = id
                            toAdd.enabled = true
                            toAdd.words = new Map()
                            const toUpdate = {}
                            toUpdate[key] = toAdd
                            this.storage.set(toUpdate, () => this.updateId(id, resolve))
                        }
                    )
        )
    }

    /**
     * Delete by id
     * 
     * @since 0.0.1
     */
    delete(id: number): Promise<void> {
        return new Promise(resolve => this.storage.remove(this.keyOf(id), resolve))
    }

    /**
     * Update enabled
     * 
     * @param id id
     * @param enabled enabled
     */
    updateEnabled(id: number, enabled: boolean,): Promise<void> {
        return new Promise(resolve => {
            this.getById(id)
                .then(
                    dict => {
                        dict.enabled = enabled
                        const toUpdate = {}
                        toUpdate[this.keyOf(id)] = dict
                        this.storage.set(toUpdate, resolve)
                    })
        })
    }

    /**
     * Update the info
     */
    update(dict: XGFLFG.Dictionary): Promise<void> {
        return new Promise(resolve => {
            const id = dict.id
            if (!id) {
                resolve()
            } else {
                const toUpdate = {}
                toUpdate[this.keyOf(id)] = dict
                this.storage.set(toUpdate, resolve)
            }
        })
    }
}