import SettingDb from '../database/setting-db'
import Context from './resolver/context'
import filter from './resolver/filter'
import Replacer from './resolver/replacer'
import generateSwitcher from './resolver/switcher'
import { DictionaryService } from '../service/dictionary-service'

const service = new DictionaryService(chrome.storage.local)

const settingDb = new SettingDb(chrome.storage.local)

const config: MutationObserverInit = { attributes: false, childList: true, subtree: true }

const context = new Context()

const generateDocumentObserver = (replacer: Replacer) => {
    return new MutationObserver((records: MutationRecord[]) =>
        records.forEach(record => record.addedNodes.forEach(node => replacer.replaceNode(node)))
    )
}

async function processSwitcher() {
    const showVisibilityButton = await settingDb.getVisibilityOfButton()
    if (!showVisibilityButton) {
        return
    }

    const switcher = generateSwitcher(context)
    window.onload = () => document.body.append(switcher)
}

async function main() {
    const host = window.location.host
    const href = window.location.href

    const ignored = filter(host, href)
    if (ignored) {
        return
    }

    const originWords: XGFLFG.BannedWord[] = await service.listWords(host, href)
    if (!originWords?.length) {
        return
    }

    const words: XGFLFG.BannedWordUseReg[] = originWords.map(word => ({
        origin: new RegExp(word.origin.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'g'),
        mask: word.mask
    }))

    const replacer = new Replacer(words, context)
    document.title = replacer.replaceStr(document.title)

    if (document.body) {
        // Resolve static dom nodes
        document.body.childNodes.forEach(node => replacer.replaceNode(node))
    }

    const observer = generateDocumentObserver(replacer)

    observer.observe(document, config)
    window.addEventListener("load", observer.disconnect)

    processSwitcher()
}

main()
