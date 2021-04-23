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
         * The origin word which is excpected to be banned
         */
        origin: string

        /**
         * The mask of banned words
         */
        mask?: string
    }

    /**
     * Dictionary
     * 
     * @since 0.0.1
     */
    export interface Dictionary {
        id?: number
        name?: string
        remark: string
        enabled?: boolean
        priority?: number
        domains?: RegExp[]
        words: any
    }

    /**
     * Parameters for page 
     * 
     * @since 0.0.1
     */
    export interface PageParam {
        num: number
        size: number
    }

    /**
     * The result of page query
     * 
     * @since 0.0.1
     */
    export interface PageResult<T> {
        /**
         * Total num
         */
        total: number
        page: PageParam
        list: T[]
    }
}

export default XGFLFG