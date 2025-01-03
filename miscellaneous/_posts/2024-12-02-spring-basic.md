---
layout: post
collection: miscellaneous
title: 스프링 콘셉트
description: >
  스프링 프레임워크의 주요 개념(IoC, DI, Bean, AOP, PSA)을 간략히 설명한 포스트입니다.
sitemap: false
---

# [TIL] 2024.12.02

목차

- [스프링 콘셉트](#스프링-콘셉트)

---

## 스프링 콘셉트

### 스프링 프레임워크의 주요 개념에 대해 다룬다.

- IoC

  - Inversion of Control
  - 객체의 생성과 관리를 개발자가 아니라 프레임워크가 대신하는 것
  - ```java
      public class A {
          private B b;
      }
    ```
  - 객체를 직접 생성하지 않고(new 키워드 사용하지 않고) 외부에서 관리하는 객체를 가져와 사용
  - 스프링에서는 스프링 컨테이너가 객체를 관리, 제공하는 역할을 함
    - 스프링 컨테이너
      - 빈이 생성되고 소멸되기 까지의 생명주기를 관리하는 것

- DI

  - Dependency Injection
  - 외부에서 객체를 주입받아 사용하는 것
  - 예시 (IoC/DI를 기초로 하는 스프링 코드)
    - ```java
        public class A {
            //A에서 B를 주입받음
            @Autowired
            B b;
        }
      ```

- Bean

  - 스프링 컨테이너가 생성하고 관리하는 객체
  - 스프링은 빈을 컨테이너에 등록하기 위해 XML 파일 설정, 애너테이션 추가 등 방법 제공

- AOP

  - Aspect Oriented Programming
  - 프로그래밍 시 핵심 관점과 부가 관점을 나누어 개발하는 것

- PSA
  - Portable Service Abstraction
  - 어느 기술을 사용하던 일관된 방식으로 처리하도록 하는 것
  - 대표적인 예
    - 클라이언트의 매핑과 클래스, 메서드의 매핑을 위한 애너테이션
