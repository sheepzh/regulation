import { ElTag, ElTooltip } from 'element-plus'
import { PropType, defineComponent } from 'vue'
import { t } from '@app/locale'
import { useShadow } from '@app/hooks/useShadow'

export default defineComponent({
    props: {
        scopes: {
            type: Object as PropType<XGFLFG.Scopes>,
            required: false
        },
        tooltipEffect: String as PropType<"dark" | "light">,
        closable: Boolean,
    },
    emits: {
        delete: (_scope: XGFLFG.Scope) => true
    },
    setup(props, ctx) {
        const scopes = useShadow(() => props.scopes)
        return () => (
            <div>
                {Object.values(scopes.value || {}).map(scope => {
                    return <ElTooltip
                        content={`${t(msg => msg.item.scopeType[scope.type])}${scope.useReg ? t(msg => msg.item.useRegSuffix) : ''}`}
                        placement='bottom'
                        effect={props.tooltipEffect}
                    >
                        <ElTag
                            closable={props.closable}
                            onClose={() => ctx.emit("delete", scope)}
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