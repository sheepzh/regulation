import StoragePromise from "./storage-promise"

export default abstract class BaseDb {
    storage: StoragePromise
    constructor(storageArea: chrome.storage.StorageArea) {
        this.storage = new StoragePromise(storageArea)
    }

    /**
     * @since 0.2.2
     * @param key key
     * @param obj data
     * @returns 
     */
    protected setByKey(key: string, obj: Object): Promise<void> {
        const toUpdate = {}
        toUpdate[key] = obj
        return this.storage.set(toUpdate)
    }
}