const PREFIX = '_SETTING_'
const BUTTON_VISIBLITY = PREFIX + 'BUTTON_VISIBLITY_'
export default class SettingDb {
    /**
      * The storage instance
      */
    private storage: chrome.storage.StorageArea

    constructor(storage: chrome.storage.StorageArea) {
        this.storage = storage
    }

    /**
     * Update the visiblity of button
     * 
     * @param val val
     */
    updateVisiblityOfButton(val: boolean): Promise<void> {
        const toUpdate = {}
        toUpdate[BUTTON_VISIBLITY] = val
        return new Promise(resolve => this.storage.set(toUpdate, resolve))
    }

    /**
     * Get the visiblity of button
     * 
     * @param val val
     */
    getVisiblityOfButton(): Promise<boolean> {
        return new Promise(resolve => {
            this.storage.get(BUTTON_VISIBLITY, items => resolve(items[BUTTON_VISIBLITY] || false))
        })
    }
}