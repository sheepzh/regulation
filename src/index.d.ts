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
    type BannedWord = {
        /**
         * @since 1.0.0
         */
        priority: number
        /**
         * The origin word which is expected to be banned
         */
        origin: string

        /**
         * The mask of banned words
         */
        mask: string
    }

    type BannedWordUseReg = {
        /**
         * The origin word which is expected to be banned
         */
        origin: RegExp

        /**
         * The mask of banned words
         */
        mask: string
    }

    /**
     * Dictionary
     * 
     * @since 0.0.1
     */
    type Dictionary = {
        id?: number
        name?: string
        remark: string
        enabled?: boolean
        /**
         * @since 1.0.0
         */
        priority: number
        scopes?: Scopes
        words: BannedWord[]
    }

    /**
     * The scope of dictionary
     * 
     * @since 0.0.1
     */
    type Scope = {
        /**
         * The regular expression of scope, which is used to filter by host or url
         */
        pattern: string,
        /**
         * Type
         * 
         * 'host' means that reg tests window.location.host
         * 
         * 'url' means that reg tests window.location.href
         */
        type: ScopeType,
        /**
         * Whether to use regular expression
         */
        useReg: boolean
    }

    type Scopes = { [key: string]: Scope }

    type ScopeType = 'host' | 'url'
}