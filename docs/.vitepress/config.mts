import { defineConfig } from 'vitepress'
import { getThemeConfig } from '@sugarat/theme/node'
import AutoSidebar from 'vite-plugin-vitepress-auto-sidebar';
const blogTheme = getThemeConfig({
    author: '桑榆',
    search:false,
    comment: {
        type: 'giscus',
        options: {
            repoId: 'R_kgDOL27o_A',
            category: 'Announcements',
            categoryId: 'DIC_kwDOL27o_M4CfJcg',
            inputPosition: 'top',
            mapping:'title',
            strict:'0',
            reactionsEnabled:"1",
            emitMetadata:"0",
            theme:"preferred_color_scheme",
            lang:"zh-CN",
            rossorigin:"anonymous",
        },
        mobileMinify: true
    },
})
// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "桑榆的个人博客",
    extends: blogTheme,
    base: '/',
    description: "记录平时的学习笔记以及日常的工作",
    head:[
        // 改变title的图标
        [
            'link',
            {
                rel: 'icon',
                href: '/bloglogo.jpg',//图片放在public文件夹下
            },
        ],
    ],
    themeConfig: {
        logo:'/bloglogo.jpg',
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: '首页', link: '/' },
            { text: '文档', link: '/blogs/欢迎页' }
        ],
        // 访问量统计
        visitor: {
            /** 统计 id（单独页面的统计会作为前缀使用）*/
            badgeId: 'maomao1996.vitepress-nav-template',
        },
        // sidebar: [
        //     {
        //         text: '博客大全',
        //         items: [
        //             { text: 'vue3的学习笔记', link: '/font/vue3笔记' },
        //             { text: 'react的学习笔记', link: '/font/react笔记' },
        //             { text: 'react-router-dom路由', link: '/font/react路由' },
        //         ]
        //     }
        // ],

        socialLinks: [
            { icon: 'github', link: 'https://github.com/phellinus' }
        ],
    },
    vite: {
        plugins: [AutoSidebar()],
    },
})
