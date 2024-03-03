import { ElIcon, ElMenu, ElMenuItem } from 'element-plus'
import { CSSProperties, VNode, defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { I18nKey, t } from '../locale'
import { Notebook, Setting } from '@element-plus/icons-vue'

type MenuInfo = {
    route: string
    title: I18nKey
    icon?: VNode
}

const menuInfos: MenuInfo[] = [
    {
        route: '/banned-word',
        title: msg => msg.menu.dictionary,
        icon: <Notebook />
    }, {
        route: '/setting',
        title: msg => msg.menu.setting,
        icon: <Setting />
    }
]

const STYLE: Partial<CSSProperties> = {
    minHeight: "100vh",
    backgroundColor: "#1d222d",
}

export default defineComponent(() => {
    const router = useRouter()
    return () => (
        <ElMenu
            defaultActive={useRoute().path}
            style={STYLE}
        >
            {
                menuInfos.map(({ route, title, icon }) =>
                    <ElMenuItem index={route} onClick={() => router.push(route)}>
                        <span class="non-selected">
                            <ElIcon>{icon}</ElIcon>
                            {t(title)}
                        </span>
                    </ElMenuItem>
                )
            }
        </ElMenu>
    )
})
