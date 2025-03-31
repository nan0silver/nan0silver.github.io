---
layout: post
title: SQL Injection
description: >
  악의적인 사용자가 SQL 쿼리에 코드를 삽입해 DB정보를 탈취하거나 조작하는 것을 뜻하는 SQL Injection에 대해 알아보자.
sitemap: false
---

# [Etc] 💣 SQL Injection

- [SQL Injection이란?](#sql-injection이란)
- [Spring 관점에서 SQL Injection 방지법](#-spring-관점에서-sql-injection-방지법)
- [요약](#-spring-배우는-입장에서-조심할-포인트-요약)

---

## SQL Injection이란?

> **SQL Injection**이란, 사용자가 입력한 값을 통해 **원래 의도하지 않은 SQL문을 실행하게 만들어**  
> **데이터베이스의 데이터를 탈취하거나 조작하는 공격**

### 🔍 예시 (Spring 쓰기 전 일반 JDBC 코드 기준):

```java
String sql = "SELECT * FROM users WHERE username = '" + username + "'";
```

만약 `username`에 아래와 같은 값을 입력하면?

```
' OR '1'='1
```

그러면 쿼리가 이렇게 바뀜:

```sql
SELECT * FROM users WHERE username = '' OR '1'='1'
```

→ 모든 유저 정보가 다 조회됨 😱  
→ 비밀번호 없이 로그인도 가능해짐

---

## 🔐 Spring 관점에서 SQL Injection 방지법

### ✅ 1. **JDBC 직접 사용 시: PreparedStatement 필수!**

```java
String sql = "SELECT * FROM users WHERE username = ?";
PreparedStatement pstmt = conn.prepareStatement(sql);
pstmt.setString(1, username);  // 자동으로 문자열 escape 처리
```

이렇게 하면 `' OR '1'='1` 같은 입력도 그냥 문자열로 인식되므로 안전하다.

---

### ✅ 2. **Spring JDBC Template 사용 시**

```java
String sql = "SELECT * FROM users WHERE username = ?";
User user = jdbcTemplate.queryForObject(sql, new Object[]{username}, userRowMapper);
```

여기서도 `?`를 사용해서 바인딩하면 PreparedStatement가 적용되므로 안전하다.

---

### ✅ 3. **JPA / Spring Data JPA 사용 시**

JPA는 SQL을 직접 작성하지 않고 엔티티 중심으로 데이터를 다루기 때문에 **기본적으로 SQL Injection에 강함**!

#### 🔸 예시:

```java
User user = userRepository.findByUsername(username);
```

이런 방식은 내부적으로 PreparedStatement를 사용하기 때문에 안전함.

#### 🔸 커스텀 JPQL 사용 시에도 파라미터 바인딩 필수!

```java
@Query("SELECT u FROM User u WHERE u.username = :username")
User findByUsername(@Param("username") String username);
```

✅ `:username` 형태로 파라미터 바인딩하면 OK  
❌ 아래처럼 문자열 직접 연결하면 위험:

```java
@Query("SELECT u FROM User u WHERE u.username = '" + username + "'")
```

---

## 🚨 Spring 배우는 입장에서 조심할 포인트 요약

| 상황                  | 안전한 방법                | 주의할 점                  |
| --------------------- | -------------------------- | -------------------------- |
| JDBC 직접 사용        | `PreparedStatement`        | 문자열 직접 연결 ❌        |
| JdbcTemplate          | `?` 자리 바인딩 사용       | 쿼리 조합 ❌               |
| JPA / Spring Data JPA | 파라미터 바인딩 (`:param`) | JPQL 문자열 직접 붙이기 ❌ |
| QueryDSL              | 완전 안전 (타입 기반 쿼리) | -                          |
| 사용자 입력값 처리    | 입력 검증, 길이 제한       | 필터 없이 바로 사용 ❌     |

---

## 🎯 마무리 요약

- SQL Injection = **사용자가 입력한 값을 통해 악성 SQL 실행**
- Spring에서는 기본적으로 **PreparedStatement** 방식이므로 잘 쓰면 안전함
- 하지만 **직접 쿼리 짜거나, 문자열로 SQL을 조합**하는 경우 주의!
- **ORM(JPA) + 파라미터 바인딩** 방식으로 작성하면 거의 대부분 안전하게 막을 수 있음

---
