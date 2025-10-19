<center><h1>react-router-dom 学习笔记</h1></center>





> 面向日常开发的速查/范式合集，默认使用 **v6.4+ Data Router** 思路；示例以 TS/JS 皆可复用为目标。


## **0. 核心认知**


bt面板
外网面板地址: http://47.97.82.126:36695/19e58297
内网面板地址: http://172.30.178.178:36695/19e58297
username: ynieahj5
password: fc53aa03





- react-router-dom 提供 **UI 路由** 与 **数据路由（Data APIs）**。

- 推荐使用 **createBrowserRouter + RouterProvider**（代替旧的 `<BrowserRouter>` + `<Routes>` 写法）。

- 三大块：



1. **路由声明**：嵌套路由、索引路由、懒加载、错误边界。
2. **导航**：Link / NavLink / useNavigate / Navigate。
3. **数据流**：loader / action / useLoaderData / useActionData / Form / fetcher。



------



## **1. 安装**



```shell
npm i react-router-dom
```



------





## **2. 快速上手（Data Router）**



```tsx
// main.tsx / main.jsx
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import HomePage, { loader as homeLoader } from './routes/HomePage'
import PostDetail, { loader as postLoader } from './routes/PostDetail'
import NotFound from './routes/NotFound'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,        // 顶层布局 + <Outlet/>
    errorElement: <NotFound />,     // 路由错误边界/404
    children: [
      { index: true, element: <HomePage />, loader: homeLoader },
      { path: 'posts/:id', element: <PostDetail />, loader: postLoader },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
```

AppLayout 示例：

```tsx
import { NavLink, Outlet } from 'react-router-dom'

export default function AppLayout() {
  return (
    <div>
      <nav>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/posts/1">First Post</NavLink>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
```



------





## **3. 路由类型与概念**





- **嵌套路由**：父层 element 内渲染 `<Outlet/>`，子路由内容注入。
- **索引路由**：{ index: true, element: ... }，代表父路径的默认子页面。
- **路径参数**：如 posts/:id，用 useParams() 读取。
- **通配/404**：path: '*', element: `<NotFound/>` 或使用 errorElement。
- **重定向**：`<Navigate to="/login" replace />`（组件内），或 redirect('/login')（loader/action 内）。





------





## **4. 导航 API 速查**





- **声明式**：`<Link to="/path">`、`<NavLink to="/path" className={({isActive}) =>` isActive ? 'active' : '' }>。
- **命令式**：const nav = useNavigate(); nav('/path', { replace: true })。
- **相对路径**：to=".." 返回上一级，to="./child" 进入子层。





------



## **5. 读取路由信息**



```
import { useLocation, useParams, useSearchParams } from 'react-router-dom'

const location = useLocation()              // pathname, search, state
const { id } = useParams()                  // 动态参数
const [sp, setSp] = useSearchParams()       // URL Query
```



------





## **6. Data Router：loader / action**

- **loader**：进入路由前拉取数据（服务端或客户端均可）。
- **action**：提交表单等写操作；配合 `<Form>` 或 fetcher。
- **useLoaderData / useActionData**：在组件内读数据。
- **错误边界**：errorElement + useRouteError() 捕捉 loader/action 抛出的异常。

示例：

```tsx
// routes/PostDetail.tsx
import { useLoaderData, useRouteError, isRouteErrorResponse, json } from 'react-router-dom'

type Post = { id: string; title: string }

export async function loader({ params }: { params: any }) {
  const res = await fetch(`/api/posts/${params.id}`)
  if (!res.ok) throw json({ message: 'Post not found' }, { status: 404 })
  return res.json() as Promise<Post>
}

export default function PostDetail() {
  const post = useLoaderData() as Post
  return <h1>{post.title}</h1>
}

export function ErrorBoundary(){
  const err = useRouteError()
  if (isRouteErrorResponse(err)) return <p>{err.status} {err.data?.message}</p>
  return <p>Something went wrong</p>
}
```



------



## **7. `<Form>`&action（无刷新提交）**

```
// routes/HomePage.tsx
import { Form, useActionData, redirect } from 'react-router-dom'

export async function action({ request }: { request: Request }){
  const form = await request.formData()
  const title = String(form.get('title') || '')
  // 业务写入...
  return redirect(`/posts/created`) // 或 return { ok: true }
}

export default function HomePage(){
  const data = useActionData() as any
  return (
    <Form method="post">
      <input name="title" placeholder="Title" />
      <button type="submit">Create</button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </Form>
  )
}
```

> 也可用 useNavigation() 查看提交时的 pending 状态；或 useFetcher() 做局部数据交互（无需切换页面）。



------



## **8. 懒加载路由**

```
const PostDetail = lazy(() => import('./routes/PostDetail'))

const router = createBrowserRouter([
  {
    path: '/', element: <AppLayout/>,
    children: [
      { index: true, element: <HomePage/> },
      { path: 'posts/:id', element: (
          <Suspense fallback={<p>Loading...</p>}>
            <PostDetail/>
          </Suspense>
        ) },
    ],
  },
])
```



------



## **9. 受保护路由（鉴权）**



**路由守卫（loader 版）**：

```
// routes/protectedLoader.ts
import { redirect } from 'react-router-dom'

export async function protectedLoader(){
  const isAuthed = await checkAuth()
  if (!isAuthed) throw redirect('/login?next=' + encodeURIComponent(location.pathname))
  return null
}
// router
{
  path: '/dashboard',
  loader: protectedLoader,
  element: <Dashboard/>,
}
```

**组件守卫（UI 版）**：

```
function RequireAuth({ children }: { children: React.ReactNode }){
  const authed = useAuth()
  const nav = useNavigate()
  useEffect(() => { if (!authed) nav('/login') }, [authed])
  return authed ? <>{children}</> : null
}
```

## **10. 常用范式**

- **布局路由**：顶层 AppLayout + 子路由 `<Outlet/>`。
- **404**：errorElement（优先）或 path: '*'。
- **重定向**：组件内 `<Navigate replace to='/login'/>`；数据层 redirect('/login')。
- **查询参数状态**：useSearchParams 代替本地 state（可分享/可回退）。
- **滚动行为**：`<ScrollRestoration/>` 保持返回时滚动位置。
- **路由级 Suspense**：懒加载时用 Suspense 提升体验。





------





## **11. 旧写法对比（迁移提示）**

- 旧：`<BrowserRouter>``<Routes>``<Route path='/' element={<A/>`}/>`</Routes>``</BrowserRouter>`
- 新：createBrowserRouter([...]) + `<RouterProvider/>`
- 旧的 useHistory → 新的 useNavigate
- Switch → Routes（v6）；Data Router 更推荐直接路由对象数组。

------



## **12. 调试与陷阱**

- 路由未匹配：检查父级 element 是否包含 `<Outlet/>`。
- NavLink 高亮：使用 className={({isActive}) => isActive ? 'active' : ''}。
- 相对路径坑：嵌套路由中 to=".." 从当前段回退一级。
- loader 未触发：确保使用 **Data Router**（createBrowserRouter），并在路由项上声明 loader。
- action 未执行：`<Form method='post'>` 的路径要匹配当前路由；或使用 action 对应路由的 Form。

## **13. 参考项目结构（建议）**

```
src/
  layouts/
    AppLayout.tsx
  routes/
    HomePage.tsx
    PostDetail.tsx
    NotFound.tsx
  main.tsx
```

## **14. 速记 API 清单**

- 导航：Link, NavLink, Navigate, useNavigate, useNavigation
- 匹配：useParams, useLocation, useMatches
- 数据：loader, action, redirect, useLoaderData, useActionData, useRouteError, isRouteErrorResponse, Form, useFetcher
- 组件：Outlet, ScrollRestoration, Await（配合 defer）

## **15. 延伸：进阶数据流**

- defer() + `<Await>`：并发/流式加载。
- fetcher：不切页的数据交互（局部刷新）。
- 多路由共享数据：在父路由 loader 拉取，子路由用 useRouteLoaderData(parentId) 复用。
