import XGFLFG from ".."
const { version } = require('../../package.json')

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
export function checkJSON(jsonStr: string) {
    let dict: any
    try {
        dict = JSON.parse(jsonStr)
    } catch {
        return Promise.reject('文件格式不正确')
    }

    if (!dict.name) {
        return Promise.reject('导入词典名称为空')
    } else if (!dict[versionField]) {
        return Promise.reject('软件版本信息不完整')
    }
    return Promise.resolve(dict as XGFLFG.Dictionary)
}