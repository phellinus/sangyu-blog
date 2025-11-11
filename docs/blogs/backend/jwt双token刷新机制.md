# JWT 刷新机制改造说明

## 背景与目标
- 访问 Token 过去 30 分钟即失效，用户必须重新登录，体验较差。
- 本次改造实现 Access Token + Refresh Token 的双 Token 体系，允许用户在长期会话内无感续期，同时保持服务器端对 Refresh Token 的可控性。

## 主要改动概览
1. **Token 结构**
   - 在 `JwtUtil` 中引入 `TokenType` 枚举，访问 Token（30 分钟）与刷新 Token（7 天）分别签发。
   - Token 负载新增 `tokenType`，验证时能够区分不同 Token。
2. **缓存策略**
   - `USER_LOGIN_KEY:{username}`：用户完整信息，TTL 与刷新 Token 一致（7 天）。
   - `USER_REFRESH_TOKEN_KEY:{username}`：最新刷新 Token 字符串，用于服务端强制失效旧 Token。
3. **业务流程**
   - 登录 (`UserServiceImpl#login`)：签发 access/refresh token，分别返回给前端，并在 Redis 中落库。
   - 刷新 (`UserServiceImpl#refreshToken`)：校验刷新 Token 是否与 Redis 中一致且未过期，重新签发一对 Token，覆盖 Redis 记录。
   - 校验 (`checkLogin`)：仅接受访问 Token；刷新 Token 不可直接访问受限接口。
   - 登出 (`logout`)：同时清理登录态和刷新 Token。
4. **接口层**
   - 登录接口返回值扩展为 `accessToken`、`refreshToken`、`expiresIn`。
   - 新增 `/api/short-link/v1/user/refresh-token` 提供续期能力。

## 接口详情

### 1. 登录
```
POST /api/short-link/v1/user/login
{
  "username": "alice",
  "password": "******"
}
```
响应：
```json
{
  "accessToken": "<JWT_ACCESS>",
  "refreshToken": "<JWT_REFRESH>",
  "expiresIn": 1800000
}
```

### 2. 刷新 Token
```
POST /api/short-link/v1/user/refresh-token
{
  "refreshToken": "<JWT_REFRESH>"
}
```
响应结构同登录接口，会返回新的 access/refresh token 以及最新的 `expiresIn`。

### 3. 校验与登出
- `GET /api/short-link/v1/user/check-login?username=alice&token=<JWT_ACCESS>`
- `DELETE /api/short-link/v1/user/logout?username=alice&token=<JWT_ACCESS>`

## 前端配合方案
1. **存储策略**
   - 登录成功后同时保存 `accessToken`、`refreshToken`；`expiresIn` 可用于本地倒计时（毫秒）。
   - 建议将刷新 Token 置于 `httpOnly Cookie` 或安全存储，并在切换账号/登出时一并清理。
2. **请求拦截**
   - 所有受保护接口在 Header 中带上 `Authorization: Bearer <accessToken>`。
   - 在发起请求前，如果本地判断 `expiresIn` 即将到期（例如剩余 < 2 分钟），先调用刷新接口拿到新 Token，再继续原请求。
3. **自动续期**
   - 当服务端返回 401/Token 过期错误时：
     1. 检查本地是否仍持有刷新 Token；
     2. 调用刷新接口获取新 Token；
     3. 刷新成功后更新本地缓存并重放原请求；
     4. 如果刷新失败（返回 401/403/错误码），认为会话失效，跳转登录页并提示用户重新登录。
4. **登出**
   - 调用登出接口后清理本地所有 Token 缓存，避免旧 Token 被继续使用。
5. **异常处理**
   - 刷新接口可能因为会话失效、刷新 Token 被替换或过期而失败，前端需要对此做降级处理（直接退回登录或提示）。

## 服务端配置步骤回顾
1. **JWT 工具类**
   - `JwtUtil`：新增 TokenType、生成/校验逻辑和过期时间常量，暴露 `getAccessExpirationTime` 与 `getRefreshExpirationTime`。
2. **Redis 常量**
   - `RedisCacheConstant`：新增 `USER_REFRESH_TOKEN_KEY`。
3. **DTO 调整**
   - 登录响应 `UserLoginRespDTO` 扩展字段。
   - 新建 `UserRefreshTokenReqDTO` 承载刷新请求。
4. **Service 层**
   - `UserService` 新增 `refreshToken` 抽象。
   - `UserServiceImpl` 登录/校验/登出/刷新逻辑全部适配双 Token。
5. **Controller**
   - 新增 `/user/refresh-token` 接口，确保外部可调用刷新能力。
6. **构建验证**
   - `mvn -pl admin -DskipTests package` 验证 `admin` 模块能够成功编译。

## 测试建议
1. 登录后立即调用受保护接口，确保 access token 可用。
2. 修改系统时间或等待 30 分钟后，仅凭 refresh token 调用刷新接口，确认能得到新的 access token，并且旧 access token 不再通用。
3. 多端登录时，后一次刷新会覆盖 Redis 中的 refresh token，前一次客户端应在刷新失败时触发重新登录。
4. 登出后再次使用旧 refresh token 应提示失效。
