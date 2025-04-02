---
layout: post
title: RestTemplate
description: >
  Spring에서 다른 서버의 REST API와 통신할 수 있도록 도와주는 HTTP 클라이언트인 RestTemplate에 대해 알아보자.
sitemap: false
---

# [Spring] RestTemplate

- [RestTemplate이란?](#-resttemplate이란)
- [필요한 이유](#-필요한-이유)
- [예시 코드 (Get)](#️-예시-코드-get-요청)
- [주요 메서드들](#-주요-메서드들)
- [응답을 객체로 받기 (JSON → Java 객체)](#-응답을-객체로-받기-json--java-객체)
- [`RestTemplate` vs `WebClient` 핵심 비교](#-resttemplate-vs-webclient-핵심-비교)
- [코드로 비교](#-코드로-비교)
- [결론: 언제 뭘 쓰면 좋을까?](#-결론-언제-뭘-쓰면-좋을까)

---

## ✅ RestTemplate이란?

`RestTemplate`은 **Spring에서 다른 서버의 REST API와 통신할 수 있도록 도와주는 HTTP 클라이언트**.

즉, 서버끼리 통신할 때:

- 다른 서버에 요청을 보내고(`GET`, `POST`, `PUT`, `DELETE` 등),
- 그 응답을 받아서 처리할 수 있도록 도와주는 **도구**

---

## 🧠 필요한 이유

웹 애플리케이션을 만들다 보면,

- 다른 서버에 있는 데이터를 가져오거나 (예: Kakao Map API, 날씨 API)
- 다른 서버에 정보를 보내야 할 때

이때 `RestTemplate`이 **HTTP 요청/응답을 대신 처리**해주는 역할을 함.

---

## ⚙️ 예시 코드 (GET 요청)

```java
import org.springframework.web.client.RestTemplate;

public class Example {
    public static void main(String[] args) {
        RestTemplate restTemplate = new RestTemplate();

        String url = "https://api.agify.io/?name=seongwoo";  // 이름을 넣으면 예상 나이를 알려주는 무료 API
        String response = restTemplate.getForObject(url, String.class);

        System.out.println(response);
        // 출력 예: {"name":"seongwoo","age":27,"count":1123}
    }
}
```

여기서 `getForObject()`는 `GET` 요청을 보내고, 결과를 `String` 타입으로 받아오는 함수.

---

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

## 📦 응답을 객체로 받기 (JSON → Java 객체)

```java
public class AgifyResponse {
    private String name;
    private int age;
    private int count;

    // 꼭! Getter/Setter 만들어줘야 함 (Lombok 써도 됨)
}
```

```java
RestTemplate restTemplate = new RestTemplate();
String url = "https://api.agify.io/?name=seongwoo";

AgifyResponse response = restTemplate.getForObject(url, AgifyResponse.class);

System.out.println(response.getAge());  // 예: 27
```

→ JSON 데이터를 Java 객체로 자동으로 바꿔줌! (`Jackson` 같은 라이브러리를 내부에서 사용함)

---

## 💡 RestTemplate 특징 요약

- 동기 방식이다 (요청을 보내고 응답 올 때까지 기다림)
- 간단한 API 호출엔 유용하지만, **요즘은 WebClient 사용이 증가** (비동기 처리, reactive 프로그래밍에 적합)
- Spring 5 이후로는 `RestTemplate`은 **점점 deprecated 방향**이지만, 여전히 많이 사용됨

---

## 🆚 `RestTemplate` vs `WebClient` 핵심 비교

| 항목        | RestTemplate                                        | WebClient                                     |
| ----------- | --------------------------------------------------- | --------------------------------------------- |
| 방식        | **동기(Synchronous)**                               | **비동기(Asynchronous)** (동기도 가능)        |
| 등장 시기   | 오래됨 (Spring 3.x부터)                             | 최신 (Spring 5, WebFlux부터 등장)             |
| 쓰레드 처리 | 요청 → 응답 올 때까지 **쓰레드 점유**               | 응답 기다리는 동안 **쓰레드 반환**, 더 효율적 |
| 성능        | 단순 요청에는 충분                                  | 고성능 시스템, MSA에서 더 좋음                |
| 사용성      | 코드가 간단하고 직관적                              | 비동기라 처음엔 약간 복잡할 수 있음           |
| 미래 방향   | **Deprecated 예정** (Spring 6에서는 제거될 수 있음) | Spring이 권장하는 **표준 방식**               |

---

## 🔧 코드로 비교

### 1️⃣ RestTemplate 예시 (동기)

```java
RestTemplate restTemplate = new RestTemplate();
String url = "https://api.agify.io/?name=seongwoo";

String result = restTemplate.getForObject(url, String.class);
System.out.println(result);
```

→ 응답이 올 때까지 **기다림**. 동기 처리.

---

### 2️⃣ WebClient 예시 (비동기 + 동기화 처리 가능)

```java
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

WebClient webClient = WebClient.create();
String url = "https://api.agify.io/?name=seongwoo";

// 비동기 방식 → block()을 붙이면 동기처럼 동작
String result = webClient.get()
        .uri(url)
        .retrieve()
        .bodyToMono(String.class)
        .block();  // 이게 바로 응답 받을 때까지 기다리는 코드 (동기화)

System.out.println(result);
```

→ WebClient는 원래 비동기지만, `.block()`을 붙이면 동기처럼 사용할 수도 있음.

---

## 💬 비동기 방식으로 진짜 쓰고 싶다면?

```java
webClient.get()
    .uri(url)
    .retrieve()
    .bodyToMono(String.class)
    .subscribe(result -> {
        System.out.println("결과: " + result);
    });

System.out.println("여긴 먼저 실행됨!");  // 비동기니까 이게 먼저 출력될 수도 있음
```

---

## ✅ 결론: 언제 뭘 쓰면 좋을까?

| 상황                                                 | 추천                                   |
| ---------------------------------------------------- | -------------------------------------- |
| 간단한 테스트, 외부 API 한두 번 호출할 때            | RestTemplate (빠르게 개발 가능)        |
| 마이크로서비스 간 통신, 대용량 처리, reactive 시스템 | WebClient (성능과 확장성 좋음)         |
| Spring 5 이상 + 새로운 프로젝트                      | WebClient를 사용하는 게 **미래지향적** |
