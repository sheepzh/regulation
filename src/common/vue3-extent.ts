/**
 * Nonreactive proxy data for saving in firefox and edge
 * 
 * @param proxy 
 */
export function nonreactive<T extends Record<string, any>>(proxy: T): T {
    const obj: Record<string, any> = {}
    for (const key in proxy) {
        const proxyVal: any = proxy[key]
        obj[key] = proxyVal instanceof Object ? nonreactive(proxyVal) : proxyVal
    }
    return obj as T
}