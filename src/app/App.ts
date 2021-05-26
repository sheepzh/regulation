import { ElAside, ElContainer, ElMain } from 'element-plus'
import { defineComponent, EmitsOptions, h, SetupContext } from 'vue'
import { RouterView } from 'vue-router'
import AsideMenu from './layout/aside-menu'

export default defineComponent((_props: Readonly<{}>, _ctx: SetupContext<EmitsOptions>) => {
  return () => h(ElContainer, {},
    () => [
      h(ElAside, {}, () => h(AsideMenu)),
      h(ElContainer, { id: 'app-body' }, () =>
        h(ElMain, {}, () => h(RouterView))
      )
    ])
})
