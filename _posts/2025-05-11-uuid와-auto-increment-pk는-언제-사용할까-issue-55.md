---
layout: post
title: "UUID와 Auto Increment PK는 언제 사용할까?"
description: >
  UUID와 Auto Increment PK는 언제 사용할까?에 대한 TIL 기록
categories: ["miscellaneous"]
tags: ["TIL"]
date: 2025-05-11 00:00:00
last_modified_at: 2025-05-22 05:26:48
github_issue: 55
github_url: https://github.com/nan0silver/TIL/issues/55
sitemap: false
---

> 📝 **TIL (Today I Learned)**  
> 🔗 **원본 이슈**: [#55](https://github.com/nan0silver/TIL/issues/55)  
> 📅 **작성일**: 2025-05-11  
> 🔄 **최종 수정**: 2025년 05월 22일

---

## 🍀 새롭게 배운 것

- **UUID와 Auto Increment PK는 언제 사용할까?**

오늘은 엔티티의 기본 키(primary key)를 정의할 때 **UUID**와 **Auto Increment(Long 타입)** 중 어떤 것을 선택할지에 대해 정리해보았다.

### ✅ Auto Increment (일반적인 정수형 PK)

- 특징

  - `@GeneratedValue(strategy = GenerationType.IDENTITY)` 형태로 많이 사용
  - DB가 자동으로 증가시키며 관리
  - 숫자 기반이라 인덱싱 속도가 빠르고, 저장 공간도 적게 차지함

- 사용에 적합한 경우

  - 내부 시스템용 데이터
  - 데이터 유출 시에도 ID 자체로는 식별 불가 → 보안 문제가 크지 않은 경우
  - 검색/조회 성능이 중요한 경우

- 단점

  - 순차적으로 증가하는 ID는 보안상 예측 가능성이 있음 (특히 API 경로에 노출될 경우 위험)
  - 시스템 간 병합 시 충돌 가능성 있음 (ex. 여러 서버에서 동시에 데이터를 생성하는 분산 환경)

---

### ✅ UUID (범용 고유 식별자)

- 특징

  - `@GeneratedValue(strategy = GenerationType.AUTO)` 또는 `UUID.randomUUID()` 사용
  - 128비트의 랜덤 고유값 (예: `d290f1ee-6c54-4b01-90e6-d701748f0851`)
  - 전역적으로 충돌 가능성이 거의 없음 → **분산 시스템에 적합**

- 사용에 적합한 경우

  - 외부에 노출되는 식별자(API, 클라이언트 전송 등)
  - 데이터 생성 주체가 분산되어 있어 충돌을 방지해야 할 때
  - 보안상 ID 노출을 피하고 싶을 때

- 단점

  - 길이가 길고 가독성이 떨어짐
  - 저장 시 공간 낭비 (VARCHAR or BINARY 타입)
  - 인덱싱 성능이 낮음 → 대량 데이터일수록 성능 저하 가능

---

### 💡 결론: 어떤 상황에 어떤 걸 쓸까?

| 상황                                                     | 추천 방식                     |
| -------------------------------------------------------- | ----------------------------- |
| 단일 서버, 내부 관리 중심 서비스                         | Auto Increment                |
| 외부 노출 ID가 필요하거나, 분산 환경에서 생성되는 데이터 | UUID                          |
| 민감한 정보 식별자 (예: 사용자 ID, 주문 번호 등)         | UUID                          |
| 빠른 정렬/검색이 중요한 대량 데이터                      | Auto Increment (with caution) |

---

> 오늘의 교훈: "보안성과 확장성"이 중요한 시스템이라면 UUID,
> "성능과 단순함"이 중요하다면 Auto Increment를 고려하자.
> 다만 외부에 노출될 수 있는 ID는 무조건 UUID나 별도의 난수 토큰을 사용하는 것이 안전하다!
