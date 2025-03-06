---
layout: post
title: immutable, final, constant
description: >
  값이나 상태를 변경하지 못하도록 하는데 사용되는 immutable, final, constant에 대해 알아보자.
sitemap: false
---

# [Etc] immutable, final, constant

- [`Immutable`](#보일러플레이트boilerplate란)
- [`final`](#보일러플레이트의-특징)
- [`const`](#예제-코드)

---

## `Immutable` (불변)

> 생성 후 객체 자체의 상태를 변경할 수 없음
> Java의 키워드는 아님, 다양한 언어에서 사용되는 객체의 속성 개념

- 객체와 관련됨
- 특징
  - 모든 필드가 `final`이고 `private`
  - setter 메서드가 없음
  - 모든 가변 참조 필드가 방어적 복사를 통해 보호됨
- 중요한 점
  - 불변 객체는 멀티 스레드 환경에서 안전하게 사용 가능
  - 내부 상태를 변경하는 메서드를 제공하지 않아야 함.
- 예 : String, Integer, BigDecimal
  - `String` 클래스는 자바에서 대표적인 불변 객체
    > `String`객체를 한 번 생성하면 내부 값이 변경되지 않음.
    > 새로운 값을 할당하려면 새로운 객체가 만들어짐.
    - ```java
        String s1 = "Hello";
        String s2 = s1.concat(" World");
        System.out.println(s1); // 여전히 "Hello"
      ```

## `Final` (최종, 변경 불가)

> 한 번 할당되면 값을 변경할 수 없는 변수 또는 참조
> Java의 키워드

- 특징
  - 변수에 사용 : 초기화 후 재할당 불가
  - 메서드에 사용 : 오버라이딩 불가
  - 클래스에 사용 : 상속 불가
- 중요한 점
  - `final`은 참조의 변경을 막지만, 참조가 가리키는 객체의 내용 변경은 막지 않음
- 실무에서 활용
  1. 메서드 파라미터
     - 메서드 내에서 파라미터 값이 변경되지 않도록 보장
     - ```java
         public void processUser(final User user) { ... }
       ```
  2. 람다 표현식
     - 람다에서 외부 변수를 사용할 때는 반드시 `final` 또는 `effectively final`이어야 함
     - ```java
         final String prefix = "User-";
         userList.stream()
             .map(user -> prefix + user.getName())
             .forEach(System.out::println);
       ```
  3. 스레드 안정성
     - 멀티스레드 환경에서 불변성 보장에 도움

## `Const` (상수)

> 프로그램 전체에서 변경되지 않는 고정 값
> Java의 키워드

- 특징
  - 일반적으로 `static final`로 선언
  - 클래스 로딩 시점에 초기화
  - 관례적으로 대문자와 언더스코어 사용 (UPPER_SNAKE_CASE)
  - 예
    - `public static final int MAX_USERS = 100;`
- `static`
  - 상수(`const`)와 자주 함께 사용되는 변수
  - 클래스 수준에서 사용되며, 객체가 아닌 클래스에 종속됨
    - 클래스 로딩 시 한 번만 초기화되며 모든 객체가 공유
