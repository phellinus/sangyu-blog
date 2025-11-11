---
description: 使用jwt改造短链接系统
sticky: 4
tag:
  - 后端
tags:
  - jwt
categories:
  - springboot
---

# 📝 使用jwt改造短链接系统

> ✍️ 作者：桑榆  
> 🕓 更新时间：2025-11-11
> 🧠 关键词：jwt、springboot

## 🧩 前言
>   完成了短链接的用户模块，包括登录、注册、修改用户信息等功能
> 最近打算使用jwt来改造登录模块。下面是对jwt的介绍

## 一、JWT 简介

### 1.1 什么是 JWT？

JWT（JSON Web Token）是一种开放标准（RFC 7519），用于在各方之间安全地传输信息。它是一种紧凑且自包含的方式，用于在客户端和服务器之间以 JSON 对象的形式传输信息。

### 1.2 JWT 的组成结构

JWT 由三部分组成，通过点（`.`）分隔：
```text
xxxxx.yyyyy.zzzzz
```
示例：
```text
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InpoYW5nc2FuIiwic3ViIjoiemhhbmdzYW4iLCJpYXQiOjE2OTk5OTk5OTksImV4cCI6MTY5OTk5OTk5OX0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```
#### 1.2.1 Header（头部）

包含令牌的类型（JWT）和使用的签名算法（如 HMAC SHA256 或 RSA）。
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```
#### 1.2.2 Payload（负载）

包含声明（claims），即要传输的数据。声明分为三种类型：

- **注册声明（Registered claims）**：预定义的声明，如 `iss`（签发者）、`exp`（过期时间）、`sub`（主题）、`aud`（受众）等
- **公共声明（Public claims）**：可以自定义，但应该在 IANA JSON Web Token Registry 中定义
- **私有声明（Private claims）**：自定义的声明，用于在双方之间共享信息

```json
{
  "username": "zhangsan",
  "sub": "zhangsan",
  "iat": 1699999999,
  "exp": 1699999999
}
```

#### 1.2.3 Signature（签名）

签名用于验证消息在传输过程中未被篡改，并且对于使用私钥签名的令牌，还可以验证 JWT 的发送者。
```text
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

### 1.3 JWT 的工作流程
```text
┌─────────┐                                      ┌─────────┐
│         │  1. 用户登录（用户名+密码）              │         │
│ Client  │ ────────────────────────────────────> │ Server  │
│         │                                      │         │
│         │  2. 验证成功，返回 JWT Token            │         │
│         │ <──────────────────────────────────── │         │
│         │                                      │         │
│         │  3. 后续请求携带 JWT Token              │         │
│         │    (Header: Authorization: Bearer xxx)│         │
│         │ ────────────────────────────────────> │         │
│         │                                      │         │
│         │  4. 验证 Token，返回数据                │         │
│         │ <──────────────────────────────────── │         │
└─────────┘                                      └─────────┘
```

### 1.4 JWT vs 传统 Session

| 特性         | JWT                          | Session                                   |
| ------------ | ---------------------------- | ----------------------------------------- |
| **存储位置** | 客户端（Token 存储在客户端） | 服务端（Session 存储在服务器内存/数据库） |
| **扩展性**   | 优秀（无状态，易于水平扩展） | 较差（需要 Session 共享机制）             |
| **性能**     | 客户端存储，减轻服务器压力   | 服务器需要存储和查询 Session              |
| **安全性**   | 需要防止 XSS、Token 泄露     | 依赖 Cookie，需防止 CSRF                  |
| **跨域**     | 支持跨域                     | 跨域需要额外配置                          |
| **注销**     | 需要额外机制（黑名单）       | 直接删除 Session 即可                     |

### JWT 的优势

1. **无状态**：服务器不需要存储 Session，减轻服务器压力
2. **可扩展**：天然支持分布式系统和微服务架构
3. **跨域友好**：可以轻松实现单点登录（SSO）
4. **自包含**：Token 本身包含用户信息，减少数据库查询
5. **移动端友好**：不依赖 Cookie，适合移动应用

### 1.6 JWT 的注意事项

1. **不要存储敏感信息**：Payload 是 Base64 编码，并非加密，可以被解码
2. **设置合理的过期时间**：避免 Token 被长期滥用
3. **使用 HTTPS**：防止 Token 在传输过程中被截获
4. **密钥安全**：签名密钥必须保密，不能泄露
5. **Token 刷新机制**：实现 Refresh Token 来延长用户会话

## 二、项目中的 JWT 配置

### 2.1 Maven 依赖配置

#### 2.1.1 父 pom.xml

在父 pom 中定义 JWT 版本和依赖管理：

```xml
<properties>
    <jjwt.version>0.11.5</jjwt.version>
</properties>

<dependencyManagement>
    <dependencies>
        <!-- JWT API -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>${jjwt.version}</version>
        </dependency>
        
        <!-- JWT 实现 -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        
        <!-- JWT Jackson 支持 -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

**说明：**

- `jjwt-api`：核心 API 接口
- `jjwt-impl`：JWT 的实现，设置为 `runtime` 作用域
- `jjwt-jackson`：使用 Jackson 进行 JSON 序列化

#### 2.1.2 admin 模块 pom.xml

在 admin 模块中引入依赖：
```xml
<dependencies>
    <!-- JWT 依赖 -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <scope>runtime</scope>
    </dependency>
</dependencies>
```

### 2.2 Redis 缓存常量

在 `RedisCacheConstant.java` 中添加用户登录的 Redis Key 前缀：
```java
public class RedisCacheConstant {
    public static final String LOCK_USER_REGISTER_KEY = "short-link:lock_user-register:";
    
    /**
     * 用户登录缓存Key前缀
     */
    public static final String USER_LOGIN_KEY = "short-link:user:login:";
}
```

### 2.3 JWT 工具类

`JwtUtil.java` 提供 JWT 的生成、验证和解析功能：
```java
package org.sangyu.shortlink.admin.common.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * JWT工具类
 */
public class JwtUtil {

    /**
     * JWT密钥（至少256位）
     */
    private static final String SECRET_KEY = "sangyu_shortlink_secret_key_2024_for_hs256_algorithm";
    
    /**
     * JWT过期时间（30分钟）
     */
    private static final long EXPIRATION_TIME = 30 * 60 * 1000;
    
    /**
     * 获取签名密钥
     */
    private static SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * 生成JWT Token
     * @param username 用户名
     * @return JWT Token
     */
    public static String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("username", username);
        return createToken(claims, username);
    }

    /**
     * 创建JWT Token
     * @param claims 声明
     * @param subject 主题
     * @return JWT Token
     */
    private static String createToken(Map<String, Object> claims, String subject) {
        Date now = new Date();
        Date expirationDate = new Date(now.getTime() + EXPIRATION_TIME);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(expirationDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * 从Token中获取用户名
     * @param token JWT Token
     * @return 用户名
     */
    public static String getUsernameFromToken(String token) {
        return getClaimsFromToken(token).getSubject();
    }

    /**
     * 从Token中获取声明
     * @param token JWT Token
     * @return 声明
     */
    private static Claims getClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * 验证Token是否有效
     * @param token JWT Token
     * @param username 用户名
     * @return 是否有效
     */
    public static boolean validateToken(String token, String username) {
        try {
            String tokenUsername = getUsernameFromToken(token);
            return tokenUsername.equals(username) && !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 检查Token是否过期
     * @param token JWT Token
     * @return 是否过期
     */
    private static boolean isTokenExpired(String token) {
        Date expiration = getClaimsFromToken(token).getExpiration();
        return expiration.before(new Date());
    }

    /**
     * 获取Token过期时间（毫秒）
     * @return 过期时间
     */
    public static long getExpirationTime() {
        return EXPIRATION_TIME;
    }
}
```

**工具类说明：**

1. **密钥管理**：
    - `SECRET_KEY`：签名密钥，必须保密
    - `getSigningKey()`：将字符串密钥转换为 `SecretKey` 对象
    - 对于 HS256 算法，密钥长度至少为 256 位（32 字节）

2. **Token 生成**：
    - `generateToken()`：生成包含用户名的 JWT Token
    - `createToken()`：实际创建 Token，设置声明、主题、签发时间、过期时间并签名

3. **Token 解析**：
    - `getUsernameFromToken()`：从 Token 中提取用户名
    - `getClaimsFromToken()`：解析 Token 获取所有声明

4. **Token 验证**：
    - `validateToken()`：验证 Token 是否有效（包括用户名匹配和过期检查）
    - `isTokenExpired()`：检查 Token 是否过期

### 2.4 用户服务实现

在 `UserServiceImpl.java` 中集成 JWT 认证：
#### 2.4.1 登录方法
```java
@Override
public UserLoginRespDTO login(UserLoginReqDTO requestParam) {
    // 1. 验证用户名和密码
    LambdaQueryWrapper<UserDO> wrapper = Wrappers.lambdaQuery(UserDO.class)
            .eq(UserDO::getUsername, requestParam.getUsername())
            .eq(UserDO::getPassword, requestParam.getPassword())
            .eq(UserDO::getDelFlag, 0);
    UserDO result = baseMapper.selectOne(wrapper);
    if(result == null) {
        throw new ClientException("用户不存在");
    }
    
    // 2. 检查用户是否已登录
    Boolean hasLogin = stringRedisTemplate.hasKey(USER_LOGIN_KEY + requestParam.getUsername());
    if (hasLogin) {
        throw new ClientException("用户已登录");
    }
    
    // 3. 生成JWT Token
    String token = JwtUtil.generateToken(requestParam.getUsername());
    
    // 4. 将用户信息存储到Redis，Key为用户名，Value为JSON字符串
    stringRedisTemplate.opsForValue().set(
            USER_LOGIN_KEY + requestParam.getUsername(),
            JSON.toJSONString(result),
            JwtUtil.getExpirationTime(),
            TimeUnit.MILLISECONDS
    );

    return new UserLoginRespDTO(token);
}
```

**登录流程说明：**

1. 验证用户名和密码是否正确
2. 检查用户是否已经登录（防止重复登录）
3. 生成 JWT Token
4. 将用户信息存储到 Redis，Key 为 `short-link:user:login:username`，过期时间与 Token 一致

#### 2.4.2 校验登录方法
```java
@Override
public Boolean checkLogin(String username, String token) {
    // 1. 验证JWT Token是否有效
    if (!JwtUtil.validateToken(token, username)) {
        return false;
    }
    
    // 2. 检查Redis中是否存在用户登录信息
    return Boolean.TRUE.equals(stringRedisTemplate.hasKey(USER_LOGIN_KEY + username));
}
```

**校验流程说明：**

1. 验证 JWT Token 的有效性（签名、过期时间、用户名）
2. 检查 Redis 中是否存在登录记录（用于实现强制退出等功能）

#### 2.4.3 退出登录方法
```java
@Override
public void logout(String username, String token) {
    if (checkLogin(username, token)) {
        // 删除Redis中的登录信息
        stringRedisTemplate.delete(USER_LOGIN_KEY + username);
        return;
    }
    throw new ClientException("用户token不存在或者用户未登录");
}
```

**退出流程说明：**

1. 验证用户是否已登录
2. 删除 Redis 中的登录记录
3. JWT Token 本身无法主动失效，但因为 Redis 记录被删除，校验时会失败

## 三、JWT 在项目中的认证流程

### 3.1 完整认证流程图
```text
┌──────────────────────────────────────────────────────────────┐
│                        用户登录流程                            │
└──────────────────────────────────────────────────────────────┘

1. 用户提交登录请求
   POST /api/short-link/v1/user/login
   Body: { "username": "zhangsan", "password": "123456" }
           │
           ▼
2. 验证用户名和密码
   SELECT * FROM t_user WHERE username=? AND password=? AND del_flag=0
           │
           ▼
3. 检查是否已登录
   Redis: EXISTS short-link:user:login:zhangsan
           │
           ▼
4. 生成 JWT Token
   JwtUtil.generateToken("zhangsan")
   → eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InpoYW5nc2FuIn0.xxx
           │
           ▼
5. 存储登录信息到 Redis
   Redis: SET short-link:user:login:zhangsan <用户信息JSON> EX 1800
           │
           ▼
6. 返回 Token 给客户端
   Response: { "token": "eyJhbGciOiJIUzI1NiJ9.xxx" }


┌──────────────────────────────────────────────────────────────┐
│                     后续请求验证流程                           │
└──────────────────────────────────────────────────────────────┘

1. 客户端发起请求，携带 Token
   GET /api/short-link/v1/user/check-login?username=zhangsan&token=xxx
           │
           ▼
2. 验证 JWT Token
   JwtUtil.validateToken(token, username)
   - 验证签名是否正确
   - 验证是否过期
   - 验证用户名是否匹配
           │
           ▼
3. 检查 Redis 登录状态
   Redis: EXISTS short-link:user:login:zhangsan
           │
           ▼
4. 返回验证结果
   Response: { "data": true }
```

### 3.2 Redis 存储结构
```text
Key: short-link:user:login:{username}
Value: {"id":1,"username":"zhangsan","realName":"张三",...}
TTL: 1800 秒（30分钟）

示例：
Key: short-link:user:login:zhangsan
Value: {"id":1,"username":"zhangsan","realName":"张三","phone":"13800138000",...}
TTL: 1800
```

### 3.3 为什么使用 JWT + Redis 的混合方案？

虽然 JWT 是无状态的，但在实际项目中常结合 Redis 使用：

**优势：**

1. **支持主动失效**：可以通过删除 Redis 记录实现强制退出
2. **防止重复登录**：通过 Redis 检查是否已登录
3. **存储额外信息**：Redis 可以存储完整的用户信息，减少数据库查询
4. **性能优化**：JWT 验证 + Redis 缓存，避免每次都查数据库

**权衡：**

- 牺牲了部分无状态的优势
- 但获得了更好的安全性和可控性

## 四、安全最佳实践

### 4.1 密钥管理

```text
// ❌ 不推荐：硬编码在代码中
private static final String SECRET_KEY = "my_secret_key";

// ✅ 推荐：从配置文件或环境变量读取
@Value("${jwt.secret}")
private String secretKey;
```

**建议：**

- 使用强随机密钥（至少 256 位）
- 从配置文件或环境变量读取
- 不同环境使用不同密钥
- 定期轮换密钥

### 4.2 Token 存储

**客户端存储建议：**



| 存储方式              | 优点               | 缺点          | 适用场景      |
| --------------------- | ------------------ | ------------- | ------------- |
| **localStorage**      | 易于使用，不会过期 | 易受 XSS 攻击 | 单页应用      |
| **sessionStorage**    | 关闭浏览器自动清除 | 易受 XSS 攻击 | 短期会话      |
| **Cookie (HttpOnly)** | 防止 XSS 读取      | 需要防 CSRF   | 传统 Web 应用 |
| **内存**              | 最安全             | 刷新页面丢失  | 高安全应用    |

### Token 过期策略
```java
// 访问 Token：短期（30分钟）
private static final long ACCESS_TOKEN_EXPIRATION = 30 * 60 * 1000;

// 刷新 Token：长期（7天）
private static final long REFRESH_TOKEN_EXPIRATION = 7 * 24 * 60 * 60 * 1000;
```

**建议实现 Refresh Token 机制：**

1. 登录时返回 Access Token + Refresh Token
2. Access Token 过期后，使用 Refresh Token 获取新的 Access Token
3. Refresh Token 过期后，需要重新登录

### 4.4 防止常见攻击

#### 4.4.1 防止 XSS 攻击
```javascript
// 前端：对用户输入进行转义
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
```
#### 4.4.2 防止重放攻击
```java
// 在 JWT Payload 中添加 jti（JWT ID）
claims.put("jti", UUID.randomUUID().toString());

// 在 Redis 中记录已使用的 jti，防止重放
```

#### 4.4.3 使用 HTTPS
```yaml
# application.yml
server:
  ssl:
    enabled: true
    key-store: classpath:keystore.p12
    key-store-password: password
    key-store-type: PKCS12
```
## 五、常见问题

### 5.1 Token 过期后如何处理？

**前端处理：**
```javascript
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      // Token 过期，跳转到登录页
      router.push('/login');
    }
    return Promise.reject(error);
  }
);
```

后端处理：

```java
@ExceptionHandler(ExpiredJwtException.class)
public Result<Void> handleExpiredJwtException(ExpiredJwtException e) {
    return Results.failure(UserErrorCodeEnum.TOKEN_EXPIRED);
}
```

### 5.2 如何实现单设备登录？

```java
// 登录时，删除该用户所有其他设备的登录信息
String oldToken = stringRedisTemplate.opsForValue().get(USER_LOGIN_KEY + username);
if (oldToken != null) {
    // 将旧 Token 加入黑名单
    stringRedisTemplate.opsForValue().set(
        "blacklist:" + oldToken,
        "1",
        JwtUtil.getExpirationTime(),
        TimeUnit.MILLISECONDS
    );
}
```
### 5.3 如何实现 Token 续期？

**方式一：滑动过期时间**
```java
// 每次验证成功后，刷新 Redis 过期时间
stringRedisTemplate.expire(
    USER_LOGIN_KEY + username,
    JwtUtil.getExpirationTime(),
    TimeUnit.MILLISECONDS
);
```
方式二：Refresh Token
```java
// 实现一个刷新接口
@PostMapping("/api/short-link/v1/user/refresh")
public Result<UserLoginRespDTO> refresh(@RequestParam String refreshToken) {
    // 验证 refreshToken
    // 生成新的 accessToken
    // 返回新 Token
}
```