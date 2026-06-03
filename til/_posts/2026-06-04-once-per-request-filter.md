---
layout: post
collection: til
description: >
  Spring의 OncePerRequestFilter로 요청당 1회만 실행되는 서블릿 필터를 만드는 방법,
  shouldNotFilter()로 경로를 선택 적용하고 doFilterInternal()에서 체인을 이어가는 패턴을 정리한 글이다.
categories: ["til"]
tags:
  [
    "TIL",
    "Spring Boot",
    "Filter",
    "OncePerRequestFilter",
    "Servlet",
    "Security",
  ]
date: 2026-06-04 00:00:00
last_modified_at: 2026-06-04 00:00:00
sitemap: false
---

# [TIL] OncePerRequestFilter — 서블릿 필터 구현 패턴

> Spring에서 커스텀 필터를 만들 때 `Filter`를 직접 구현하면 forward/include 시 같은 요청에 필터가 여러 번 돌 수 있다. `OncePerRequestFilter`를 쓰면 요청당 한 번만 실행되고, `shouldNotFilter()`로 특정 경로를 건너뛰며, `doFilterInternal()`에서 검증 후 `filterChain.doFilter()`로 체인을 이어갈 수 있다.

- [들어가며](#들어가며)
- [1. 서블릿 필터가 하는 일](#1-서블릿-필터가-하는-일)
- [2. 왜 OncePerRequestFilter인가](#2-왜-onceperrequestfilter인가)
- [3. 기본 구조: doFilterInternal과 filterChain](#3-기본-구조-dofilterinternal과-filterchain)
- [4. shouldNotFilter()로 경로 선택 적용](#4-shouldnotfilter로-경로-선택-적용)
- [5. 실전 예시: 내부 API 키 검증 필터](#5-실전-예시-내부-api-키-검증-필터)
- [6. 필터에서 응답을 끊을 때와 이어갈 때](#6-필터에서-응답을-끊을-때와-이어갈-때)
- [7. @Component로 등록할 때 주의할 점](#7-component로-등록할-때-주의할-점)
- [8. 흔한 실수와 점검 포인트](#8-흔한-실수와-점검-포인트)
- [9. 적용 체크리스트](#9-적용-체크리스트)
- [마무리](#마무리)

---

## 들어가며

컨트롤러에 도달하기 전에 공통 검증을 넣고 싶을 때가 있다.

- 내부 API 키 확인
- 허용 IP 검사
- 특정 경로만 추가 인증

이런 로직을 컨트롤러마다 복붙하기보다, **서블릿 필터**로 앞단에 두는 편이 낫다. 요청이 들어오면 필터 → 컨트롤러 순으로 지나가고, 필터에서 막으면 컨트롤러까지 가지 않는다.

Spring에서는 이 패턴을 `OncePerRequestFilter`로 구현하는 경우가 많다.

---

## 1. 서블릿 필터가 하는 일

서블릿 필터는 HTTP 요청·응답 파이프라인의 **앞단 훅**이다.

```
[클라이언트] → [Filter 1] → [Filter 2] → ... → [DispatcherServlet] → [Controller]
```

필터의 역할:

- 요청을 **검증**하거나 헤더를 읽는다.
- 조건을 만족하지 않으면 **401/403** 등으로 응답을 끝낸다.
- 통과시키면 `filterChain.doFilter()`로 **다음 필터·서블릿**으로 넘긴다.

컨트롤러보다 앞에서 공통 정책을 적용할 수 있어, 보안·로깅·트레이싱에 자주 쓰인다.

---

## 2. 왜 OncePerRequestFilter인가

`jakarta.servlet.Filter`를 직접 구현해도 필터는 만들 수 있다. 그런데 서블릿 스펙상 **forward**나 **include**가 발생하면, 같은 HTTP 요청 안에서 필터가 **여러 번** 호출될 수 있다.

예:

- 에러 페이지로 forward
- 내부 JSP include
- 일부 프레임워크 내부 디스패치

이때 일반 `Filter` 구현은 같은 요청에 대해 검증 로직이 두 번 돌 수 있다. API 키 검증, IP 체크처럼 "요청당 한 번"이 전제인 로직에서는 부작용이 생긴다.

`OncePerRequestFilter`는 Spring이 제공하는 추상 클래스로, **요청당 정확히 한 번** `doFilterInternal()`이 실행되도록 보장한다.

정리:

| 방식                   | 요청당 실행 횟수             |
| ---------------------- | ---------------------------- |
| `Filter` 직접 구현     | forward/include 시 중복 가능 |
| `OncePerRequestFilter` | 요청당 1회 보장              |

커스텀 보안·인증 필터를 만들 때는 `OncePerRequestFilter`를 상속하는 것이 일반적인 선택이다.

---

## 3. 기본 구조: doFilterInternal과 filterChain

`OncePerRequestFilter`를 쓰면 직접 구현할 메서드는 사실상 `doFilterInternal()` 하나다.

```java
public class ExampleFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        // 1. 요청 전처리 (검증, 로깅 등)
        boolean allowed = checkSomething(request);

        if (!allowed) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return; // 체인을 이어가지 않음 → 컨트롤러까지 가지 않음
        }

        // 2. 통과 시 다음 필터·서블릿으로 전달
        filterChain.doFilter(request, response);
    }
}
```

핵심 규칙:

- 검증 실패: 응답 상태를 쓰고 **`return`** ( `doFilter` 호출 안 함 )
- 검증 통과: 반드시 **`filterChain.doFilter(request, response)`** 호출

`doFilter`를 빼먹으면 요청이 다음 단계로 가지 않아 **응답이 비거나 타임아웃**처럼 보일 수 있다. 필터를 처음 만들 때 가장 흔한 실수 중 하나다.

---

## 4. shouldNotFilter()로 경로 선택 적용

모든 요청에 필터를 걸 필요는 없다. 헬스체크, 정적 리소스, 공개 API는 제외하고 싶을 때가 많다.

`shouldNotFilter()`를 오버라이드하면 된다.

```java
@Override
protected boolean shouldNotFilter(HttpServletRequest request) {
    String path = request.getRequestURI();
    return path.startsWith("/actuator/health")
            || path.startsWith("/public/");
}
```

- `shouldNotFilter()`가 `true` → 이 필터는 **건너뜀**
- `false` → `doFilterInternal()` 실행

경로 매칭 시 주의:

- `getRequestURI()`는 컨텍스트 경로를 포함할 수 있다. (`/my-app/api/...`)
- 서블릿 등록 시 `/*` 패턴과 조합해 동작을 확인한다.
- Spring MVC의 `@RequestMapping` 경로와 1:1이 아닐 수 있으니, 실제 요청 URI로 테스트한다.

2편에서 다룬 Actuator `health`만 외부에 열어두는 설정과 맞물리면, 헬스체크 경로는 필터 대상에서 빼 두는 것이 자연스럽다.

---
