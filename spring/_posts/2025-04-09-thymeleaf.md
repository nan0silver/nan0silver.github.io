---
layout: post
collection: spring
title: Thymeleaf
description: >
  서버 사이드 템플릿 엔진인 Thymeleaf에 대해 알아보자.
sitemap: false
---

# [Spring] Thymeleaf

- [Thymeleaf는 왜 쓰는 걸까?](#-1-thymeleaf는-왜-쓰는-걸까)
- [기본 문법 정리](#-2-기본-문법-정리)
- [전체 흐름 예시](#-3-전체-흐름-예시)
- [어디에 파일을 넣어야 할까?](#-4-어디에-파일을-넣어야-할까)
- [요약](#-요약)

---

## 🌱 1. Thymeleaf는 왜 쓰는 걸까?

> Spring Boot에서 매우 자주 사용되는 **서버 사이드 템플릿 엔진**

- HTML을 그저 정적인 파일로만 쓰는 게 아니라,  
  **Spring Controller에서 전달한 데이터를 HTML에서 동적으로 표현하고 싶을 때** Thymeleaf를 사용 - HTML에서 Java 객체나 데이터들을 **동적으로 바인딩**해서 화면에 보여줌.

예를 들어,  
사용자 이름을 동적으로 보여주려면 이런 식으로:

```html
<p th:text="${user.name}">홍길동</p>
```

Spring Controller에서 `user`라는 객체를 넘기면, `user.name`이 자동으로 대체돼서 HTML에 출력된다.

---

## 🧩 2. 기본 문법 정리

### ① `th:text` — 텍스트 출력

```html
<p th:text="${message}"></p>
```

→ `${message}`의 값을 이 `<p>` 태그 안에 출력해줌.

---

### ② `th:each` — 반복문

```html
<li th:each="item : ${items}" th:text="${item}"></li>
```

→ `items` 리스트를 하나씩 꺼내서 `item`으로 반복해 `<li>`들을 만든다.

---

### ③ `th:if`, `th:unless` — 조건문

```html
<p th:if="${user != null}">로그인 성공</p>
<p th:unless="${user != null}">로그인 해주세요</p>
```

---

### ④ `th:href`, `th:src` — 링크나 이미지 경로 바인딩

```html
<a th:href="@{/home}">홈으로</a> <img th:src="@{/images/logo.png}" />
```

- `@{/home}`은 `/home` 경로를 의미해. 상대경로, 쿼리스트링도 가능하다.

---

### ⑤ `th:action` — form 전송 주소

```html
<form th:action="@{/submit}" method="post"></form>
```

→ `/submit`로 POST 요청을 보냄.

---

### ⑥ `th:object` + `th:field` — 폼 객체 바인딩

```html
<form th:object="${userForm}" method="post">
  <input type="text" th:field="*{name}" />
</form>
```

→ `userForm.getName()`과 연결돼서, 입력하면 자동으로 매핑됨.

---

## 🧠 3. 전체 흐름 예시

### ✅ Controller

```java
@GetMapping("/hello")
public String hello(Model model) {
    model.addAttribute("message", "안녕하세요!");
    return "hello";
}
```

### ✅ HTML (hello.html)

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
  <head>
    <title>Hello</title>
  </head>
  <body>
    <p th:text="${message}">기본 메시지</p>
  </body>
</html>
```

결과적으로는 `<p>안녕하세요!</p>`가 출력된다.

---

## 🧪 4. 어디에 파일을 넣어야 할까?

Thymeleaf 템플릿 파일들은 이곳에 넣는다:

```
src/main/resources/templates/
```

여기 안에 `hello.html`, `index.html` 같은 HTML 파일들을 넣으면 됨.  
이 파일들은 Spring MVC의 Controller에서 return으로 연결할 수 있음

---

## ✨ 요약

| 기능           | 문법 예시                   |
| -------------- | --------------------------- |
| 텍스트 출력    | `th:text="${data}"`         |
| 반복           | `th:each="item : ${items}"` |
| 조건문         | `th:if`, `th:unless`        |
| 링크 경로      | `th:href="@{/path}"`        |
| 이미지 경로    | `th:src="@{/img/logo.png}"` |
| 폼 전송 경로   | `th:action="@{/submit}"`    |
| 폼 객체 바인딩 | `th:object`, `th:field`     |

---
