import { defineConfig } from 'vitepress'
import { getThemeConfig } from '@sugarat/theme/node'
import AutoSidebar from 'vite-plugin-vitepress-auto-sidebar';
const blogTheme = getThemeConfig({
    author: '桑榆',
    search: false,
    comment: {
        type: 'giscus',
        options: {
            repo:'phellinus/sangyu-blog',
            repoId: 'R_kgDOQFMBYg',
            category: 'Announcements',
            categoryId: 'DIC_kwDOQFMBYs4CxBCh',
            inputPosition: 'top',
            mapping:'pathname',
            strict:'0',
            reactionsEnabled:"1",
            emitMetadata:"0",
            theme:"preferred_color_scheme",
            lang:"zh-CN",
            rossorigin:"anonymous",
        },
        mobileMinify: true
    },
    oml2d: {
        mobileDisplay: true,
        models: [
            {
                path: 'https://registry.npmmirror.com/oml2d-models/latest/files/models/Senko_Normals/senko.model3.json'
            }
        ]
    }
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
        ['meta', { name: 'algolia-site-verification', content: '5BFBC0E68602F2A9' }]
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
        search: {
            provider: 'algolia',
            options: {
                appId: '28M3X86BI7',
                apiKey: '7484995042761280cc200c26ff69f888',
                indexName: 'sangyu_blog_pages',
                placeholder: '搜索文档...',
                translations: {
                    button: {
                        buttonText: '搜索',
                        buttonAriaLabel: '搜索'
                    },
                    modal: {
                        searchBox: {
                            resetButtonTitle: '清除查询',
                            cancelButtonText: '取消'
                        },
                        startScreen: {
                            recentSearchesTitle: '最近搜索',
                            noRecentSearchesText: '暂无历史'
                        },
                        errorScreen: {
                            titleText: '无法获取结果',
                            helpText: '请检查网络或稍后重试'
                        },
                        footer: {
                            selectText: '选择',
                            navigateText: '切换',
                            closeText: '关闭',
                            searchByText: '搜索提供方'
                        }
                    }
                }
            }
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
