/**
 * Determines whether the scope match the host and href
 * 
 * @returns true or false 
 * @since 0.0.1
 * 
 * @throws SyntaxError while the pattern is valid
 */
export const matchScope = (scope: XGFLFG.Scope, host: string, href: string) => {
    const type = scope.type
    const pattern = scope.pattern
    const useReg = scope.useReg

    if (!useReg) {
        return pattern === (type === 'host' ? host : href)
    } else {
        return new RegExp(pattern).test(type === 'host' ? host : href)
    }
}


/**
 * Determines whether any scope match the host and href
 * 
 * @returns true is any scope matches, or false  
 * @since 0.0.1
 * 
 * @throws SyntaxError while the pattern is valid
 */
export function matchScopes(scopes: XGFLFG.Scope[], host: string, href: string): boolean {
    if (!scopes || !scopes.length) {
        return true
    }
    for (const index in scopes) {
        const scope = scopes[index]
        if (matchScope(scope, host, href)) {
            return true
        }
    }
    return false
}