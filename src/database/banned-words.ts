import XGFLFG from '../global'
import { v4 as uuid } from 'uuid'

const KEY = '__BANNED__'


/**
 * @since 0.0.1
 */
export default class BannedWordDb {

    /**
     * The storage instance
     */
    private storage: chrome.storage.StorageArea

    constructor(storage: chrome.storage.StorageArea) {
        this.storage = storage
    }

    private keyOf(origin: string): string {
        return KEY + origin
    }

    /**
     * List all the records
     * 
     * @param callback 
     */
    listAll(callback: (rows: XGFLFG.BannedWord[]) => void): void {
        this.storage.get((data: any) => {
            const items = []
            for (let key in data) {
                if (key.startsWith(KEY)) {
                    items.push(data[key] as XGFLFG.BannedWord)
                }
            }
            callback && callback(items)
        })
    }

    /**
     * Add new record 
     * 
     * @param toAdd the record to add, without uuid in it
     */
    add(toAdd: XGFLFG.BannedWord, callback: (successed: boolean, errorMessage?: string) => void) {
        const key: string = this.keyOf(toAdd.origin)
        this.storage.get(key, rows => {
            if (!Object.keys(rows).length) {
                // Not exists
                toAdd.uuid = uuid()
                rows[key] = toAdd
                this.storage.set(rows, () => callback(true))
            } else {
                // Exists
                callback(false, '该违禁词已存在！')
            }
        })
    }

    /**
     * Delete the word either exist or not
     */
    delete(origin: string, callback: () => void) {
        this.storage.remove(this.keyOf(origin), callback)
    }
}