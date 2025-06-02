---
layout: post
title: "spring-boot-starter-validation, 테스트 코드 모니터링 툴"
description: >
  spring-boot-starter-validation, 테스트 코드 모니터링 툴에 대한 TIL 기록
categories: ["spring"]
tags: ["TIL", "Spring"]
date: 2025-05-12 00:00:00
last_modified_at: 2025-05-22 05:27:40
github_issue: 56
github_url: https://github.com/nan0silver/TIL/issues/56
sitemap: false
---

> 📝 **TIL (Today I Learned)**  
> 🔗 **원본 이슈**: [#56](https://github.com/nan0silver/TIL/issues/56)  
> 📅 **작성일**: 2025-05-12  
> 🔄 **최종 수정**: 2025년 05월 22일

---

## 🍀 새롭게 배운 것

- spring-boot-starter-validation
- 테스트 코드 모니터링 툴

### 1️⃣ `spring-boot-starter-validation`

> **Spring Boot에서 사용자 입력 값(요청 바디 등)을 검증**할 수 있게 해주는 의존성 패키지
> 내부적으로는 `javax.validation` (JSR-380)이나 `jakarta.validation` API를 기반으로 동작

- 주로 아래와 같은 상황에 동작
  - 사용자가 회원가입을 할 때
  - 게시글을 작성할 때
  - 비밀번호 변경할 때 등

**프론트엔드에서 필터링한다고 해도, 백엔드에서는 무조건 검증이 필요**

- 신뢰할 수 없는 요청이나 보안 위험을 방지하기 위해서 (프론트는 우회가 가능하므로) 백엔드 검증은 필수!
- 검증 애너테이션
  - `@NotNull`, `@NotBlank`, `@Size`, `@Email`, `@Min`, `@Max` 등
- 검증 실패 시
  - `@ControllerAdvice`와 `@ExceptionHandler`를 이용해 에러 메시지 사용

#### 1. 의존성 추가 (`build.gradle`)

```groovy
implementation 'org.springframework.boot:spring-boot-starter-validation'
```

#### 2. DTO 클래스에 검증 어노테이션 달기

```java
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SignupRequestDto {

    @NotBlank(message = "이메일은 필수입니다.")
    private String email;

    @Size(min = 8, message = "비밀번호는 최소 8자 이상이어야 합니다.")
    private String password;

    // getter, setter
}
```

#### 3. Controller에서 검증 처리

```java
@PostMapping("/signup")
public ResponseEntity<?> signup(@Valid @RequestBody SignupRequestDto request) {
    // 통과 시 로직 실행
}
```

- `@Valid`가 붙은 객체에서 문제가 발생하면 자동으로 400 에러 발생.
- 에러 메시지는 `@ControllerAdvice`를 통해 커스터마이징도 가능.

### 2️⃣ 테스트 코드 모니터링 툴

> **"테스트 코드의 품질과 실행 현황을 시각적으로 분석/모니터링하는 도구"**
> 즉, 테스트가 얼마나 잘 되어 있는지 \*\*"숫자와 그래프"\*\*로 보여주는 도구

- 테스트 코드가 있다고 해도, \*\*정말 전체 코드를 잘 테스트하고 있는지는 모름
- 그래서 “**코드 커버리지**”, “**테스트 성공률**”, “**실행 시간**” 같은 걸 측정해서 모니터링할 수 있어야 한다.
  - 커버리지
    - 코드의 품질과 신뢰성을 수치로 확인할 수 있는 지표
    - 단순히 테스트를 작성하는 것보다, 커버리지를 보면서 blind spot 없이 테스트하는 게 중요!

* 🔧 대표적인 도구들
  | 도구 | 설명 |
  | ---------------------- | ----------------------------------- |
  | **JaCoCo** | Java 프로젝트에서 가장 널리 쓰이는 코드 커버리지 측정 도구 |
  | **SonarQube** | 코드 품질, 보안 취약점, 커버리지까지 통합 분석 |
  | **IntelliJ 자체 기능** | 실행 후 커버리지를 하이라이팅으로 보여줌 |
  | **Codecov, Coveralls** | GitHub Actions와 연동해 커버리지 리포트 자동화 |
