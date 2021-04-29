import XGFLFG from '.'
import Context from './resolver/context'
import filter from './resolver/filter'
import replacer from './resolver/replacer'
import generateSwitcher from './resolver/switcher'
import { DictionaryService } from './service/dictionary-service'

const service = new DictionaryService(chrome.storage.local)

const config: MutationObserverInit = { attributes: false, childList: true, subtree: true }

const context = new Context()

const generateDocumentObserver = (words: XGFLFG.BannedWordUseReg[]) => {
    return new MutationObserver((records: MutationRecord[]) =>
        records.forEach(record => record.addedNodes.forEach(node => replacer.replace(node, words, context)))
    )
}

const host = window.location.host
const href = window.location.href

if (filter(host, href)) {
    console.log('该网址不在相关法律法规管辖范围之内')
} else {
    service.listWordsBy(host, href, words => {
        if (words.length) {

            const regWords: XGFLFG.BannedWordUseReg[] = words
                .map(word => {
                    return { origin: new RegExp(word.origin.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')), mask: word.mask }
                })

            document.title = replacer.replaceWithWords(document.title, regWords)
            const observer = generateDocumentObserver(regWords)

            observer.observe(document, config)
            window.onunload = observer.disconnect
            console.log('根据相关法律法规，将审核并替换敏感词')

            const switcher = generateSwitcher(context)
            window.onload = () => document.body.append(switcher)
        }
    })
}