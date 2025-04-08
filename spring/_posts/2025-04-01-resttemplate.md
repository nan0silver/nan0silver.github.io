---
layout: post
title: HttpURLConnection, RestTemplate, WebClient
description: >
  Java 환경에서 사용되는 HTTP 클라이언트인 `HttpURLConnection`, `RestTemplate`, `WebClient`를 비교해보자.
sitemap: false
---

# [Spring] `HttpURLConnection`, `RestTemplate`, `WebClient`

- [한눈에 보는 비교표](#-먼저-한눈에-보는-비교표)
- [1. HttpURLConnection](#-1-httpurlconnection--java-기본-클래스)
- [2. RestTemplate](#-2-resttemplate--동기--블로킹-방식의-spring-http-클라이언트)
- [3. WebClient](#-3-webclient--비동기--논블로킹-방식의-최신-http-클라이언트)
- [현업 개발자들은 어떻게 생각할까?](#-현업-개발자들은-어떻게-생각할까)
- [간단 정리](#-간단-정리-)
- [선택 가이드](#-선택-가이드)

---

## Java 환경에서 사용되는 HTTP 클라이언트인 `HttpURLConnection`, `RestTemplate`, `WebClient` 비교

### 🧱 1. `HttpURLConnection` (자바 기본 제공)

### 🚗 2. `RestTemplate` (Spring 제공, 동기)

### 🛸 3. `WebClient` (Spring WebFlux 제공, 비동기 & 논블로킹)

---

## 📌 먼저, 한눈에 보는 비교표

| 항목      | `HttpURLConnection`        | `RestTemplate`                                      | `WebClient`                          |
| --------- | -------------------------- | --------------------------------------------------- | ------------------------------------ |
| 제공      | Java SE 표준               | Spring Web (3.x~)                                   | Spring WebFlux (5.x~)                |
| 방식      | 동기 + 블로킹              | 동기 + 블로킹                                       | **비동기 + 논블로킹**                |
| 쓰기 쉬움 | ❌ 불편하고 코드 길다      | ✅ 간결함                                           | ✅ (조금 복잡하지만 유연함)          |
| 권장도    | ❌ 현업에서 거의 안 씀     | ⚠️ Spring 5부터 비권장                              | ✅ 최신 표준                         |
| 성능      | 느림, 커넥션 재활용 어려움 | 괜찮음, 단순 요청에는 충분 (블로킹)                 | 고성능 (Netty 기반), MSA에서 더 좋음 |
| 활용      | Java 기본 네트워크 통신    | 간단한 API 호출                                     | MSA, API Gateway, 대규모 호출 등     |
| 미래 방향 | -                          | **Deprecated 예정** (Spring 6에서는 제거될 수 있음) | Spring이 권장하는 **표준 방식**      |

---

## ✅ 1. `HttpURLConnection` — Java 기본 클래스

```java
URL url = new URL("https://api.example.com/data");
HttpURLConnection conn = (HttpURLConnection) url.openConnection();
conn.setRequestMethod("GET");

BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
String inputLine;
StringBuilder content = new StringBuilder();

while ((inputLine = in.readLine()) != null) {
    content.append(inputLine);
}

in.close();
conn.disconnect();
```

### ❌ 단점

- 코드가 **너무 장황**하고 귀찮음
- 커넥션 풀도 없음 (직접 관리해야 함)
- 에러 핸들링이 불편함

### ✅ 장점

- **Spring 없이도 동작** (가벼운 프로젝트, 시험용 앱에 쓸 수 있음)

> 🚨 **실무에선 거의 안 씀. RestTemplate/WebClient로 대체.**

---

## ✅ 2. `RestTemplate` — 동기 & 블로킹 방식의 Spring HTTP 클라이언트

```java
RestTemplate restTemplate = new RestTemplate();
String response = restTemplate.getForObject("https://api.example.com/data", String.class);
```

→ 응답이 올 때까지 **기다림**. 동기 처리.

### ✅ 장점

- 코드가 아주 **간단함**
- Spring 기반이라 다양한 옵션 (converter, interceptor 등) 연동 쉬움

### ⚠️ 단점

- **동기 + 블로킹**이라, 요청 수가 많으면 쓰레드 고갈 위험
- Spring 5 이후로 **점점 사용 비권장됨**
  > 📢 Spring 공식 문서: _"RestTemplate은 더 이상 발전하지 않으며, WebClient 사용을 권장함."_

## 🔧 주요 메서드들

| 메서드            | 설명                                        |
| ----------------- | ------------------------------------------- |
| `getForObject()`  | GET 요청 후, 결과를 객체로 받음             |
| `getForEntity()`  | GET 요청 후, 전체 응답(ResponseEntity) 받음 |
| `postForObject()` | POST 요청 후, 결과를 객체로 받음            |
| `postForEntity()` | POST 요청 후, 전체 응답 받음                |
| `put()`           | PUT 요청 (응답 없음)                        |
| `delete()`        | DELETE 요청                                 |

<img src="https://github.com/nan0silver/nan0silver.github.io/blob/main/assets/img/blog/2025-04-01-spring-resttemplate.png?raw=true">

---

## ✅ 3. `WebClient` — 비동기 & 논블로킹 방식의 최신 HTTP 클라이언트

```java
WebClient webClient = WebClient.create();
webClient.get()
    .uri("https://api.example.com/data")
    .retrieve()
    .bodyToMono(String.class)
    .subscribe(result -> System.out.println("결과: " + result));

System.out.println("여긴 먼저 실행됨!");  // 비동기니까 이게 먼저 출력될 수도 있음
```

### ✅ 장점

- **논블로킹 + 비동기** 처리
- 대규모 트래픽 처리에 유리
- 기능 확장도 쉬움 (OAuth2, Retry, Timeout 등)

### ❗ 단점

- 처음 배울 땐 리액티브 스트림(Mono/Flux)이 좀 낯설 수 있음

> 🌐 **현업에서는 WebClient가 기본**이 되고 있어! 특히 MSA(마이크로서비스) 환경에서는 거의 필수!

---

## 🔍 현업 개발자들은 어떻게 생각할까?

- "`HttpURLConnection`은 진짜로 아무것도 없을 때 테스트용으로만 씀"
- "`RestTemplate`은 작고 단순한 서비스에서는 아직도 많이 씀"
- "`WebClient`는 대규모 시스템이나 MSA, API Gateway에서 표준처럼 쓰이고 있음"

---

## 🧑‍💻 간단 정리 :

> “HttpURLConnection은 Java에서 기본 제공하는 HTTP 클라이언트지만, 코드가 장황하고 관리가 어렵기 때문에 Spring에서는 RestTemplate이나 WebClient를 사용합니다. RestTemplate은 동기 방식으로 간단한 API 호출에는 적합하지만, Spring 5부터는 WebClient처럼 비동기 + 논블로킹 방식을 사용하는 것이 대세입니다.”

---

## 🎁 선택 가이드

| 사용 상황                          | 추천 방식                                 |
| ---------------------------------- | ----------------------------------------- |
| 가볍게 테스트용 API 호출           | `RestTemplate` or `WebClient.block()`     |
| 복잡한 서비스 간 통신, 고성능 서버 | `WebClient`                               |
| Java만 사용하는 초간단 도구 개발   | `HttpURLConnection` (단, 실무에는 비권장) |
| Spring 5 이상 + 새로운 프로젝트    | WebClient를 사용하는 게 **미래지향적**    |

---
