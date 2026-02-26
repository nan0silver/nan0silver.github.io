---
layout: post
title: Naming Convention
description: >
  식별자를 만들 때 가독성이 좋도록 규정한 이름짓는 규칙인 naming convention에 대해 알아보자.
sitemap: false
---

# [Etc] Naming Convention

- [Naming Convention이란?](#naming-convention이란)
- [케밥 케이스 (Kebab-case)](#1-케밥-케이스-kebab-case)
- [카멜 케이스 (camelCase)](#2-카멜-케이스-camelcase)
- [스네이크 케이스 (snake_case)](#3-스네이크-케이스-snake_case)
- [파스칼 케이스 (PascalCase)](#4-파스칼-케이스-pascalcase)
- [선택 기준](#선택-기준)

---

## Naming Convention이란?

- 프로그래밍에서 변수, 함수, 클래스 이름 등을 작성하는 규칙

---

## 1. 케밥 케이스 (Kebab-case)

- 단어를 **하이픈(-)**으로 구분하며, 모든 문자를 소문자로 작성
- 모양이 케밥을 닮았다고 해서 붙여진 이름
- 특징
  - 가독성이 좋음
  - HTML, CSS에서 자주 사용됨
  - 언어에 따라 변수나 함수이름으로는 사용할 수 없는 경우도 있음
    - 하이픈이 연산자로 해석될 수 있어서
- 예시

  ```css
  /* CSS 클래스 이름 */
  .button-primary {
      background-color: blue;
      color: white;
  }

  /* 파일 이름 */
  my-awesome-file.js
  ```

## 2. 카멜 케이스 (camelCase)

- 첫 단어는 소문자로 시작하고, 이후 단어의 첫 글자를 대문자로 작성
- 이름이 낙타의 등처럼 튀어나온 형태를 닮아서 붙인 이름
- 특징
  - JavaScript, Java, C#, Python 등에서 변수와 함수 이름으로 자주 사용됨
  - 대문자 없이 단어를 연결해 코드 가독성을 높이는 데 도움을 줌
- 예시
  ```javascript
  // JavaScript 변수와 함수
  let userName = "Alice";
  function getUserData() {
    return userName;
  }
  ```

## 3. 스네이크 케이스 (snake_case)

- 단어를 **밑줄(\_)**로 구분하며, 모든 문자를 소문자로 작성
- 뱀이 기어다니는 모양을 닮아서 붙여진 이름
- 특징
  - Python, SQL, Ruby, C, C++, PHP, JSON 데이터 스키마에서 변수와 함수 이름으로 자주 사용됨
- 예시

  ```python
  # Python 변수 이름
  user_name = "Alice"

  # Python 함수 이름
  def get_user_data():
      return user_name
  ```

## 4. 파스칼 케이스 (PascalCase)

- 각 단어의 첫 글자를 대문자로 작성
  - 카멜 케이스와 비슷하지만 첫 단어도 대문자
- 특징
  - Java, TypeScript등의 클래스 이름과 타입 이름으로 자주 사용됨
- 예시

  ```java
  // Java 클래스 이름
  public class UserAccount {
      private String UserName;

      public UserAccount(String userName) {
          this.UserName = userName;
      }
  }
  ```

## 선택 기준

- 언어/환경의 표준에 따라 케이스를 선택
  - JavaScript, Java
    - camelCase (변수/함수)
    - PascalCase (클래스)
  - Python
    - snake_case
  - CSS/HTML
    - kebab-case
- 팀 또는 프로젝트의 코딩 컨벤션에 따라 일관성 유지가 중요 (가독성을 위해)
