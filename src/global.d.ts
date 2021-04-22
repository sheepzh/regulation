/**
 * Xiang Guan Fa Lv Fa Gui
 * 
 * @since 0.0.1
 */
declare namespace XGFLFG {
    /**
     * The banned word
     * 
     * @since 0.0.1
     */
    export interface BannedWord {
        /**
         * Id of the word
         */
        uuid: string

        /**
         * The origin word which is excpected to be banned
         */
        origin: string
        /**
         * The mask of banned words
         */
        mask?: string
    }

    /**
     * The storage
     */
    export type Storage = chrome.storage.StorageArea
}

export default XGFLFG