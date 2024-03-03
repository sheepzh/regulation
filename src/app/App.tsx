import { ElAside, ElContainer, ElMain } from 'element-plus'
import { defineComponent, EmitsOptions, SetupContext } from 'vue'
import { RouterView } from 'vue-router'
import AsideMenu from './layout/AsideMenu'

export default defineComponent((_props: Readonly<{}>, _ctx: SetupContext<EmitsOptions>) => {
    return () => (
        <ElContainer>
            <ElAside style={{
                width: "240px"
            }}>
                <AsideMenu />
            </ElAside>
            <ElContainer>
                <ElMain>
                    <RouterView />
                </ElMain>
            </ElContainer>
        </ElContainer>
    )
})
