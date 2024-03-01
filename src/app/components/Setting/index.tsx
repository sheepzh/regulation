import { ElRow, ElSwitch } from "element-plus"
import { defineComponent, ref, Ref, onBeforeMount } from "vue"
import SettingDb from "@db/setting-db"
import { t } from "@app/locale"

const db: SettingDb = new SettingDb(chrome.storage.local)

export default defineComponent(() => {
    const showButton: Ref<boolean> = ref(false)
    onBeforeMount(() => db.getVisibilityOfButton().then(val => showButton.value = val))
    return () => (
        <div class="app-container">
            <ElRow>
                <ElSwitch
                    modelValue={showButton.value}
                    style={{
                        lineHeight: '50px',
                        height: '50px',
                        paddingRight: '20px'
                    }}
                    onChange={(val: boolean) => db.updateVisibilityOfButton(showButton.value = val)}
                />
                <p>{t(msg => msg.setting.restoreLabel, { buttonText: t(msg => msg.restore.restoreButton) })}</p>
            </ElRow>
        </div>
    )
})