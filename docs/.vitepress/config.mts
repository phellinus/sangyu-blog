import { defineConfig } from 'vitepress'
import { getThemeConfig } from '@sugarat/theme/node'
import AutoSidebar from 'vite-plugin-vitepress-auto-sidebar';
const blogTheme = getThemeConfig({})
// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "桑榆的个人博客",
    extends: blogTheme,
    description: "记录平时的学习笔记以及日常的工作",
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: '首页', link: '/' },
            { text: '文档', link: '/markdown-examples' }
        ],

        sidebar: [
            {
                text: '博客大全',
                items: [
                    { text: 'vue3的学习笔记', link: '/font/vue3笔记' },
                    { text: 'react的学习笔记', link: '/font/react笔记' },
                    { text: 'react-router-dom路由', link: '/font/react路由' },
                ]
            }
        ],

        socialLinks: [
            { icon: 'github', link: 'https://github.com/phellinus' }
        ],
    },
    vite: {
        plugins: [AutoSidebar()],
    },
})
