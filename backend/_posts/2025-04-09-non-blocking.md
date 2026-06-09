---
redirect_from:
  - /spring/2025-04-09-non-blocking/
  - /spring-flask/2025-04-09-non-blocking/
layout: post
title: 논블로킹 vs 비동기
description: >
  논블로킹과 비동기에 대해 알아보자.
sitemap: false
---

# [Spring] 논블로킹(Non-blocking) vs 비동기 (Asynchronous)

- [논블로킹이란?](#-논블로킹non-blocking이란)
- [실생활 비유로 논블로킹 이해하기](#-실생활-비유로-논블로킹-이해하기)
- [블로킹 vs 논블로킹 기술적 요점 정리](#-블로킹-vs-논블로킹-기술적-요점-정리)
- [논블로킹이 중요한 이유](#-논블로킹이-중요한-이유)
- [어디서 논블로킹이 쓰이냐?](#️-어디서-논블로킹이-쓰이냐)
- [논블로킹(Non-blocking) 비동기(Asynchronous) 비교](#논블로킹non-blocking이랑-비동기asynchronous-비교)
- [CompletableFuture, WebClient 코드 예시](#completablefuture-webclient-코드-예시)

---

## ✅ 논블로킹(Non-blocking)이란?

### 먼저, 블로킹(Blocking)이 뭔지부터 알아보자

- **블로킹 방식**은 어떤 작업이 끝날 때까지 프로그램이 **멈춰서 기다리는 것**
- 웹 서버라면, DB 응답이나 외부 API 요청이 끝날 때까지 **쓰레드가 잡혀서 못 움직임.**

```java
// 블로킹 방식 (예: RestTemplate)
String result = restTemplate.getForObject("http://api.example.com", String.class);
// → 이 줄에서 응답이 올 때까지 멈춤
System.out.println("응답 받음!");
```

---

### 🚀 논블로킹 방식은?

- **기다리지 않는다.** 요청을 보내고, 바로 다음 작업을 처리한다.
- 응답이 나중에 오면, 그때 콜백(또는 리액티브 스트림)을 통해 처리

```java
// 논블로킹 방식 (예: WebClient)
webClient.get()
    .uri("http://api.example.com")
    .retrieve()
    .bodyToMono(String.class)
    .subscribe(result -> {
        System.out.println("응답 받음! → " + result);
    });

System.out.println("바로 다음 코드 실행됨!");
```

👆 여기서 중요한 건:

- `subscribe()` 안에 있는 코드만 나중에 실행되고
- 서버 쓰레드는 그동안 다른 요청을 처리할 수 있다는 것

---

## 🍜 실생활 비유로 논블로킹 이해하기

### ✅ 블로킹 방식: 짜장면집 주방장 1명

> 손님이 주문 → 짜장면 끓이는 동안 주방장이 다음 주문을 못 받음  
> 5명 동시에 오면? 4명은 그냥 기다림 (쓰레드 낭비, 느림)

### ✅ 논블로킹 방식: 주방장 + 자동면로봇

> 손님이 주문 → 기계에 넣고 대기표 발급 → 주방장은 다른 주문 처리  
> → 주문 100개가 와도 효율적으로 동시에 처리 가능! (고성능, 확장성)

---

## 🧠 블로킹 vs 논블로킹 기술적 요점 정리

| 항목        | 블로킹 방식               | 논블로킹 방식                              |
| ----------- | ------------------------- | ------------------------------------------ |
| 처리 방식   | 요청 → 대기 → 응답        | 요청 → 바로 다음 처리 → 응답 오면 콜백     |
| 쓰레드 사용 | **요청 1건당 쓰레드 1개** | **요청 수백건도 쓰레드 몇 개**로 처리 가능 |
| 성능        | 낮은 동시성 처리          | 높은 동시성, 고성능                        |
| 코드        | 간단하고 직관적           | 콜백이나 리액티브 스트림 필요              |
| 예시        | RestTemplate, JDBC        | WebClient, R2DBC, Netty 등                 |

---

## 💡 논블로킹이 중요한 이유

### ✔️ 1. 고성능 서버 만들기

- 수천~수만 명이 동시에 요청을 보내도 효율적으로 처리 가능

### ✔️ 2. 외부 API 많이 쓰는 서비스에서 유리

- 다른 서비스의 응답을 기다리는 동안, 서버 리소스를 낭비하지 않음

### ✔️ 3. MSA (마이크로서비스 아키텍처)에서 필수

- 서로 요청 주고받는 일이 많기 때문에 **논블로킹 API가 매우 효율적**

---

## 🛠️ 어디서 논블로킹이 쓰이냐?

| 기술             | 논블로킹 여부 | 비고                                   |
| ---------------- | ------------- | -------------------------------------- |
| `WebClient`      | ✅            | REST API 호출                          |
| `Reactor Netty`  | ✅            | 웹서버 / 클라이언트 엔진               |
| `R2DBC`          | ✅            | 논블로킹 DB 클라이언트 (JDBC는 블로킹) |
| `Spring WebFlux` | ✅            | 전체 논블로킹 웹 프레임워크            |

---

## "논블로킹(Non-blocking)"이랑 "비동기(Asynchronous)" 비교

> ❌ **같은 말 아님**.  
> ✅ **서로 관련 있지만, 개념적으로 다르다.**

### 🔍 핵심 차이 요약

| 항목   | 비동기 (Asynchronous)                                        | 논블로킹 (Non-blocking)               |
| ------ | ------------------------------------------------------------ | ------------------------------------- |
| 개념   | **작업을 요청하고 바로 다음 코드 실행** (응답 기다리지 않음) | **리소스(쓰레드 등)를 점유하지 않음** |
| 초점   | **시간(언제 실행될지 모름)**                                 | **리소스 사용 여부**                  |
| 예시   | 콜백, Future, Promise, Mono                                  | `read()` 호출 시 즉시 리턴            |
| 관련성 | 비동기 처리는 대부분 논블로킹 방식으로 구현됨                | 논블로킹이 항상 비동기인 건 아님      |

---

### 🎯 비유로 설명

#### 🍜 비동기란?

> "너 짜장면 하나, 그리고 바로 다음 손님 주세요~"

- 주문 받고 **즉시 다음 손님 주문을 받는** 방식
- 짜장면이 나올 때까지 **기다리지 않음**
- 나중에 "주문하신 짜장면 나왔습니다~" 하고 **알림이 옴 (콜백)**

✅ 즉, "작업이 완료될 때까지 기다리지 않고 **나중에 처리**"가 핵심

---

#### 🥡 논블로킹이란?

> "면 삶는 동안 **주방 공간을 계속 점유하지 않음**"

- 요리를 맡긴 뒤 주방 공간을 **즉시 다른 요리사에게 넘겨줌**
- 결과가 나올 때까지 그 **리소스를 점유하지 않음**

✅ 즉, **요청을 처리 중인 동안에도 시스템 리소스를 점유하지 않음**이 핵심

---

## 🧠 코드 예시 비교

### 🧱 블로킹 + 동기 (가장 기본)

```java
String result = restTemplate.getForObject(url, String.class);
// 이 줄에서 서버 응답이 올 때까지 기다림 (쓰레드 점유 O, 시간도 대기 O)
```

---

### 🧱 논블로킹 + 동기

```java
String result = socket.readNonBlocking();  // 지금 읽을 수 있는 데이터만 읽고 즉시 리턴
```

- 당장 읽을 게 없으면 빈 값만 주고 **쓰레드는 곧바로 다음 작업 가능**
- 하지만 **이 결과로 바로 처리함** → **동기적**

---

### 🧱 논블로킹 + 비동기 (진짜 고성능 시스템 핵심!)

```java
webClient.get()
    .uri("/data")
    .retrieve()
    .bodyToMono(String.class)
    .subscribe(data -> {
        System.out.println("데이터 도착: " + data);
});
```

- 요청 후 **바로 다음 코드 실행됨** (비동기)
- **쓰레드를 점유하지 않음** (논블로킹)
- 응답이 왔을 때만 콜백으로 실행됨

---

### 💡 정리하자면

| 구분              | 설명                                  | 예                                               |
| ----------------- | ------------------------------------- | ------------------------------------------------ |
| 비동기            | 요청 → 응답 기다리지 않고 다른 작업함 | 콜백, `subscribe`, `Future`, `CompletableFuture` |
| 논블로킹          | 시스템 리소스를 점유하지 않음         | WebClient, R2DBC, Netty                          |
| 블로킹            | 결과 나올 때까지 멈춤                 | RestTemplate, JDBC                               |
| 비동기 + 논블로킹 | 성능 최상 조합                        | WebFlux + Netty + R2DBC                          |

---

## CompletableFuture, WebClient 코드 예시

### ✅ 1. `CompletableFuture`로 비동기 (스레드는 점유함 = 논블로킹 아님)

```java
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

public class AsyncWithCompletableFuture {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        System.out.println("비동기 시작");

        CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
            // 시간이 오래 걸리는 작업 (예: API 호출 시뮬레이션)
            try {
                Thread.sleep(2000); // 2초 대기 (스레드 점유)
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            return "API 결과값";
        });

        // 다른 작업 수행
        System.out.println("다른 작업 수행 중...");

        // 결과 기다리기
        String result = future.get(); // 여기서 block됨
        System.out.println("결과: " + result);
    }
}
```

### 📌 포인트:

- `CompletableFuture`는 비동기처럼 보이지만 **실제로는 별도 스레드를 점유**함.
- `.get()`을 호출하면 **결과를 기다리는 동안 block**됨.

---

## 🛸 2. `WebClient`로 진짜 논블로킹 + 비동기

> 의존성 필요:
> [mvn repository](https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-webflux)

```xml
<!-- build.gradle 혹은 pom.xml -->
implementation 'org.springframework.boot:spring-boot-starter-webflux'
```

```java
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

public class AsyncWithWebClient {
    public static void main(String[] args) {
        WebClient client = WebClient.create();

        System.out.println("WebClient 비동기 호출 시작");

        Mono<String> response = client.get()
                .uri("https://jsonplaceholder.typicode.com/todos/1")
                .retrieve()
                .bodyToMono(String.class);

        response.subscribe(body -> System.out.println("응답 도착: " + body));

        System.out.println("다른 작업 수행 중...");

        // 실제로 메인 스레드가 먼저 종료될 수 있어서 약간 대기
        try { Thread.sleep(3000); } catch (InterruptedException e) {}
    }
}
```

### 📌 포인트:

- `WebClient`는 진짜 논블로킹 (스레드 점유 X)
- `.subscribe()`로 **콜백 기반 응답 처리**
- **메인 스레드는 응답 기다리지 않음**, 논블로킹 체험 가능

---

## ⚖️ 비교 요약

| 항목                    | `CompletableFuture`           | `WebClient` (WebFlux)             |
| ----------------------- | ----------------------------- | --------------------------------- |
| 스레드 점유             | O (다른 스레드가 일 함)       | X (논블로킹 방식)                 |
| 비동기 처리 방식        | Future 기반                   | 리액티브 스트림 (Mono/Flux)       |
| 논블로킹 체험 가능 여부 | 부분적으로 (Thread 풀에 의존) | O (진짜 논블로킹)                 |
| 사용 목적               | 간단한 비동기 로직            | 고성능, 동시성 높은 네트워크 호출 |

---
