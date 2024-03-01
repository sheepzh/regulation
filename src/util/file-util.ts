import { version } from '../../package.json'

const versionField = '_version'

export function saveJSON(data: any, filename: string) {
    data[versionField] = version
    if (!filename) filename = 'json.json'
    if (typeof data === 'object') {
        data = JSON.stringify(data, undefined, 4)
    }
    var blob = new Blob([data], { type: 'text/json' }),
        e = document.createEvent('MouseEvents'),
        a = document.createElement('a')
    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    a.dispatchEvent(e)
}

/**
 * Check json string and transfer to XGFLFG.Dictionary
 * 
 * @param jsonStr json 
 * @since 0.0.5
 */
export function checkJSON(jsonStr: string): XGFLFG.Dictionary {
    let dict: XGFLFG.Dictionary
    try {
        dict = JSON.parse(jsonStr)
    } catch {
        return undefined
    }

    if (!dict.name) {
        return undefined
    } else if (!dict[versionField]) {
        return undefined
    }
    return dict
}