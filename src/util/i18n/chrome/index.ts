import { Locale } from ".."
import compile from "./compile"
import messages from "./messages"

const _default: { [locale in Locale]: any } = {
    zh_CN: compile(messages.zh_CN),
    en: compile(messages.en),
}

export default _default