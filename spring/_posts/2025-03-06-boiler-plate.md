---
layout: post
title: Boiler Plate
description: >
  반복적으로 사용되는 기본 코드 템플릿인 Boilerplate에 대해 알아보자.
sitemap: false
---

# [Etc] 🎞️ Boilerplate와 Lombok

- [보일러플레이트(Boilerplate)란?](#보일러플레이트boilerplate란)
- [보일러플레이트의 특징](#보일러플레이트의-특징)
- [예제 코드](#예제-코드)
- [Lombok](#lombok)
- [롬복의 장점](#-롬복의-장점)
- [Spring에서의 보일러플레이트 해결 구조](#spring에서의-보일러플레이트-해결-구조)

---

> 보일러플레이트에 대해 알아보고, spring에서 보일러플레이트를 줄여주는 도구 중 하나인 롬복에 대해 알아보자.

## 보일러플레이트(Boilerplate)란?

- 소프트웨어 개발에서 반복적으로 사용되는 사용되는 <strong>기본 코드 템플릿</strong>
- 🔥 즉, "매번 새로 작성해야하는 기본 코드세트"를 보일러플레이트라고 함
- 의미
  - 원래는 인쇄 산업에서 반복적으로 사용되는 금속판을 의미
  - 이후 소프트웨어 개발에서도 "반복적으로 작성해야하는 코드 덩어리"를 의미하게 되었다.

## 보일러플레이트의 특징

1. 반복적인 코드

- 프로젝트를 시작할 때 매번 작성해야하는 코드들이 포함됨
- 예를 들어, 웹 애플리케이션을 만들 때 기본적인 프로젝트 구조, 설정 파일, 인증 로직 등이 해당
  > 반복적이니 안좋다고 여겨질 수 있지만, 완전히 없애는게 목적이 아니라 최소화하고 효율화하는 것이 핵심!

2. 템플릿화

- 코드 재사용성을 높이고, 개발 시간을 줄여줌
- 예를 들어, React, Express, Spring Boot같은 프레임워크에서는 보일러플레이트 코드가 포함된 템플릿이 제공됨

3. 프레임워크 및 라이브러리에서 자주 사용됨

- React : `create-react-app`이 기본적인 프로젝트 구조와 설정을 자동으로 생성
- Express : `express-generator`를 사용하면 기본적인 Express 프로젝트 생성
- Spring Boot : `Spring Initializr`를 사용사면 기본적인 설정이 포함된 프로젝트 생성

## 예제 코드

- Spring Boot 보일러플레이트

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MyApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }
}
```

## Lombok

> **롬복(Lombok)**은 **보일러플레이트 코드를 줄여주는 도구** 중 하나
>
> > 하지만 **Spring 전체가 보일러플레이트 문제를 해결하는 구조**고, 롬복은 그 중 **일부분**

- Java에서 **반복적으로 작성하는 코드들 (getter, setter, constructor 등)**을 **어노테이션으로 자동 생성**해주는 라이브러리

### 주요 어노테이션 정리

| 어노테이션                 | 설명                                                                                             |
| -------------------------- | ------------------------------------------------------------------------------------------------ |
| `@Getter`                  | 모든 필드에 getter 생성                                                                          |
| `@Setter`                  | 모든 필드에 setter 생성                                                                          |
| `@ToString`                | `toString()` 자동 생성                                                                           |
| `@EqualsAndHashCode`       | `equals()`와 `hashCode()` 자동 생성                                                              |
| `@NoArgsConstructor`       | 기본 생성자 생성                                                                                 |
| `@AllArgsConstructor`      | 모든 필드를 받는 생성자 생성                                                                     |
| `@RequiredArgsConstructor` | `final` 필드만 받는 생성자 생성                                                                  |
| `@Data`                    | `Getter + Setter + ToString + EqualsAndHashCode` + `@RequiredArgsConstructor` 포함된 종합 패키지 |
| `@Builder`                 | 빌더 패턴 자동 생성 (`.builder()`로 객체 생성 가능)                                              |

---

### 예시:

#### ✅ 일반적인 Java 코드 (보일러플레이트 많음)

```java
public class User {
    private String name;
    private int age;

    public User() {}
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    // ... 반복
}
```

#### ✅ 롬복 사용

```java
import lombok.Data;

@Data
public class User {
    private String name;
    private int age;
}
```

- `@Data` 하나로 `getter/setter/toString/equals/hashCode/constructor` 전부 생성됨 🎉

---

## 💡 롬복의 장점

1. ✂️ **코드가 짧아져서** 가독성이 좋아짐
2. 🚫 **getter/setter 작성 실수 방지**
3. 🧪 **테스트 코드도 간편해짐**
4. ⏱ **코드 작성 속도 급상승**
5. 🔄 **리팩토링할 때 수정할 코드 줄어듦**

## Spring에서의 보일러플레이트 해결 구조

| 도구 / 개념           | 역할                                                      |
| --------------------- | --------------------------------------------------------- |
| **Spring Boot**       | 설정파일, 서버 실행 등 기본 구조 자동화                   |
| **Spring MVC 구조**   | 컨트롤러/서비스/리포지토리 구조 정형화해서 반복 패턴 통일 |
| **Spring Initializr** | 프로젝트 기본 뼈대 자동 생성                              |
| **롬복(Lombok)**      | DTO나 엔티티에서 반복되는 getter/setter 등 제거           |
| **의존성 주입 (DI)**  | 객체 생성과 의존성 연결을 Spring이 대신 처리              |

---
