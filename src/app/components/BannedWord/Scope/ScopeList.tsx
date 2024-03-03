import { ElTag, ElTooltip } from 'element-plus'
import { PropType, defineComponent } from 'vue'
import { t } from '@app/locale'

export default defineComponent({
    props: {
        scopes: {
            type: Object as PropType<XGFLFG.Scopes>,
            required: true
        },
        tooltipEffect: String as PropType<"dark" | "light">,
        closable: Boolean,
    },
    emits: {
        delete: (_key: string) => true
    },
    setup({ scopes = {}, tooltipEffect = "dark", closable = false }, ctx) {
        return () => (
            <div>
                {Object.entries(scopes).map(([key, scope]) => {
                    return <ElTooltip
                        content={`${t(msg => msg.item.scopeType[scope.type])}${scope.useReg ? t(msg => msg.item.useRegSuffix) : ''}`}
                        placement='bottom'
                        effect={tooltipEffect}
                    >
                        <ElTag
                            closable={closable}
                            onClose={() => ctx.emit("delete", key)}
                            style={{ marginRight: "6px", marginBottom: "6px" }}
                            type={scope.useReg ? "warning" : null}
                        >
                            <i
                                class={`el-icon-${scope.type === 'url' ? 'link' : 'collection'}`}
                                style={{ marginRight: "4px" }}
                            />
                            {scope.pattern}
                        </ElTag>
                    </ElTooltip>
                })}
            </div>
        )
    }
})