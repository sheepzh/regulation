
/**
 * Get the default mask which is as the same long as the banned word and full of star signs.
 *
 * @since 0.0.1 
 * @param origin origin banned word
 * @returns default mask
 */
export function getDefaultMask(origin: string): string {
    const length: number = origin ? origin.length : 0
    return Array.from({ length }, () => '*').join('')
}

/**
 * Get the effective mask with origin and mask
 * 
 * @since 0.0.1
 * @returns real mask
 */
export function getRealMask(origin: string, mask: string | undefined): string {
    return mask || getDefaultMask(origin)
}
