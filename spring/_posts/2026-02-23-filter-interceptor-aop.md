---
layout: post
title: Filter vs Interceptor vs AOP - Spring 요청 처리 흐름 정리
description: >
  Spring에서 HTTP 요청이 Controller에 도달하기까지 거치는 Filter, Interceptor, AOP의 역할과 차이, 그리고 요청 처리 순서를 정리했습니다.
sitemap: false
---

# [Algorithm] Filter vs Interceptor vs AOP - 요청이 어떻게 처리되는가

> PATCH/PUT, DTO, Controller 같은 Spring 글을 읽었다면, "요청이 어디서 걸리고, 어떤 순서로 처리될까?"가 궁금할 수 있다.  
> 이 글에서는 **Filter**, **Interceptor**, **AOP**가 각각 어디에 위치하고, 무엇을 할 때 쓰면 좋은지\*\* 한 번에 정리한다.

- [1. 한눈에 보는 요청 처리 흐름](#-1-한눈에-보는-요청-처리-흐름)
- [1.5 비유로 이해하기](#-15-비유로-이해하기)
- [2. Filter](#-2-filter)
- [3. Interceptor](#-3-interceptor)
- [4. AOP](#-4-aop)
- [5. 비교표](#-5-비교표)
- [6. 언제 무엇을 쓸까?](#-6-언제-무엇을-쓸까)
- [7. 요약](#-7-요약)

---

## 🎯 1. 한눈에 보는 요청 처리 흐름

HTTP 요청이 들어오면 대략 아래 순서로 지나간다.

```
[클라이언트]
     │
     ▼
┌─────────────────────────────────────────────────────────────┐
│  Filter 1 → Filter 2 → ... (Servlet 컨테이너 레벨)           │
└─────────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────┐
│  DispatcherServlet (Spring 진입점)                           │
└─────────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────┐
│  Interceptor (preHandle)                                     │
└─────────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────┐
│  @Controller / @RestController (핸들러 메서드)               │
│  └─ 이 안에서 @Transactional, AOP 등 적용 가능              │
└─────────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────┐
│  Interceptor (postHandle → afterCompletion)                  │
└─────────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────┐
│  Filter (응답 처리)                                          │
└─────────────────────────────────────────────────────────────┘
     │
     ▼
[클라이언트]
```

- **Filter**: Servlet API 일부. **DispatcherServlet 이전/이후**에서 동작. 모든 요청(정적 자원 포함)에 적용될 수 있음.
- **Interceptor**: Spring이 제공. **DispatcherServlet 안**에서, **Controller 호출 전/후**에 동작. Spring이 매핑한 요청만 처리.
- **AOP**: Spring이 제공. **특정 메서드(예: Service, Controller) 호출 전/후/예외**에 동작. 비즈니스 로직·트랜잭션·로깅 등에 많이 사용.

---

### 🏢 1.5 비유로 이해하기

**"빌딩에 방문객(HTTP 요청)이 들어와서 업무를 보는 과정"**으로 생각해 보자.

![예시 이미지1](https://github.com/nan0silver/nan0silver.github.io/blob/main/assets/img/blog/2026-02-23-pic1.png?raw=true)

| 구성 요소             | 비유                         | 하는 일                                                                                                                                                                                   |
| --------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Filter**            | **빌딩 1층 경비원**          | 모든 방문객이 **반드시** 거치는 곳. 출입증 확인, 짐 검사(인코딩·CORS 등), 위험물 차단. Spring 빌딩 **밖**에서 막춰서, "어느 부서로 갈지"는 모른다.                                        |
| **DispatcherServlet** | **안내 데스크(리셉션)**      | "어디로 가시나요?"라고 물어보고, **URL(요청 경로)**을 보고 "이 방문객은 3층 영업팀(Controller A)으로 보내야 해"라고 **배정**한다. 실제 업무는 안 하고, **누가 처리할지만 결정**한다.      |
| **Interceptor**       | **해당 층/회의실 앞 도어맨** | "3층 영업팀이요"라고 온 사람만 검사. **이 부서 들어가기 전**에 "예약 있으세요? 권한 있으세요?"(인증·권한) 확인. 들어간 **후**에 출입 기록 남기기(로깅)도 여기서 할 수 있다.               |
| **Controller**        | **실제 업무를 보는 부서**    | "회원 정보 주세요", "주문 등록해 주세요" 같은 **요청에 맞는 일**을 한다. 여기서 비즈니스 로직이 실행된다.                                                                                 |
| **AOP**               | **부서 안의 공통 규칙**      | "누군가 이 메서드(업무)를 할 때마다 **항상** 실행되는 규칙". 예: "출금할 때마다 로그 남기기", "이 메서드 실행 시 트랜잭션 시작/종료". HTTP 요청과 무관하게 **메서드 호출** 단위로 붙는다. |

**한 줄 요약**

- **Filter** → 빌딩 **입구**에서 모든 사람에게 적용되는 검사.
- **DispatcherServlet** → **"이 요청은 저 컨트롤러로"** 배정만 하는 안내 데스크.
- **Interceptor** → **그 컨트롤러로 가기 직전/직후**에만 거치는 층별 검사.
- **Controller** → 실제 **일을 처리하는 부서**.
- **AOP** → **그 부서 안에서** "이런 일 할 때마다 공통으로 치는 규칙".

---

## 🔷 2. Filter

### 무엇인가?

- **Servlet 스펙**에 정의된 컴포넌트.
- `javax.servlet.Filter` 인터페이스를 구현한다.
- **요청/응답**을 감싸서 전후 처리(인코딩, 로깅, 인증 등)를 할 수 있다.

### 어디서 동작하는가?

- **DispatcherServlet 앞뒤**. 즉 Spring 진입 **전**에 한 번, Spring 처리 **후** 응답 나가기 **전**에 한 번씩 거친다.
- URI로 “어떤 요청에만 적용할지” 지정할 수 있지만, 기본적으로 **모든 요청**이 Filter 체인을 통과한다 (설정에 따라 정적 자원 제외 가능).

### 특징

| 항목                | 내용                                                            |
| ------------------- | --------------------------------------------------------------- |
| **소속**            | Servlet API (Spring이 아님)                                     |
| **요청/응답**       | `ServletRequest`, `ServletResponse` (Servlet API 타입)          |
| **Spring Bean**     | 등록 가능하지만, 동작 자체는 Servlet 컨테이너가 관리            |
| **Controller 정보** | 모름 (아직 DispatcherServlet을 거치지 않았거나, 이미 지나간 뒤) |

### 예시: 인코딩 필터

```java
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class EncodingFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
                         FilterChain chain) throws IOException, ServletException {
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");
        chain.doFilter(request, response);  // 다음 Filter 또는 Servlet으로 전달
    }
}
```

- `chain.doFilter()` 를 호출하기 **전**: 요청 전처리 (인코딩 설정 등).
- `chain.doFilter()` 를 호출한 **후**: 응답 후처리 (필요 시).
- `doFilter()` 를 호출하지 않으면 요청이 Controller까지 가지 않는다 (요청 차단 가능).

### 쓰기 좋은 경우

- 전역 **인코딩 설정**
- **CORS** 처리 (응답 헤더 추가)
- **XSS** 방지용 요청/응답 래핑
- **로깅** (요청 URI, 메서드, IP 등) — 단, Interceptor나 AOP로도 가능

---

## 🔷 3. Interceptor

### 무엇인가?

- **Spring**이 제공하는 **HandlerInterceptor**.
- `DispatcherServlet`이 요청을 받은 **이후**, **Controller(핸들러)를 호출하기 전/후/완료 후**에 끼어든다.

### 어디서 동작하는가?

- **DispatcherServlet 내부**.
- **HandlerMapping**으로 “이 URL은 이 Controller 메서드로” 결정된 **이후**에만 동작한다.
- 따라서 **Spring이 매핑한 요청**에만 적용할 수 있고, 어떤 **Handler(Controller 메서드)** 에 붙었는지 알 수 있다.

### 세 시점

| 메서드              | 시점                                                                            |
| ------------------- | ------------------------------------------------------------------------------- |
| **preHandle**       | Controller 실행 **전**                                                          |
| **postHandle**      | Controller 실행 **후**, View 렌더링 전 (RestController면 보통 응답 이미 생성됨) |
| **afterCompletion** | View 렌더링 **후** 또는 예외 발생 **후** (정리·로깅에 유용)                     |

### 특징

| 항목                | 내용                                                           |
| ------------------- | -------------------------------------------------------------- |
| **소속**            | Spring Framework                                               |
| **요청/응답**       | `HttpServletRequest`, `HttpServletResponse` + **Handler** 정보 |
| **Spring Bean**     | 완전한 Spring Bean (DI 가능)                                   |
| **Controller 정보** | `Handler`로 “어떤 컨트롤러 메서드가 실행되는지” 알 수 있음     |

### 예시: 인증 체크 인터셉터

```java
@Component
public class AuthInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
                             Object handler) throws Exception {
        if (handler instanceof HandlerMethod) {
            HandlerMethod hm = (HandlerMethod) handler;
            if (hm.hasMethodAnnotation(LoginRequired.class)) {
                // 로그인 여부 확인 후 미로그인 시 false 반환 → Controller 미실행
                if (!isLoggedIn(request)) {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
                    return false;
                }
            }
        }
        return true;  // true면 다음 Interceptor / Controller 실행
    }
}
```

- **등록**은 `WebMvcConfigurer.addInterceptors()` 에서 `addPathPatterns`, `excludePathPatterns` 로 URI 패턴 지정.

### 쓰기 좋은 경우

- **인증/권한** 체크 (특정 URL만)
- **로그인 사용자 정보**를 request에 넣기
- **접근 로그** (어떤 URL, 어떤 메서드가 호출됐는지)
- Controller **실행 전/후**에만 하고 싶은 공통 처리

---

## 🔷 4. AOP

### 무엇인가?

- **Aspect-Oriented Programming**. “여러 메서드에 공통으로 들어가는 부가 기능”을 한곳에서 정의하는 방식.
- Spring AOP는 **프록시 기반**이라, **Spring이 관리하는 Bean의 메서드 호출**에만 적용된다.

### 어디서 동작하는가?

- **Controller, Service, Repository** 등 **Bean의 메서드가 호출될 때**.
- Filter/Interceptor와 달리 “HTTP 요청”에 묶이지 않고, **메서드 호출** 단위로 동작한다.
- 같은 메서드라도 **Spring 컨텍스트 밖에서 호출**되면 AOP가 적용되지 않는다 (예: 같은 클래스 내부에서 `this.method()` 호출).

### 특징

| 항목            | 내용                                                          |
| --------------- | ------------------------------------------------------------- |
| **소속**        | Spring Framework (AOP 모듈)                                   |
| **단위**        | **메서드** (클래스·메서드 단위로 적용 대상 지정)              |
| **요청/응답**   | 직접 접근하지 않음. 메서드 **인자, 반환값, 예외**에 접근 가능 |
| **Spring Bean** | 완전한 Spring Bean (DI 가능)                                  |

### 예시: 메서드 실행 시간 로깅

```java
@Aspect
@Component
public class LoggingAspect {

    @Around("@annotation(org.springframework.web.bind.annotation.GetMapping)")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        Object result = joinPoint.proceed();  // 실제 메서드 실행
        long elapsed = System.currentTimeMillis() - start;
        log.info("{} executed in {} ms", joinPoint.getSignature(), elapsed);
        return result;
    }
}
```

- `@Around`: 메서드 **앞뒤** 모두 제어.
- `@Before`, `@After`, `@AfterReturning`, `@AfterThrowing` 등으로 “전/후/반환 후/예외 시”만 넣을 수도 있다.

### 쓰기 좋은 경우

- **로깅** (메서드명, 인자, 실행 시간, 예외)
- **트랜잭션** (`@Transactional` 도 AOP로 동작)
- **권한 체크** (메서드 단위, 예: `@PreAuthorize` 와 유사한 커스텀)
- **예외 변환** (특정 예외를 공통 API 응답으로 감싸기)
- **캐싱** (메서드 결과 캐시)

---

## 📊 5. 비교표

| 구분                        | Filter                            | Interceptor                                    | AOP                             |
| --------------------------- | --------------------------------- | ---------------------------------------------- | ------------------------------- |
| **위치**                    | DispatcherServlet **밖** (앞·뒤)  | DispatcherServlet **안**, Controller **앞·뒤** | **메서드** 호출 전/후/예외      |
| **적용 단위**               | URI (전체 요청)                   | URI + Handler                                  | 메서드(클래스·어노테이션 등)    |
| **스펙**                    | Servlet API                       | Spring                                         | Spring AOP                      |
| **요청/응답 타입**          | ServletRequest/Response           | HttpServletRequest/Response                    | 없음 (메서드 인자·반환값)       |
| **Handler/Controller 정보** | 없음                              | 있음 (preHandle 등에서)                        | 타겟 메서드 정보만              |
| **Spring Bean**             | 등록 가능, 동작은 서블릿 컨테이너 | O                                              | O                               |
| **용도 예**                 | 인코딩, CORS, XSS, 전역 로깅      | 인증·인가, URL 단위 로깅                       | 트랜잭션, 로깅, 예외 처리, 캐시 |

---

## 🧩 6. 언제 무엇을 쓸까?

- **요청/응답 자체를 바꾸거나, Spring 진입 전에 막고 싶을 때**  
  → **Filter** (인코딩, CORS, 전역 보안 래퍼 등)

- **“이 URL은 로그인 필요해”처럼 URL·Handler 기준으로 막거나 가공할 때**  
  → **Interceptor** (인증, 권한, URL 단위 로깅)

- **“이 메서드 실행 전/후/예외 시 항상 이 로직”을 넣고 싶을 때**  
  → **AOP** (로깅, 트랜잭션, 예외 변환, 캐시 등)

- **이미 Spring 글들(PATCH/PUT, DTO 등)을 읽었다면**  
  → 요청은 **Filter → DispatcherServlet → Interceptor → Controller** 순으로 들어가고, **Controller/Service 메서드 안**에서 **AOP**가 도는 구간이라고 보면 된다.

---

## ✅ 7. 요약

| 항목            | 내용                                                                                                 |
| --------------- | ---------------------------------------------------------------------------------------------------- |
| **처리 순서**   | Filter → DispatcherServlet → Interceptor(pre) → Controller → Interceptor(post, after) → Filter(응답) |
| **Filter**      | Servlet 레벨, DispatcherServlet 앞뒤, 전역 인코딩·CORS·로깅 등                                       |
| **Interceptor** | Spring 레벨, Controller 전/후, URL·Handler 기준 인증·권한·로깅                                       |
| **AOP**         | 메서드 단위, 트랜잭션·로깅·예외 처리·캐시 등                                                         |
| **선택**        | 요청/응답·진입 전 차단 → Filter, URL/Handler 기준 → Interceptor, 메서드 공통 로직 → AOP              |

이렇게 세 가지를 구분해 두면, “요청이 어떻게 처리되는지”를 Spring 글들(PATCH/PUT, DTO, Controller)과 함께 한 번에 그릴 수 있다.
