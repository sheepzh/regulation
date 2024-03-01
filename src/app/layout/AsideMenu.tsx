import { ElMenu, ElMenuItem } from 'element-plus'
import { defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { I18nKey, t } from '../locale'

type MenuInfo = {
    route: string
    title: I18nKey
}

const menuInfos: MenuInfo[] = [
    {
        route: '/banned-word',
        title: msg => msg.menu.dictionary
    }, {
        route: '/setting',
        title: msg => msg.menu.setting
    }
]

export default defineComponent(() => {
    const router = useRouter()
    return () => (
        <ElMenu
            defaultActive={useRoute().path}
            class="menu"
        >
            {
                menuInfos.map(({ route, title }) =>
                    <ElMenuItem index={route} onClick={() => router.push(route)}>
                        <span class="non-selected">
                            {t(title)}
                        </span>
                    </ElMenuItem>
                )
            }
        </ElMenu>
    )
})
