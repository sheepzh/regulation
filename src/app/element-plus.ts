import { ElAside, ElButton, ElCol, ElContainer, ElDialog, ElEmpty, ElForm, ElFormItem, ElMain, ElMenu, ElMenuItem, ElInput, ElRow, ElTable, ElTableColumn } from 'element-plus'
import 'element-plus/lib/theme-chalk/index'
import { App } from 'vue'

const toInstall = [ElAside, ElButton, ElCol, ElContainer, ElDialog, ElEmpty, ElForm, ElFormItem, ElMain, ElMenu, ElMenuItem, ElInput, ElRow, ElTable, ElTableColumn]

export default function install(app: App): void {
    toInstall.forEach(i => app.component(i.name, i))
}

// Only chinese  
import { locale } from 'element-plus'
import lang from 'element-plus/lib/locale/lang/zh-cn'
locale(lang)