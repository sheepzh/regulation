import XGFLFG from '.'
import { DictionaryService } from './service/dictionary-service'

const service = new DictionaryService(chrome.storage.local)


const config: MutationObserverInit = { attributes: false, childList: true, subtree: true }

const generateDocumentObserver = (words: XGFLFG.BannedWord[]) => new MutationObserver((records: MutationRecord[], _observer) => {
    records.forEach(record => {
        const addedNodes = record.addedNodes
        addedNodes.forEach(node => {
            if (node instanceof HTMLElement) {
                const element = node as HTMLElement
                if (element.tagName === 'IFRAME') {
                    // Skip when <iframe>
                    // Because this file will be injected by browser with true of 'all_frames' in manifest.json
                    return
                }

                words.forEach(word => {
                    const { origin, mask } = word
                    if (element.innerText.includes(origin)) {
                        const html = element.innerHTML.replace(origin, mask)
                        element.innerHTML = html
                    }
                })
            }
        })
    })
})

const host = window.location.host
const href = window.location.href

service.listWordsBy(host, href, words => {
    if (words.length) {
        const observer = generateDocumentObserver(words)
        observer.observe(document, config)
        window.onunload = observer.disconnect
        console.log('根据相关法律法规，将审核并替换敏感词')
    } else {
        console.log('根据相关法律法规，该网站不需要审核敏感词')
    }
})

window.onload = () => console.log(document.title)
