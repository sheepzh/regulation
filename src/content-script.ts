import { getRealMask } from './common/default-word'
import BannedWordDb from './database/banned-words'
import XGFLFG from './global'

const db = new BannedWordDb(chrome.storage.local)

let words: XGFLFG.BannedWord[] = []

db.listAll(rows => words = rows)

const config: MutationObserverInit = { attributes: false, childList: true, subtree: true }

const documentObserver = new MutationObserver((records: MutationRecord[], _observer) => {
    records.forEach(record => {
        const addedNodes = record.addedNodes
        addedNodes.forEach(node => {
            if (node instanceof HTMLElement) {
                const element = node as HTMLElement
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