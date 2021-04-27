import XGFLFG from '.'
import replace from './replace/replacer'
import { DictionaryService } from './service/dictionary-service'

const service = new DictionaryService(chrome.storage.local)

const config: MutationObserverInit = { attributes: false, childList: true, subtree: true }

const generateDocumentObserver = (words: XGFLFG.BannedWord[]) => {
    const regWords: XGFLFG.BannedWordUseReg[] = words
        .map(word => {
            return { origin: new RegExp(word.origin.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')), mask: word.mask }
        }
        )
    return new MutationObserver((records: MutationRecord[]) =>
        records.forEach(record => record.addedNodes.forEach(node => replace(node, regWords)))
    )
}

const host = window.location.host
const href = window.location.href

service.listWordsBy(host, href, words => {
    if (words.length) {
        const observer = generateDocumentObserver(words)
        observer.observe(document, config)
        window.onunload = observer.disconnect
        console.log('根据相关法律法规，将审核并替换敏感词')
    }
})

window.onload = () => console.log(document.title)
