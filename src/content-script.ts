import XGFLFG from '.'
import { getRealMask } from './common/default-word'
import { DictionaryService } from './service/dictionary-service'

const service = new DictionaryService(chrome.storage.local)

let words: XGFLFG.BannedWord[] = []

service.listWordsByHost(window.location.host, rows => words = rows)

const config: MutationObserverInit = { attributes: false, childList: true, subtree: true }

const documentObserver = new MutationObserver((records: MutationRecord[], _observer) => {
    records.forEach(record => {
        const addedNodes = record.addedNodes
        addedNodes.forEach(node => {
            if (node instanceof HTMLElement) {
                const element = node as HTMLElement
                if (element.tagName === 'IFRAME') {
                    const iframe = element as HTMLIFrameElement
                    iframe.onload = _ => {
                        const document = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document)
                        console.log(document)
                        if (document !== null) {
                            documentObserver.observe(document, config)
                        }
                    }

                }
                words.forEach(word => {
                    const { origin, mask } = word
                    if (element.innerText.includes(origin)) {
                        const realMask = getRealMask(origin, mask)
                        const html = element.innerHTML.replace(origin, realMask)
                        element.innerHTML = html
                    }
                })
            }
        })
    })
})

documentObserver.observe(document, config)