import { ORIGIN_TEXT_ATTR_NAME, REPLACED_CLASS_NAME } from "../constant/element"
import Context from "./context"

const SHOW = '显示违禁词'
const HIDE = '隐藏违禁词'

export default function generate(context: Context): Element {
    const div = document.createElement('div')
    const style = div.style
    style.bottom = '10px'
    style.right = '10px'
    style.height = '20px'
    style.lineHeight = '20px'
    style.width = '60px'
    style.fontSize = '12px'
    style.zIndex = '10000'
    style.position = 'fixed'
    style.cursor = 'pointer'

    div.id = 'regulation-switch'

    div.textContent = SHOW

    div.onclick = () => {
        const text = div.textContent
        // Reverse text
        div.textContent = text === SHOW ? HIDE : SHOW

        const eleArr: Element[] = Array.from(document.getElementsByClassName(REPLACED_CLASS_NAME))
        eleArr.forEach(ele => {
            const nodeKey = ele.getAttribute(ORIGIN_TEXT_ATTR_NAME)
            if (!nodeKey) return

            for (let i = 0; i < ele.childNodes.length; i++) {
                const childNode = ele.childNodes[i]

                if (childNode.nodeName !== '#text') {
                    continue
                }
                const nodeVal = text === SHOW ? context.getOrigin(nodeKey, i) : context.getReplaced(nodeKey, i)
                if (!nodeVal) return
                childNode.nodeValue = nodeVal
            }
        })
    }
    return div
}