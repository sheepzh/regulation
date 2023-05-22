import { ElMenu, ElMenuItem } from 'element-plus'
import { defineComponent, h } from 'vue'
import { Router, useRoute, useRouter } from 'vue-router'
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

const changeRoute = (router: Router, route: string) => router.push(route)
const renderMenu = (router: Router, { route, title }: MenuInfo) => h(
    ElMenuItem,
    {
        index: route,
        onClick: () => changeRoute(router, route)
    },
    () => h('span', { class: 'non-selected' }, t(title))
)

export default defineComponent(() => {
    const router = useRouter()
    const menus = () => menuInfos.map(menu => renderMenu(router, menu))
    return () => h(ElMenu, { defaultActive: useRoute().path, class: 'menu' }, menus)
})
