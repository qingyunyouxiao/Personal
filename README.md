### Angular and Springboot for Cors Connection & JwtUtil

遇到的问题 :

```
curl -v https://your-api-url/v1/community/messages
// 显示请求信息

server.port=8081
//在application.properties中设置端口号

@Component  // 解决依赖注入，使JwtUtil成为Spring管理的Bean
public class JwtUtil {
    private final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    
    
public record Person(String name, int age) {
    // 可选：你可以根据需要添加自定义方法
    public String greet() {
        return "Hello, my name is " + name;
    }
}
// 使用 public record自动生成构造函数

```

前端创建 :

```
// 下载 node 16.20
npm install -g @angular/cli@14


ng new frontend
ng serve
```

 greeting设置 :

```
@CrossOrigin(origins = "http://localhost:4200")
@RestController
public class GreetingController {

    @GetMapping("/greeting")
    public Map<String, String> greeting() {
        return Map.of("content", "hi from Backend");
    }
}
```

 ajax设置 :

```
<script>
    document.addEventListener('DOMContentLoaded', function () {
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'json';

        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                document.getElementsByTagName('h1')[0].innerText = xhr.response['content'];
            }
        };

        xhr.open('GET', '/greeting', true);
        xhr.send();
    });
</script>

```

Spring Security 在 JWT 验证中的作用主要是负责拦截和验证每个请求的身份信息。

**保护 API 路径：**
 `http.authorizeRequests()` 用于指定哪些 URL 路径需要认证，哪些可以开放（例如 `/login` 不需要认证）。它确保只有经过身份验证的用户才能访问受保护的资源。

**JWT 身份验证：**
 通过 `JwtAuthenticationFilter` 拦截每个请求，并在请求头中提取 JWT（如果有）。JWT 然后被解析和验证（有效性、签名等）。如果 JWT 验证失败，用户会被拒绝访问。`JwtAuthenticationFilter` 会在 `UsernamePasswordAuthenticationFilter` 之前执行，以便 Spring Security 在进行任何认证之前先完成 JWT 的验证。

**自定义用户信息加载：**
 `MyUserDetailsService` 负责从数据库中加载用户信息，它被用来在 JWT 中提取的用户名基础上查询用户的权限等信息。



修改 SecurityConfig 中的 CORS 配置：

```
package com.tequila.jwtutil.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import com.tequila.jwtutil.service.MyUserDetailsService;

@Configuration
@EnableWebSecurity
@EnableWebMvc  // Enable Web MVC for CORS
public class SecurityConfig {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public SecurityConfig(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())  // Disable CSRF protection
                .cors()  // Enable CORS support in Security
                .and()
                .authorizeRequests(authorizeRequests -> authorizeRequests
                        .requestMatchers("/login").permitAll()  // Allow unauthenticated access to /login
                        .anyRequest().authenticated()  // All other requests need authentication
                )
                .addFilterBefore(new JwtAuthenticationFilter(jwtUtil, (MyUserDetailsService) userDetailsService),
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
```

