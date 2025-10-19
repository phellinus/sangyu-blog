import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "桑榆的个人博客",
  description: "记录平时的学习笔记以及日常的工作",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: '文档', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: '博客大全',
        items: [
          { text: 'vue3的学习笔记', link: '/font/vue3笔记' },
          { text: 'react的学习笔记', link: '/font/react笔记' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/phellinus' }
    ]
  }
})
