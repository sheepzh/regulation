/**
 * Nonreactive proxy data for saving in firefox and edge
 * 
 * @param proxy 
 */
export function nonreactive(proxy: Object): Object {
    const obj = new Object()
    for (const key in proxy) {
        const proxyVal = proxy[key]
        obj[key] = proxyVal instanceof Object ? nonreactive(proxyVal) : proxyVal
    }
    return obj
}