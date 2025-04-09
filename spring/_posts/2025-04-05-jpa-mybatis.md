---
layout: post
collection: spring
title: JPA vs MyBatis
description: >
  JPA vs MyBatis에 대 알아보자.
sitemap: false
---

# [Spring] JPA vs MyBatis

- [JPA란?](#-jpa란-java-persistence-api)
- [MyBatis란?](#-mybatis란)
- [🔍 JPA vs MyBatis](#-jpa-vs-mybatis)
- [JPA vs MyBatis 비유로 이해하기](#jpa-vs-mybatis-비유로-이해하기)
- [JPA vs MyBatis 코드로 비교하기](#-jpa-vs-mybatis-코드로-비교하기)
- [사용 방식 차이 요약](#-사용-방식-차이-요약)
- [장단점 비교](#-장단점-비교)
- [실무에 쓰는 방법](#-실무에-쓰는-방법)
- [한줄 정리](#-한줄-정리)

---

## 📌 JPA란? (Java Persistence API)

- **자바에서 관계형 데이터베이스(RDB)를 객체로 다룰 수 있게 해주는 표준 API**.
- SQL을 직접 작성하지 않아도 객체처럼 DB 데이터를 저장/조회/수정/삭제 가능.
- 구현체 중 가장 유명한 것은 **Hibernate**고, Spring에서 주로 이걸 씀.

---

## JPA 핵심 용어

| 용어                                       | 설명                                                                         |
| ------------------------------------------ | ---------------------------------------------------------------------------- |
| **Entity**                                 | DB 테이블과 매핑되는 자바 클래스                                             |
| **EntityManager**                          | JPA의 핵심! DB와 객체 사이의 작업을 처리하는 도구                            |
| **Persistence Context (영속성 컨텍스트)**  | 엔티티를 관리하는 JPA 내부 메모리 공간                                       |
| **JPQL (Java Persistence Query Language)** | 객체 지향 쿼리 언어. SQL과 유사하지만, 테이블이 아닌 클래스/필드 단위로 작동 |

---

## 📌 MyBatis란?

- **자바에서 SQL을 직접 작성해서 데이터베이스와 통신할 수 있게 해주는 프레임워크.**
- SQL 중심의 프로그래밍이 가능하고, **복잡하고 세밀한 쿼리 제어**에 유리함.
- XML 또는 어노테이션 기반으로 SQL을 작성하고, **쿼리 결과를 자바 객체와 매핑**해줌.
- **Spring과도 쉽게 통합 가능**하며, 실무에서는 여전히 널리 사용됨.

---

## MyBatis 핵심 용어

| 용어                  | 설명                                                                     |
| --------------------- | ------------------------------------------------------------------------ |
| **Mapper 인터페이스** | SQL 문장을 호출하는 자바 인터페이스. XML과 1:1 매칭되어 동작함           |
| **Mapper XML**        | 실제 SQL이 작성되는 파일. `<select>`, `<insert>` 등 태그로 구성됨        |
| **SqlSession**        | DB 연결과 SQL 실행을 담당하는 핵심 객체 (JDBC의 Connection 역할)         |
| **ResultMap**         | 쿼리 결과를 자바 객체에 **정밀하게 매핑**할 때 사용하는 설정             |
| **#{} / ${}**         | SQL 파라미터 바인딩 방식. `#{}`는 안전한 바인딩, `${}`는 SQL 인젝션 주의 |
| **TypeAlias**         | 자바 클래스의 이름을 짧게 별칭으로 사용할 수 있도록 하는 기능            |

---

## 🔍 JPA vs MyBatis

| 항목      | JPA                       | MyBatis                       |
| --------- | ------------------------- | ----------------------------- |
| 개발 방식 | **자동 매핑** (객체 중심) | **수동 매핑** (SQL 중심)      |
| 핵심 개념 | 객체를 DB에 자동 매핑     | 직접 SQL 작성 + 매핑          |
| 학습 곡선 | 좀 더 높음 (추상화 많음)  | 비교적 쉬움 (SQL 그대로 작성) |
| 유연성    | 추상화 많아 덜 유연함     | SQL 작성 자유로움             |
| 성능 제어 | ORM에 맡김 (튜닝 어려움)  | 직접 SQL 작성으로 제어 쉬움   |
| 대표 도구 | Hibernate (JPA 구현체)    | MyBatis 프레임워크            |

---

## JPA vs MyBatis 비유로 이해하기

### ☝️ JPA = 자동세탁기 👕

- **세탁기 안에 옷(객체)**을 넣으면  
  → 알아서 물(쿼리) 넣고, 빨고, 말리고  
  → 깨끗한 결과(조회된 객체)를 자동으로 꺼내줌!

> → 개발자는 **“옷만 넣고 결과만 받으면 됨”**  
> → 단, 세탁 방식은 기계가 알아서 함 (튜닝 어려움)

---

### ✌️ MyBatis = 손빨래 🧼

- **개발자가 직접** 물 붓고, 비비고, 헹구고
- 어떤 SQL 쿼리를 쓰고, 어떤 칼럼을 어떤 필드에 넣을지도 **직접 지정**

> → 개발자는 **“컨트롤을 많이 할 수 있음”**  
> → 다만 **귀찮고 실수할 가능성 있음**

---

## 🧩 JPA vs MyBatis 코드로 비교하기

### ✅ JPA 예제 (Hibernate 기반)

```java
@Entity
public class Member {
    @Id
    @GeneratedValue
    private Long id;

    private String name;
}
```

```java
// 저장
Member m = new Member("Sungwoo");
entityManager.persist(m);

// 조회
Member result = entityManager.find(Member.class, m.getId());
```

👉 SQL 없이 객체만 조작하면 됨!  
→ `INSERT`, `SELECT`, `UPDATE`, `DELETE`를 **자동으로 처리**

---

### ✅ MyBatis 예제

```xml
<!-- mapper.xml -->
<select id="findMemberById" parameterType="long" resultType="Member">
  SELECT id, name FROM members WHERE id = #{id}
</select>
```

```java
// 자바 코드
Member m = memberMapper.findMemberById(1L);
```

👉 SQL을 내가 직접 작성함  
→ DB 구조가 복잡하거나 튜닝이 필요할 땐 **더 유리**

---

## ✅ 사용 방식 차이 요약

| 항목           | JPA                          | MyBatis                |
| -------------- | ---------------------------- | ---------------------- |
| SQL 작성       | ❌ 안 함 (자동)              | ✅ 직접 함             |
| 객체 ↔ DB 매핑 | 자동 처리                    | 명시적 지정            |
| 코드 양        | 적음                         | 많음                   |
| 유지보수       | 테이블 구조 바뀌면 자동 적용 | SQL 전부 수정해야 함   |
| 복잡한 쿼리    | 어려움 (JPQL, QueryDSL)      | 자유롭고 세밀하게 가능 |

---

## ✅ 장단점 비교

### 🟢 JPA의 장점

- 생산성 높음 (코드 적게 작성)
- 객체 지향적으로 설계 가능
- 유지보수 편함 (쿼리 덜 바꿈)
- 캐싱, 지연 로딩, 영속성 컨텍스트 등 부가기능 풍부

---

### 🔴 JPA의 단점

- 처음 배울 때 어렵고 추상화가 깊음
- 성능 튜닝 어려움
- 복잡한 쿼리 작성이 불편함 (`JOIN`, `GROUP BY` 등)

---

### 🟢 MyBatis의 장점

- SQL을 자유롭게 짤 수 있어 → DB 성능 튜닝 유리
- 복잡한 쿼리나 데이터 조작에 강함
- 개발자 컨트롤이 높음

---

### 🔴 MyBatis의 단점

- 반복 코드 많음 (SQL + 매핑 따로)
- 유지보수 힘듦 (테이블 구조 바뀌면 SQL 전부 바꿔야 함)
- 객체 지향 구조 만들기 어렵고, 연결이 느슨함

---

## ✅ 실무에 쓰는 방법

| 상황                      | 실무 선택                                     |
| ------------------------- | --------------------------------------------- |
| 단순한 CRUD 위주의 서비스 | JPA (빠르고 코드 간결)                        |
| 복잡한 SQL 다루는 시스템  | MyBatis                                       |
| 대기업/공공 시스템        | 아직도 MyBatis 많음                           |
| 스타트업/신규 프로젝트    | JPA + QueryDSL 조합 인기                      |
| 둘 다 필요                | 일부는 JPA, 일부는 MyBatis 혼용 (실제로 많음) |

---

## 📌 한줄 정리

> “JPA는 객체 중심의 ORM 프레임워크로, DB와의 데이터 처리를 추상화해 코드 생산성을 높여줍니다. 반면 MyBatis는 SQL 중심의 프레임워크로, 복잡한 쿼리나 성능 튜닝이 필요한 경우에 유리합니다. 프로젝트 성격에 따라 두 기술을 선택하거나 병행할 수 있습니다.”

---
