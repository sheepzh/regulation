import { ElRow, ElSwitch } from "element-plus";
import { defineComponent, h, reactive } from "vue";
import SettingDb from "../../../database/setting-db";

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
        db.getVisiblityOfButton().then(val => this.showButton = val)
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
                    db.updateVisiblityOfButton(!!val)
                        .then(() => _ctx.showButton = val)

            }),
            h('p', '勾选该开关，界面右下角会出现【显示违禁词】按钮，点击之后页面里的安全词将还原成违禁词。')
        ])
        const div = h('div', { class: 'app-container' }, children)
        return div
    }
})