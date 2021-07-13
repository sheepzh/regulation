import { ElRow, ElSwitch } from "element-plus";
import { defineComponent, h, reactive } from "vue";
import SettingDb from "../../../database/setting-db";
import { t } from "../../locale";

const db: SettingDb = new SettingDb(chrome.storage.local)

export default defineComponent({
    name: 'setting',
    setup() {
        const data = {
            showButton: false
        }
        return reactive(data)
    },
    created() {
        db.getVisibilityOfButton().then(val => this.showButton = val)
    },
    render(_ctx: any) {
        const children = h(ElRow, {}, () => [
            h(ElSwitch, {
                modelValue: _ctx.showButton,
                style: {
                    lineHeight: '50px',
                    height: '50px',
                    paddingRight: '20px'
                },
                onChange: (val: boolean) =>
                    db.updateVisibilityOfButton(!!val)
                        .then(() => _ctx.showButton = val)

            }),
            h('p', t(msg => msg.setting.restoreLabel, { buttonText: t(msg => msg.restore.restoreButton) }))
        ])
        const div = h('div', { class: 'app-container' }, children)
        return div
    }
})