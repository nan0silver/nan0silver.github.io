---
layout: post
title: JAVA - StirngBuilder
description: >
  StringBuilder란 무엇인지, 어떻게 활용되는지 알아본다.
sitemap: false
---

# [JAVA] StringBuilder

목차

1. [String](#string)
2. [StringBuilder](#stringbuilder)

---

## String

- 반복적으로 String을 연결하거나, 수정해야 할 경우, 보통은 아래와 같은 경우로 string을 사용한다.
- ```java
    public class Main{
    public static void main(String[] args) {
        String java = "자바";
        java += "공부";
        System.out.println(java);
    }
    }
  ```

- 하지만 string은 불변(immutable)객체이므로, "자바"메모리에 "공부"가 추가되는 것이 아니라, 새로운 메모리에 "자바공부"가 저장됨
- 문자열이 수정될 때마다 새로운 메모리를 할당받기 때문에 성능저하가 일어날 수 있음

## StringBuilder

- StringBuilder는 mutable sequence of characters.
- 문자열이 변경될 때마다 새로운 메모리를 할당받지 않고, 버퍼를 통해 문자열을 관리하다 toStirng()을 통해 Stirng 객체를 생성
- StringBuilder가 효율적인 경우
  - 문자열의 반복적인 연결
  - 문자열의 잦은 수정
  - 대량의 문자열을 처리할 때
- 단점
  - StringBuilder는 thread-safe하지 않아 멀티쓰레드 환경에서 좋지 않다.
  - 멀티쓰레스 환경에서는 StringBuffer를 추천
    - StringBuffer는 StringBuilder와 동일한 API를 사용하지만 각각의 메소드에 대해 동기화를 보장하기 때문
    - String보다는 빠르고 StirngBuilder보다는 느림
