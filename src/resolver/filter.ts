export default function filter(host: string, url: string) {
    if (/^https?:\/\/github.com\/[^\/]+\/[^\/]+\/edit\//.test(url)) {
        return true
    }
    return false
}