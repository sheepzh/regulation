import XGFLFG from ".."
import mergeChildren from "./merger"


const ignoredTags = ['SCRIPT', 'LINK', 'STYLE', 'IFRAME', 'IMG', 'INPUT']

function replaceChildren(node: Node, words: XGFLFG.BannedWordUseReg[]) {
    if (ignoredTags.includes(node.nodeName)) {
        return
    }
    node.childNodes.forEach(child => {
        if (child.nodeName === '#text') {
            child.nodeValue = replaceWithWords(child.nodeValue || '', words)
        } else {
            replaceChildren(child, words)
        }
    })
}

export default function replace(node: Node, words: XGFLFG.BannedWordUseReg[]) {
    mergeChildren(node)

    replaceChildren(node, words)
}

export function replaceWithWords(str: string, words: XGFLFG.BannedWordUseReg[]): string {
    words.forEach(word => str = str.replace(word.origin, word.mask))
    return str
}