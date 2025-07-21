---
layout: post
collection: miscellaneous
description: >
  2025-07-20 FastAPI vs Flask
categories: ["til"]
tags: ["TIL", "FastAPI", "Flask", "Backend"]
date: 2025-07-20 00:00:00
last_modified_at: 2025-07-23 16:30:00
sitemap: false
---

# [Etc] FastAPI vs Flask: Python 백엔드 프레임워크 비교

- [새롭게 배운 것](#-새롭게-배운-것)
- [오늘의 문제 상황 & 해결 과정](#-오늘의-문제-상황--해결-과정)
- [Pydantic이란?](#-pydantic이란)
- [Spring Boot DTO와 Pydantic의 비교](#-spring-boot-dto와-pydantic의-비교)
- [느낀 점](#-느낀-점)

---

## 🍀 새롭게 배운 것

- Python 백엔드 프레임워크인 **FastAPI**와 **Flask**를 비교해보았다.
- 두 프레임워크 모두 경량 웹 서버를 빠르게 개발할 수 있도록 도와주지만, 철학과 기능 면에서 차이가 존재한다.
- 주요 비교 항목: 비동기 처리, 타입 힌트 지원, 성능, 문서 자동화, 커뮤니티 및 생태계 등

| 항목              | **FastAPI**                                     | **Flask**                                   |
| ----------------- | ----------------------------------------------- | ------------------------------------------- |
| **출시 연도**     | 2018                                            | 2010                                        |
| **비동기 지원**   | `async/await` 기반 비동기 처리 완전 지원        | 기본은 동기, 비동기 처리는 별도 패키지 필요 |
| **타입 힌트**     | 필수적으로 사용하며, 자동 문서화 및 검증에 활용 | 선택적 사용, 검증은 외부 라이브러리 의존    |
| **문서 자동화**   | Swagger UI 및 Redoc 자동 생성                   | 기본 제공 없음 (Flasgger 등으로 보완)       |
| **성능**          | 매우 빠름 (Starlette 기반, Uvicorn 활용)        | 상대적으로 느림                             |
| **러닝 커브**     | 초기 진입 장벽이 다소 높음 (타입, Pydantic 등)  | 매우 쉬운 진입, 학습 곡선 완만              |
| **커뮤니티**      | 빠르게 성장 중                                  | 매우 크고 안정적인 생태계                   |
| **데이터 검증**   | Pydantic 기반의 자동 검증                       | 별도 유효성 검사 코드 필요                  |
| **REST API 개발** | RESTful 설계에 최적화                           | 자유도가 높음, 규칙이 느슨함                |

---

## 🍎 오늘의 문제 상황 & 해결 과정

- 지금까지는 Flask의 간결함과 진입 장벽이 낮은 점이 마음에 들어 주로 Flask를 사용해왔다.
- 하지만 이번에는 FastAPI를 직접 적용해보고 싶어 새 프로젝트에 도입해보았다.
- 특히 `Pydantic` 모델이 처음엔 어렵게 느껴질까 걱정했지만, 막상 사용해보니 **Spring Boot의 DTO와 매우 유사한 느낌**이 들어 빠르게 익숙해졌다.
- 타입 기반 구조와 자동 검증, 문서화 덕분에 프로젝트가 자연스럽게 구조화되고 개발 속도도 빨랐다.

---

## 📌 Pydantic이란?

- **Pydantic**은 FastAPI에서 입력/출력 데이터의 구조를 정의하고, 유효성을 검사하며, JSON 직렬화를 자동으로 처리하는 핵심 컴포넌트다.
- Python의 **타입 힌트(type hint)**를 기반으로 동작하며, `BaseModel`을 상속하여 필드와 제약 조건을 선언할 수 있다.

```python
from pydantic import BaseModel, Field

class User(BaseModel):
    name: str = Field(..., min_length=1)
    age: int
    email: str
```

- 위와 같이 작성하면, FastAPI는 요청 데이터가 이 조건을 만족하는지 자동으로 검증하고, Swagger 문서까지 자동 생성해준다.

---

## 🔍 Spring Boot DTO와 Pydantic의 비교

| 항목                 | Spring Boot DTO                     | FastAPI Pydantic Model                          |
| -------------------- | ----------------------------------- | ----------------------------------------------- |
| **역할**             | 요청/응답 객체 정의 + 유효성 검사   | 요청/응답 객체 정의 + 유효성 검사               |
| **유효성 검사 도구** | JSR 380 (e.g., `@NotNull`, `@Size`) | Pydantic (`Field`, `validator`)                 |
| **직렬화/역직렬화**  | Jackson 사용                        | 내장 기능으로 자동 처리                         |
| **중첩 구조 지원**   | 중첩 DTO 클래스                     | 중첩 `BaseModel`을 통한 자연스러운 처리         |
| **문서화 연동**      | Swagger/OpenAPI 설정 필요           | FastAPI에 자동 내장                             |
| **확장성**           | Bean Validation 위주                | 타입 변환, 커스텀 직렬화 등 더 다양한 기능 내장 |

> 결론적으로 **Pydantic은 Spring의 DTO와 유사한 사용 경험을 제공하면서도**, 그 이상의 기능(데이터 직렬화, 문서화, 타입 변환 등)을 하나의 모델에서 처리할 수 있다는 점에서 **DTO + Validator + Mapper + Serializer의 통합체**로 볼 수 있다.

---

## 🦄 느낀 점

- Flask는 여전히 빠른 개발과 간단한 구조를 원할 때 유용한 선택지다.
- 반면 FastAPI는 프로젝트 구조를 더 명확히 하고, 자동화된 유효성 검사 및 문서화 기능까지 갖추고 있어 **중·대형 규모 프로젝트나 협업 시에 훨씬 효율적**이라는 점을 느꼈다.
- 개인적으로는 Pydantic이 예상보다 익숙했고, Spring Boot의 DTO를 써본 경험이 FastAPI 적응에 큰 도움이 되었다.
- 앞으로는 프로젝트의 성격에 따라 Flask와 FastAPI를 유연하게 선택하며, 각 도구의 장점을 상황에 맞게 활용할 계획이다.
