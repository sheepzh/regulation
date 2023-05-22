import { ElRow, ElSwitch } from "element-plus";
import { defineComponent, h, ref, Ref, onBeforeMount } from "vue";
import SettingDb from "../../../database/setting-db";
import { t } from "../../locale";

const db: SettingDb = new SettingDb(chrome.storage.local)

export default defineComponent(() => {
    const showButton: Ref<boolean> = ref(false)
    onBeforeMount(() => db.getVisibilityOfButton().then(val => showButton.value = val))
    return () => h('div', { class: 'app-container' }, h(ElRow, {}, () => [
        h(ElSwitch, {
            modelValue: showButton.value,
            style: {
                lineHeight: '50px',
                height: '50px',
                paddingRight: '20px'
            },
            onChange: (val: boolean) => db.updateVisibilityOfButton(showButton.value = val)
        }),
        h('p', t(msg => msg.setting.restoreLabel, { buttonText: t(msg => msg.restore.restoreButton) }))
    ]))
})