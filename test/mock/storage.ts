

class MockStorage implements chrome.storage.StorageArea {
    get(callback: (items: { [key: string]: any; }) => void): void;
    get(keys: string | Object | string[], callback: (items: { [key: string]: any; }) => void): void;
    get(keys: any, callback?: any) {
        const items = {}
        if (keys instanceof String) {
            this.fillVal(keys as string, items)
        } else if (keys instanceof Array) {
            (keys as Array<string>).forEach(key => this.fillVal(key, items))
        } else if (keys instanceof Object) {
            Object.keys(keys).forEach(key => this.fillVal(key, items))
        }
        callback && callback(items)
    }
    QUOTA_BYTES: number = 1024 * 1024 * 5

    private data: any = {}

    getBytesInUse(callback: (bytesInUse: number) => void): void;
    getBytesInUse(keys: string | string[], callback: (bytesInUse: number) => void): void;
    getBytesInUse(_keys: any, callback?: any) {
        callback && callback(0)
    }

    clear(callback?: () => void): void {
        this.data = {}
        callback && callback()
    }

    set(items: Object, callback?: () => void): void {
        for (const key in items) {
            this.data[key] = items[key]
        }
        callback && callback()
    }

    remove(keys: string | string[], callback?: () => void): void {
        if (keys instanceof String) {
            delete this.data[keys as string]
        } else {
            (keys as string[]).forEach(key => delete this.data[key])
        }
        callback && callback()
    }

    private fillVal(key: string, items: { [key: string]: any; }) {
        const val = this.data[key]
        val !== undefined && val !== null && (items[key] = val)
    }
}

export default new MockStorage()