
const mergedTags = ['EM', 'B', 'I', 'U', '#text']

/**
 * Judge the same format nodes
 * 
 * @param left one
 * @param right another
 */
const canMerge = (left: Node, right: Node) => {
    const lt = left.nodeName, rt = right.nodeName
    // Type must be the same
    if (typeof left !== typeof right || lt !== rt) {
        return false
    }
    // Specific types
    if (!mergedTags.includes(lt) || !mergedTags.includes(rt)) {
        return false
    }
    // If html nodes, must own the same length attributes
    if (left instanceof HTMLElement) {
        const lEle = left as HTMLElement, rEle = right as HTMLElement
        const lAttr = lEle.attributes, rAttr = rEle.attributes
        if (lAttr.length !== rAttr.length) {
            return false
        }
        for (let key in lAttr) {
            const rA = rAttr.getNamedItem(key)
            if (!rA) return false
            const lA = lAttr.getNamedItem(key)
            if (!lA) return false
            if (lA.value !== rA.value) return false
        }
    }
    return true
}

const merge = (left: Node, right: Node) => {
    if (left.nodeName === '#text') {
        left.nodeValue = (left.nodeValue || '') + (right.nodeValue || '')
    } else {
        right.childNodes.forEach(c => left.appendChild(c))
    }
}

export default function mergeChildren(node: Node): void {

    const children = node.childNodes

    let lastElement: Node | null = null
    for (let index = 0; index < children.length; index++) {
        const child = children[index]

        if (lastElement === null) {
            // No last element
            lastElement = child
        } else {
            if (canMerge(lastElement, child)) {
                // Merge and remove the right one
                merge(lastElement, child)
                node.removeChild(child)
            } else {
                // Recursion for this child
                mergeChildren(lastElement)
                lastElement = child
            }
        }
        if (lastElement !== null) {
            mergeChildren(lastElement)
        }
    }
}
