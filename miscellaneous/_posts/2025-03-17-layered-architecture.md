---
layout: post
title: Layered Architecture & MVC pattern
description: >
  레이어드 아키텍쳐와 MVC 패턴에 대해 알아보자.
sitemap: false
---

# [Etc] 🤖 Layered Architecture & MVC pattern

- [레이어드 아키텍쳐(Layered Architecture)란?](#레이어드-아키텍쳐layered-architecture란)
- [MVC란?](#mvc란)
- [레이어드 아키텍쳐와 MVC를 함께 사용](#레이어드-아키텍쳐와-mvc를-함께-사용)

---

## 레이어드 아키텍쳐(Layered Architecture)란?

- 여러 수평 레이어가 수직적으로 쌓인 구조 (상위 레이어에서 하위 레이어로 단방향 의존성)
  - 프레젠테이션 레이어 : 1층로비, 방문객 맞이하고 안내
  - 비즈니스 레이어 : 실제 회사 업무 설계 및 규칙 수립
  - 서비스 레이어 : 비즈니스 레이어의 명령 실행
  - 데이터 접근 레이어 : 필요한 정보 저장 및 검색
  - 각 층은 자신의 역할만 수행, 보통 아래층에만 의존
- 데이터 흐름
  - 요청 → 컨트롤러 → 서비스 → 레포지토리
- 사용 이유
  - **모듈화:** 각 레이어가 독립적이라 변경 사항이 영향을 최소화
  - **유지보수성:** 비즈니스 로직(Service)과 DB 접근(Repository)을 분리
  - **테스트 용이:** 단위 테스트 작성이 쉬움 (ex: Service 레이어만 Mock 테스트 가능)

## MVC란?

- Model-View-Controller
  - Model : 요리사가 실제 음식을 준비하고 만드는 작업
  - View : 음식의 플레이팅
  - Controller : 고객의 주문을 받고, 요리사에게 전달하여 완성된 요리를 테이블에 서빙 (백엔드)
  - 3개의 요소가 유기적으로 협력
- 사용자 인터페이스와 비즈니스 로직 분리
- 데이터 흐름
  - 요청 → 컨트롤러 → 모델 → 뷰
- 사용 이유
  - **역할 분리:** View, Model, Controller가 독립적으로 동작하여 유지보수 용이
  - **유연한 확장:** UI 변경(View)이나 비즈니스 로직(Model)을 따로 수정 가능
  - **재사용성 증가:** 같은 Model을 여러 View에서 사용 가능

<img src="https://github.com/nan0silver/nan0silver.github.io/blob/main/assets/img/blog/2025-03-17-image.png?raw=true" alt="Layered Architecture & MVC pattern" >

## 레이어드 아키텍쳐와 MVC를 함께 사용

- **둘을 함께 사용하면 유지보수성과 확장성이 좋아진다.**
  - **Controller는 최대한 가볍게 (Thin Controller, Fat Service)**
  - **비즈니스 로직은 Service Layer에서 처리 (SRP 원칙 준수)**

### 둘을 함께 사용했을 때 관계 흐름 (요청 → 응답)

1. 사용자 (Client) 가 요청을 보냄
2. Controller (입력 처리, 요청 매핑)
3. Service (비즈니스 로직 처리)
4. Repository (데이터베이스 접근)
5. Service → Controller 로 응답 반환
6. Controller → View (또는 JSON)

- MVC는 역할을 분리하고, 레이어드 아키텍처는 각 계층을 더 체계적으로 조직화하여 유지보수성과 확장성을 높인다
