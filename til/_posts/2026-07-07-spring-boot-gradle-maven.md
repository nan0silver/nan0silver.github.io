---
layout: post
collection: til
description: >
  Spring Initializr에서 선택하는 Gradle(Groovy), Gradle(Kotlin DSL), Maven 빌드 도구의
  차이, Groovy/Kotlin DSL의 타입·IDE 체감 차이, 선택 기준을 정리한 글이다.
categories: ["til"]
tags:
  [
    "TIL",
    "Spring Boot",
    "Gradle",
    "Maven",
    "빌드 도구",
    "Spring Initializr",
    "Kotlin DSL",
  ]
date: 2026-07-07 00:00:00
last_modified_at: 2026-07-07 00:00:00
sitemap: false
---

# [TIL] Spring Boot 빌드 도구 — Gradle(Groovy) vs Gradle(Kotlin) vs Maven

> [Spring Initializr](https://start.spring.io/)에서 프로젝트를 만들 때 가장 먼저 고르는 항목 중 하나가 빌드 도구다. 세 가지 선택지는 이름만 다르지 않다. 각각 설정 파일 형식, 문법, 생태계가 달라서 팀 컨벤션과 취향에 따라 고르게 된다.

- [들어가며](#들어가며)
- [1. 세 가지 선택지 한눈에 보기](#1-세-가지-선택지-한눈에-보기)
- [2. Maven](#2-maven)
- [3. Gradle — Groovy DSL과 Kotlin DSL](#3-gradle--groovy-dsl과-kotlin-dsl)
- [4. 근본적인 차이: 동적 타입 vs 정적 타입](#4-근본적인-차이-동적-타입-vs-정적-타입)
- [5. 자동완성과 타입 안정성](#5-자동완성과-타입-안정성)
- [6. Kotlin DSL의 트레이드오프](#6-kotlin-dsl의-트레이드오프)
- [7. 비교표](#7-비교표)
- [8. 어떤 걸 고를까](#8-어떤-걸-고를까)
- [마무리](#마무리)

---

## 들어가며

Spring Boot 프로젝트를 생성하면 의존성 관리, 컴파일, 테스트, 패키징을 담당하는 **빌드 도구**가 함께 들어온다.

Spring Initializr에서는 아래 세 가지 중 하나를 고른다.

| 선택지 | 설정 파일 |
| ------ | --------- |
| Gradle - Groovy | `build.gradle`, `settings.gradle` |
| Gradle - Kotlin | `build.gradle.kts`, `settings.gradle.kts` |
| Maven | `pom.xml` |

애플리케이션 코드(Spring Boot 자체)는 동일하다. 달라지는 것은 **빌드 스크립트를 어떤 형식으로 쓰느냐**뿐이다.

---

## 1. 세 가지 선택지 한눈에 보기

```
Spring Boot 앱
    ├── Maven          → pom.xml (XML)
    ├── Gradle Groovy  → build.gradle (Groovy)
    └── Gradle Kotlin  → build.gradle.kts (Kotlin)
```

Gradle Groovy와 Gradle Kotlin은 **같은 Gradle 엔진**을 쓰고, DSL(도메인 특화 언어) 문법만 다르다. Maven은 별도의 빌드 시스템이다.

`build.gradle`을 쓰면 Groovy DSL, `build.gradle.kts`를 쓰면 Kotlin DSL이다. 둘 다 같은 Gradle을 구동하고 빌드 결과물도 동일하다. 차이는 빌드 스크립트를 **어떤 언어로 기술하느냐**에 있다.

---

## 2. Maven

가장 오래 쓰인 Java 빌드 도구 중 하나다. `pom.xml` 하나에 프로젝트 정보와 의존성을 선언한다.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.4.0</version>
    </parent>

    <groupId>com.example</groupId>
    <artifactId>demo</artifactId>
    <version>0.0.1-SNAPSHOT</version>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
    </dependencies>
</project>
```

**특징**

- XML 기반이라 구조가 명확하고, 레퍼런스·예제가 많다.
- 기업 레거시 프로젝트에서 여전히 흔하다.
- 설정이 길어지면 XML 보일러플레이트가 늘어난다.
- 멀티 모듈, 커스텀 빌드 로직이 복잡해지면 Gradle보다 유연성이 떨어지는 편이다.

---

## 3. Gradle — Groovy DSL과 Kotlin DSL

Spring Boot 공식 문서와 많은 튜토리얼이 Groovy DSL(`build.gradle`)을 기준으로 한다. Kotlin DSL은 Gradle 5.x 이후 본격적으로 쓰이기 시작했고, 파일 확장자가 `.kts`다.

**Groovy DSL**

- Maven보다 설정이 짧고, 스크립트형이라 커스텀 빌드 로직을 쓰기 쉽다.
- Gradle에서 가장 오래 쓰인 형식이라 자료와 플러그인 예제가 풍부하다.
- Spring Initializr 기본값에 가깝고, 입문·학습 자료와의 호환성이 좋다.

**Kotlin DSL**

- Groovy DSL과 **동일한 Gradle 기능**을 제공한다.
- Spring Boot + Kotlin 앱을 만들 때 빌드 스크립트와 애플리케이션 언어를 맞출 수 있다.
- 예제·블로그 글이 Groovy DSL보다 적은 편이라, 처음엔 문법 차이를 익히는 비용이 조금 있다.

공통으로 Gradle은 **증분 빌드·빌드 캐시** 덕분에 대형 프로젝트에서 빌드 속도가 빠른 경우가 많다.

---

## 4. 근본적인 차이: 동적 타입 vs 정적 타입

Groovy와 Kotlin DSL의 실무적 차이는 대부분 여기서 출발한다.

**Groovy — 동적 타입**

Groovy는 동적 타입 언어다. 스크립트를 실행하기 전까지 IDE가 `implementation`이 무엇인지, 어떤 인자를 받는지 완전히는 모른다. Groovy 특유의 메타프로그래밍(`methodMissing`, 동적 프로퍼티) 덕분에 Gradle DSL이 간결하게 표현되는데, 그 대가로 IDE가 정적으로 검증할 수 있는 정보가 제한된다.

**Kotlin — 정적 타입**

Kotlin은 정적 타입 언어다. `build.gradle.kts`는 컴파일되는 코드이고, Gradle API가 전부 타입으로 노출된다. IDE가 실제 타입 정보를 갖고 동작하기 때문에, 자동완성·오류 검출 같은 체감 차이가 여기서 파생된다.

---

## 5. 자동완성과 타입 안정성

Gradle DSL을 고를 때 가장 크게 느껴지는 차이다.

**Kotlin DSL**

IntelliJ에서 자동완성이 정확하게 뜬다. `tasks.`를 치면 실제 존재하는 태스크·메서드가 나오고, 인자 타입이 틀리면 빨간 줄이 표시된다. 오타를 커밋 전에 잡을 수 있다.

**Groovy DSL**

자동완성이 부분적이다. IntelliJ가 Gradle 모델을 추론해서 일부는 제공하지만, 동적으로 생성되는 부분은 놓친다. 오타를 내면 IDE는 조용하고, `./gradlew build`를 돌려야 런타임에 `no such property` 같은 에러로 발견되는 경우가 있다.

문법 차이 자체는 사소하다. Kotlin은 문자열에 큰따옴표를 쓰고, 프로퍼티 할당에 `=`가 필요하다는 정도다.

```groovy
// build.gradle (Groovy)
plugins {
    id 'org.springframework.boot' version '3.4.0'
}
group = 'com.example'
sourceCompatibility = '21'
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
}
```

```kotlin
// build.gradle.kts (Kotlin)
plugins {
    id("org.springframework.boot") version "3.4.0"
}
group = "com.example"
java {
    sourceCompatibility = JavaVersion.VERSION_21
}
dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
}
```

Groovy는 작은따옴표·괄호 생략이 가능해 조금 더 짧고, Kotlin은 괄호와 큰따옴표를 요구해 살짝 더 명시적이다. `implementation '...'` ↔ `implementation("...")`처럼 따옴표·괄호 규칙만 다르고 의미는 같다. 이 정도 차이는 하루면 적응할 수 있다.

---

## 6. Kotlin DSL의 트레이드오프

Kotlin DSL의 장점만 보면 항상 Kotlin이 이기는 것처럼 보이지만, 단점도 있다.

**첫 빌드 시 스크립트 컴파일 오버헤드**

`.kts`는 컴파일되는 코드이므로 초기 구성이나 스크립트 변경 후 첫 실행이 Groovy보다 느릴 수 있다. 다만 이후엔 캐시되어 반복 빌드 성능은 차이가 없고, IntelliJ가 Kotlin Script를 무겁게 인덱싱하던 초기 버전 이슈도 지금은 대부분 개선됐다.

**예제 생태계는 여전히 Groovy 중심**

인터넷에 굴러다니는 Gradle 예제·Stack Overflow 답변은 여전히 Groovy가 다수다. Kotlin으로 쓰다 보면 Groovy 스니펫을 변환해야 하는 상황이 종종 생긴다. 변환 자체는 어렵지 않지만, 복사-붙여넣기가 바로 안 되는 마찰은 있다.

---

## 7. 비교표

| 항목 | Maven | Gradle (Groovy) | Gradle (Kotlin) |
| ---- | ----- | --------------- | --------------- |
| 설정 파일 | `pom.xml` | `build.gradle` | `build.gradle.kts` |
| 문법 | XML | Groovy (동적 타입) | Kotlin (정적 타입) |
| 빌드 엔진 | Maven | Gradle | Gradle |
| 학습 자료 | 매우 많음 | 많음 (Spring 기준) | 점점 늘어나는 중 |
| IDE 자동완성 | 양호 | 부분적 | 정확 (타입 기반) |
| 오타 검출 시점 | XML 스키마·빌드 시 | 주로 빌드 시 | IDE + 빌드 시 |
| 빌드 속도 | 보통 | 빠른 편 | 빠른 편 (첫 실행만 약간 느릴 수 있음) |
| 커스텀 빌드 | 제한적 | 유연 | 유연 |

---

## 8. 어떤 걸 고를까

정답은 하나가 아니다. 아래는 실무에서 자주 쓰는 기준이다.

**Maven을 고르는 경우**

- 팀이 Maven에 익숙하거나, 회사 표준이 Maven일 때
- 단순한 단일 모듈 프로젝트이고 XML 선언형 설정이 편할 때

**Gradle (Groovy)를 고르는 경우**

- Spring Boot 입문·학습, 튜토리얼을 그대로 따라 하고 싶을 때
- 이미 `build.gradle`에 익숙하고, 익숙한 문법으로 빠르게 셋업하고 싶을 때
- 인터넷 예제를 그대로 복사-붙여넣기하며 작업할 때

이미 Groovy DSL에 익숙하다면, 그 자산을 그대로 쓰는 것도 합리적이다. Gradle 기능은 Kotlin DSL과 100% 동일하고, 신규 프로젝트에서 Groovy를 택해도 손해 볼 것은 없다.

**Gradle (Kotlin)을 고르는 경우**

- 애플리케이션도 Kotlin으로 작성할 때
- IntelliJ 자동완성·타입 검증으로 빌드 스크립트 오타를 IDE 단계에서 잡고 싶을 때
- AI 코딩 도구처럼 스크립트를 읽고 수정하는 도구와 협업할 때 — 타입 정보가 있는 `.kts`를 더 정확히 다루는 편이다
- 신규 프로젝트를 오래 유지보수할 계획이고, 초기 적응 비용을 감수할 수 있을 때

한 줄로 정리하면 이렇다.

- **익숙함·빠른 시작** → Groovy
- **타입 안정성·IDE/에이전트 협업·장기 유지보수** → Kotlin

한번 고른 뒤에 Spring Boot 앱 자체를 바꿀 필요는 없다. 빌드 도구만 다를 뿐 `@RestController`, `@Service`, `application.yml` 같은 코드는 동일하게 동작한다. 나중에 Groovy ↔ Kotlin DSL로 서로 변환하는 것도 가능하다(수작업이지만 규모가 크지 않다).

---

## 마무리

Spring Initializr의 빌드 도구 선택은 **애플리케이션 아키텍처가 아니라 빌드 스크립트 형식**을 정하는 일이다.

- **Maven** — XML, 익숙함과 안정성
- **Gradle Groovy** — Spring 생태계에서 가장 흔한 Gradle 형식, 예제 호환성
- **Gradle Kotlin** — 같은 Gradle이지만 정적 타입 DSL, IDE·장기 유지보수에 유리

팀 컨벤션이 없다면 Spring Boot 학습 단계에서는 **Gradle Groovy**, Kotlin으로 앱을 짤 계획이거나 빌드 스크립트의 타입 안정성을 중시한다면 **Gradle Kotlin**을 고르는 경우가 많다. 이미 Maven에 익숙하다면 Maven으로 시작해도 전혀 문제없다.
