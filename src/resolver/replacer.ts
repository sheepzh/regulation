import XGFLFG from ".."
import { ORIGIN_TEXT_ATTR_NAME, REPLACED_CLASS_NAME } from "../constant/element"
import Context from "./context"
import mergeChildren from "./merger"

const ignoredTags = ['SCRIPT', 'LINK', 'STYLE', 'IFRAME', 'IMG', 'INPUT']
class _Replacer {
    nodeId = 0

    private replaceChildren(node: Node, words: XGFLFG.BannedWordUseReg[], context: Context) {
        if (ignoredTags.includes(node.nodeName)) {
            return
        }
        let nodeKey = ''
        if (node instanceof HTMLElement) {
            const ele = node as HTMLElement
            nodeKey = ele.getAttribute(ORIGIN_TEXT_ATTR_NAME) || context.increaseKey()
            ele.classList.add(REPLACED_CLASS_NAME)
            ele.setAttribute(ORIGIN_TEXT_ATTR_NAME, nodeKey)
        }
        for (let i = 0; i < node.childNodes.length; i++) {
            const child = node.childNodes[i]
            if (child.nodeName === '#text') {
                const origin = child.nodeValue
                if (!origin) {
                    continue
                }
                const replaced = this.replaceWithWords(origin, words)
                if (origin !== replaced) {
                    // Replaced
                    child.nodeValue = replaced
                    context.append(nodeKey, i, origin, replaced)
                }
            } else {
                this.replaceChildren(child, words, context)
            }
        }
    }

    public replace(node: Node, words: XGFLFG.BannedWordUseReg[], context: Context) {
        mergeChildren(node)
        this.replaceChildren(node, words, context)
    }

    public replaceWithWords(str: string, words: XGFLFG.BannedWordUseReg[]): string {
        words.forEach(word => str = str.replace(word.origin, word.mask))
        return str
    }
}

const instance = new _Replacer()

export default instance