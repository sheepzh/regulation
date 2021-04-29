export default function filter(host: string, url: string) {
    // Skip editing pages of github.com
    if (host === 'github.com' && /^https?:\/\/github.com\/[^\/]+\/[^\/]+\/edit\//.test(url)) {
        return true
    }
    return false
}