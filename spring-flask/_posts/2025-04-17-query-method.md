---
redirect_from:
  - /spring/2025-04-17-query-method/
layout: post
title: JPA Query Method
description: >
  JPA의 Query Method에 대해 알아보자.
sitemap: false
---

# [Spring] JPA Query Method

- [JpaRepository 상속](#jparepository-상속)
- [그렇다면 커스텀 쿼리는 어떻게 할까?](#-그렇다면-커스텀-쿼리는-어떻게-할까)
- [개발자 관점 팁](#-개발자-관점-팁)

---

## `JpaRepository` 상속

- `JpaRepository`를 상속한 Repository 인터페이스는 여러 기능이 내장된 상태가 된다.
  - 예시 : `public interface UserRepository extends JpaRepository<User, Long> {}`
- 이 경우, `findById()` 같은 기능은 이미 내장되어 편리하게 사용할 수 있다.
- 내장 함수

  - `JpaReposiroty`가 상속하고 있는 인터페이스 중, `CrudRepository`가 아래와 같이 기본 CRUD 메서드를 가지고 있어 직접 구현하지 않아도 사용할 수 있음.
  - ```java
      public interface CrudRepository<T, ID> extends Repository<T, ID> {
        <S extends T> S save(S entity);

        <S extends T> Iterable<S> saveAll(Iterable<S> entities);

        Optional<T> findById(ID id);

        boolean existsById(ID id);

        Iterable<T> findAll();

        Iterable<T> findAllById(Iterable<ID> ids);

        long count();

        void deleteById(ID id);

        void delete(T entity);

        void deleteAllById(Iterable<? extends ID> ids);

        void deleteAll(Iterable<? extends T> entities);

        void deleteAll();
       }
    ```

## 🤔 그렇다면 커스텀 쿼리는 어떻게 할까?

- Spring Data JPA는 메서드 이름만으로 쿼리를 만들어줌
  - `List<User> findByAgeGreaterThan(int n);` -> age > n인 유저들

### 예시:

```java
public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByName(String name);
}
```

이 메서드를 호출하면 JPA는 이런 SQL을 자동으로 만든다:

```sql
SELECT * FROM user WHERE name = ?;
```

---

### 1. 다양한 조건 연산자

- 사용 가능한 키워드들:

| 키워드                                       | 의미        | 예시                               | SQL                         |
| -------------------------------------------- | ----------- | ---------------------------------- | --------------------------- |
| `And`                                        | AND 조건    | `findByNameAndAge`                 | `WHERE name=? AND age=?`    |
| `Or`                                         | OR 조건     | `findByNameOrEmail`                | `WHERE name=? OR email=?`   |
| `Between`                                    | 사이 값     | `findByAgeBetween(int a, int b)`   | `WHERE age BETWEEN ? AND ?` |
| `LessThan` / `GreaterThan`                   | 부등호      | `findByAgeGreaterThan(20)`         | `WHERE age > 20`            |
| `IsNull` / `IsNotNull`                       | 널 여부     | `findByEmailIsNull()`              | `WHERE email IS NULL`       |
| `In`                                         | 여러 값     | `findByNameIn(List<String> names)` | `WHERE name IN (?, ?, ...)` |
| `Like`                                       | 부분일치    | `findByNameLike("%woo%")`          | `WHERE name LIKE ?`         |
| `StartingWith` / `EndingWith` / `Containing` | 문자열 검색 | `findByNameStartingWith("s")`      | `WHERE name LIKE 's%'`      |

---

### 2. 정렬과 페이징도 가능!

```java
List<User> findByAgeGreaterThanOrderByNameAsc(int age);
```

- SQL: `SELECT * FROM user WHERE age > ? ORDER BY name ASC`

```java
Page<User> findByNameContaining(String name, Pageable pageable);
```

- 페이징 처리까지 자동으로 해줌!

---

### 3. 존재 여부만 알고 싶다면?

```java
boolean existsByEmail(String email);
```

- SQL: `SELECT COUNT(*) FROM user WHERE email = ?`
- 결과: 해당 이메일이 존재하면 `true`, 없으면 `false`

---

### 4. 리턴 타입도 다양하게 지원한다.

| 리턴 타입        | 설명                                 |
| ---------------- | ------------------------------------ |
| `User`           | 단일 객체 (없으면 `null`)            |
| `Optional<User>` | 단일 객체 (안전하게 Optional로 감쌈) |
| `List<User>`     | 여러 개                              |
| `Page<User>`     | 페이징 결과                          |
| `boolean`        | 존재 여부 확인                       |

---

### 5. 규칙을 안 지키면 어떻게 될까?

```java
findByWhatIsThis() // ← 엔티티에 없는 필드명이면 컴파일은 되지만 실행 시 에러
```

- `No property whatIsThis found for type User!` 같은 예외 발생

---

## 🧠 개발자 관점 팁

- 메서드 이름이 너무 길어지면 **`@Query`를 써서 직접 JPQL 작성**하는 게 낫다.
- **자동 생성 쿼리 → 빠르게 CRUD 만들 때 유용**
- **복잡한 조건** → `@Query` 또는 `QueryDSL`, `Specification` 권장

---
