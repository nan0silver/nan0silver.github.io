---
layout: post
collection: til
description: >
  Spring Security의 SecurityFilterChain에 커스텀 OncePerRequestFilter를 등록하는 방법,
  addFilterBefore/After로 순서를 제어하는 이유, @Bean + @Profile로 환경별로 분리하는 패턴을 정리한 글이다.
categories: ["til"]
tags: ["TIL", "Spring Security", "SecurityFilterChain", "Filter", "addFilterBefore", "운영"]
date: 2026-06-07 00:00:00
last_modified_at: 2026-06-07 00:00:00
sitemap: false
---

# [TIL] Spring Security Filter Chain 구성 — `addFilterBefore`

> 3편에서 `OncePerRequestFilter`로 “요청당 1회 검증” 필터를 만들었다면, 4편은 그 필터를 Spring Security의 `SecurityFilterChain`에 **어느 위치로** 넣을지 다룬다. 필터 순서가 바뀌면 인증/인가 결과가 달라질 수 있으므로, `addFilterBefore`로 기준 필터 앞에 명시적으로 끼우는 것이 안전하다.

- [들어가며](#들어가며)
- [1. Spring Security 필터 체인과 순서](#1-spring-security-필터-체인과-순서)
- [2. 왜 addFilterBefore가 필요한가](#2-왜-addfilterbefore가-필요한가)
- [3. 기준 필터: UsernamePasswordAuthenticationFilter](#3-기준-필터-usernamepasswordauthenticationfilter)
- [4. 커스텀 필터를 체인에 삽입하기](#4-커스텀-필터를-체인에-삽입하기)
- [5. shouldNotFilter vs securityMatcher](#5-shouldnotfilter-vs-securitymatcher)
- [6. @Component 대신 @Bean으로 등록하는 이유](#6-component-대신-bean으로-등록하는-이유)
- [7. @Profile(\"prod\")로 운영에서만 켜기](#7-profileprod로-운영에서만-켜기)
- [8. 테스트(@WebMvcTest)에서 필터 때문에 깨질 때](#8-테스트webmvctest에서-필터-때문에-깨질-때)
- [9. 흔한 실수와 점검 포인트](#9-흔한-실수와-점검-포인트)
- [마무리](#마무리)

---

## 들어가며

Spring Security를 쓰는 애플리케이션에서 필터는 두 겹으로 존재한다.

- **서블릿 필터**: 톰캣/서블릿 컨테이너 레벨에서 동작
- **Spring Security 필터 체인**: 그중에서도 보안 관련 필터들의 묶음(`SecurityFilterChain`)

3편의 `OncePerRequestFilter`를 아무 곳에나 등록하면 동작은 할 수 있다. 하지만 보안은 “동작한다”가 아니라 “예상대로 **항상** 동작한다”가 중요하다.

그래서 Spring Security 체인 안에 넣고, **순서를 명시**하는 것이 일반적으로 더 안전하다.

---

## 1. Spring Security 필터 체인과 순서

Spring Security는 요청을 여러 필터가 순차적으로 처리하는 파이프라인으로 다룬다.

```
요청 → ... → (인증 관련 필터들) → (인가 관련 필터들) → DispatcherServlet → Controller
```

필터 순서는 곧 정책이다.

- 인증 정보가 만들어지기 전/후에 검사하는지
- 예외를 어느 레이어에서 처리하는지
- 특정 경로가 permitAll인지, 인증이 필요한지

즉, 같은 필터라도 “어디에 끼우느냐”에 따라 결과가 달라질 수 있다.

---

## 2. 왜 addFilterBefore가 필요한가

커스텀 필터를 추가하는 방법은 여러 가지가 있지만, 실무에서 자주 쓰는 이유는 단순하다.

- **기준점이 있어야 순서를 안정적으로 고정할 수 있기 때문**

필터를 “그냥 추가”하면(예: `addFilter`) 체인 내 위치가 애매해지고, 버전/설정에 따라 동작이 바뀔 여지가 생긴다.

`addFilterBefore(custom, SomeFilter.class)`는 이렇게 읽으면 된다.

- “`SomeFilter`가 실행되기 **전에** 내 필터를 실행해라.”

반대로:

- `addFilterAfter(custom, SomeFilter.class)` — 뒤에 실행

---

## 3. 기준 필터: UsernamePasswordAuthenticationFilter

많은 예시에서 기준 필터로 `UsernamePasswordAuthenticationFilter`를 둔다.

이유는:\n

- “인증 처리의 중심축”에 가깝고, 대부분의 애플리케이션에서 체인에 존재한다.
- 커스텀 인증(예: 내부 API 키, 헤더 토큰)을 **기본 인증 필터보다 앞**에서 처리하고 싶을 때가 많다.

예를 들어 `/internal/**`만 API 키로 막고 싶다면:

- 요청이 보안 체인에 들어오자마자 API 키 검증
- 실패면 401로 종료
- 성공이면 다음 필터로 진행

이 흐름을 안정적으로 만들기 위해 “어느 필터 앞”을 기준으로 삼는 것이다.

---

## 4. 커스텀 필터를 체인에 삽입하기

3편에서 만든 `InternalApiKeyFilter` 같은 `OncePerRequestFilter`를 `SecurityFilterChain`에 넣는 패턴 예시다.

```java
@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http,
            InternalApiKeyFilter internalApiKeyFilter
    ) throws Exception {

        http
                .csrf(csrf -> csrf.disable());

        http
                .addFilterBefore(
                        internalApiKeyFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}
```

여기서 중요한 포인트:

- `InternalApiKeyFilter`는 **단독으로도** 동작하지만, 체인에 넣으면 Spring Security 예외 처리·경로 규칙과 함께 움직인다.
- `addFilterBefore`로 “항상 이 지점 이전에 실행”을 고정한다.

---

## 5. shouldNotFilter vs securityMatcher

커스텀 필터를 일부 경로에만 적용하는 방법은 두 레이어가 있다.

### (A) 필터 내부에서 제외: `shouldNotFilter()`

3편에서 다룬 방식이다.

- 장점: 필터 단독으로도 재사용 가능, 코드가 직관적
- 단점: 체인에는 들어오므로, 필터 호출 자체는 발생(대부분은 경미)

### (B) 보안 설정에서 경로를 나누기: `securityMatcher`

필터 자체를 특정 체인에만 넣는 방식이다.

- 장점: 아예 해당 경로에서만 체인이 적용되도록 설계 가능
- 단점: 설정이 복잡해질 수 있고, 체인 분리가 늘면 추적이 어려워질 수 있음

실무에서는 보통 이렇게 간다.

- 1차: `securityMatcher`로 큰 범위를 나눔(내부 API, 외부 API, actuator 등)
- 2차: 필터 내부에서 `shouldNotFilter`로 미세 조정

---

## 6. @Component 대신 @Bean으로 등록하는 이유

3편에서도 언급했지만, 필터에 `@Component`를 붙이면 테스트에서 자주 문제가 난다.

예: `@WebMvcTest`는 웹 레이어만 로드하는 슬라이스 테스트다. 그런데 `@Component` 필터가 스캔되면:

- 필터 빈이 생성됨
- 필터가 의존하는 빈(예: `SecurityProperties`)이 로드되지 않아
- `NoSuchBeanDefinitionException`이 발생할 수 있다

그래서 필터 클래스는 순수하게 두고, 등록은 `@Bean`으로 명시하는 패턴이 깔끔하다.

```java
@Configuration
public class FilterConfig {

    @Bean
    public InternalApiKeyFilter internalApiKeyFilter(SecurityProperties props) {
        return new InternalApiKeyFilter(props);
    }
}
```

이렇게 두면:

- 어떤 프로파일/환경에서 필터를 켤지 `@Configuration` 레벨에서 통제 가능
- 슬라이스 테스트에서 특정 설정 클래스를 아예 제외하기 쉬움

---

## 7. @Profile(\"prod\")로 운영에서만 켜기

운영에서만 내부 API 보호 필터를 켜고 싶을 때는 `@Profile`이 간단하다.

```java
@Configuration
@Profile(\"prod\")
public class ProdSecurityConfig {

    @Bean
    public InternalApiKeyFilter internalApiKeyFilter(SecurityProperties props) {
        return new InternalApiKeyFilter(props);
    }
}
```

이때 2편의 fail-fast 설정 검증이 같이 빛을 본다.

- prod에서만 필터가 활성화되고
- prod에서만 필요한 환경변수(`INTERNAL_API_KEY`)가 없으면
- 애플리케이션은 시작 단계에서 바로 실패한다

“운영에서만 필요한 보안 설정”을 “운영에서만 엄격하게 검증”하는 구조가 된다.

---

## 8. 테스트(@WebMvcTest)에서 필터 때문에 깨질 때

슬라이스 테스트에서는 두 가지 선택지가 많다.

- (선호) 필터를 `@Component`로 두지 않고 `@Bean` + `@Profile(\"prod\")`로 운영에서만 등록
- 테스트에서는 `@ActiveProfiles(\"test\")`로 prod 설정을 타지 않게 함

그래도 컨트롤러 테스트에서 보안 필터 때문에 막히면,

- `@AutoConfigureMockMvc(addFilters = false)`로 필터 자체를 끄거나
- 필요한 최소한의 `SecurityContext`를 테스트에서 세팅하는 방식으로 우회할 수 있다

테스트에서 보안을 “전부 켜고” 단위 테스트를 하는 것보다, 테스트 목적에 맞게 **경계를 나누는 것**이 유지보수에 유리한 경우가 많다.

---

## 9. 흔한 실수와 점검 포인트

### 실수 1: 필터 순서를 감으로 맞춤

보안은 “어쩌다 통과”가 위험하다. 기준 필터를 잡고 `addFilterBefore/After`로 고정한다.

### 실수 2: 필터를 @Component로 등록해 테스트가 깨짐

필터는 `@Bean`으로 명시 등록하고, 환경(프로파일)로 켜고 끄는 편이 깔끔하다.

### 실수 3: 필터에서 401을 썼는데도 컨트롤러가 실행됨

필터가 `filterChain.doFilter()`를 호출했는지 확인한다. 실패 경로에서는 `return`으로 종료해야 한다.

### 실수 4: actuator/health 같은 경로까지 막아버림

1편의 “health만 외부 노출” 정책과 충돌하지 않게, `shouldNotFilter` 또는 체인 분리로 예외 경로를 명확히 둔다.

---

## 마무리

`OncePerRequestFilter`를 제대로 만들었다면(3편), 4편의 핵심은 “안전한 위치에 끼우는 것”이다.

정리하면 아래 세 가지면 충분하다.

- 커스텀 필터는 `SecurityFilterChain`에 넣고
- `addFilterBefore`로 기준 필터 앞에 명시적으로 고정하고
- 운영에서만 켜야 한다면 `@Bean` + `@Profile(\"prod\")`로 등록을 통제한다

이렇게 하면 운영에서는 엄격하게, 테스트에서는 필요한 만큼만 보안을 적용하는 구조를 만들기 쉽다.

