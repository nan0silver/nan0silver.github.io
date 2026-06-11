---
redirect_from:
  - /infra/2026-06-10-nginx-reverse-proxy/
layout: post
title: 리버스 프록시와 Nginx — 왜 많이 쓸까?
description: >
  리버스 프록시의 개념, 포워드 프록시와의 차이, Nginx를 많이 사용하는 이유, Spring Boot 연동 예시를 정리했다.
sitemap: false
date: 2026-06-10
---

# [Infra] 리버스 프록시와 Nginx — 왜 많이 쓸까?

백엔드를 EC2에 배포할 때 Nginx를 앞단에 두고 Spring Boot로 요청을 넘기는 구성을 자주 본다.  
클라이언트는 `https://api.example.com`에만 접속하고, 실제 애플리케이션은 `127.0.0.1:8080`에서 돌아간다.  
이때 Nginx가 하는 일이 바로 **리버스 프록시(Reverse Proxy)**다.

이 글에서는 리버스 프록시가 무엇인지, 왜 쓰는지, 그리고 Nginx가 널리 선택되는 이유를 정리한다.

---

## 목차

1. [프록시란?](#1-프록시란)
2. [포워드 프록시 vs 리버스 프록시](#2-포워드-프록시-vs-리버스-프록시)
3. [리버스 프록시를 쓰는 이유](#3-리버스-프록시를-쓰는-이유)
4. [Nginx란?](#4-nginx란)
5. [Nginx가 많이 쓰이는 이유](#5-nginx가-많이-쓰이는-이유)
6. [실전 예시: Spring Boot + Nginx](#6-실전-예시-spring-boot--nginx)
7. [주의할 점](#7-주의할-점)
8. [정리](#8-정리)

---

## 1. 프록시란?

**프록시(Proxy)**는 "대리인"이라는 뜻 그대로, 클라이언트와 서버 사이에서 요청·응답을 **대신 전달**하는 중간 서버다.

프록시 없이 통신하면 클라이언트가 서버에 직접 붙는다.

```plaintext
[Client] ──────────────> [Server]
```

프록시가 있으면 클라이언트는 프록시와 통신하고, 프록시가 실제 목적지와 통신한다.

```plaintext
[Client] ──> [Proxy] ──> [Server]
```

프록시는 단순 중계가 아니다. 요청 헤더를 바꾸거나, 특정 경로만 허용하거나, HTTPS를 처리하는 등 **중간에서 할 수 있는 일**이 많다.

---

## 2. 포워드 프록시 vs 리버스 프록시

프록시는 **누구를 대신하느냐**에 따라 두 종류로 나뉜다.

### 포워드 프록시 (Forward Proxy)

클라이언트 **앞**에 서서, 클라이언트를 대신해 외부로 요청을 보낸다.

```plaintext
[Client] ──> [Forward Proxy] ──> [Internet / External Server]
```

대표적인 예:

- 회사 내부망에서 외부 인터넷 접속을 통제하는 프록시
- VPN, Tor처럼 출발지를 숨기는 프록시

클라이언트가 프록시를 **알고 설정**하는 경우가 많다. "내 요청을 이 프록시로 보내줘"라고 지정하는 구조다.

### 리버스 프록시 (Reverse Proxy)

서버 **앞**에 서서, 서버를 대신해 클라이언트 요청을 받는다.

```plaintext
[Client] ──> [Reverse Proxy] ──> [Backend Server(s)]
```

클라이언트 입장에서는 리버스 프록시가 **곧 서버**처럼 보인다.  
내부에 Spring, Node, Django 같은 앱 서버가 몇 대 있는지는 클라이언트가 알 필요가 없다.

| 구분 | 포워드 프록시 | 리버스 프록시 |
|------|--------------|--------------|
| 위치 | 클라이언트 쪽 | 서버 쪽 |
| 대신하는 대상 | 클라이언트 | 백엔드 서버 |
| 누가 알고 쓰나 | 주로 클라이언트가 설정 | 클라이언트는 보통 모름 |
| 대표 용도 | 접근 제어, 익명화 | 로드 밸런싱, SSL 종단, 보안 |

웹 서비스 배포에서 말하는 "리버스 프록시"는 대부분 **리버스 프록시**를 가리킨다.

---

## 3. 리버스 프록시를 쓰는 이유

### 3.1 백엔드 서버를 직접 노출하지 않음

애플리케이션 서버(Spring Boot, Node 등)를 인터넷에 바로 열면, 포트·프레임워크 정보가 그대로 드러난다.  
리버스 프록시만 80/443 포트로 공개하고, 앱은 `localhost:8080`처럼 내부에서만 듣게 하면 **공격 표면을 줄일** 수 있다.

### 3.2 SSL/TLS 종단 (SSL Termination)

HTTPS 인증서를 앱 서버마다 붙이기보다, Nginx 한 곳에서 처리하는 패턴이 흔하다.

```plaintext
[Client] --HTTPS--> [Nginx] --HTTP--> [Spring Boot :8080]
```

Let's Encrypt + Certbot으로 Nginx에 인증서를 붙이고, 내부 통신은 HTTP로 단순화할 수 있다.  
인증서 갱신도 Nginx만 관리하면 된다.

### 3.3 로드 밸런싱

서버가 여러 대일 때, 리버스 프록시가 요청을 나눠 준다.

```nginx
upstream backend {
    server 127.0.0.1:8080;
    server 127.0.0.1:8081;
}

server {
    location / {
        proxy_pass http://backend;
    }
}
```

트래픽이 한 서버에 몰리지 않게 하고, 한 대가 죽어도 다른 서버로 우회할 수 있다.

### 3.4 정적 파일과 동적 API 분리

React 빌드 결과물(HTML, JS, CSS)은 Nginx가 직접 서빙하고, `/api`만 백엔드로 넘기는 구성도 많다.

- 정적 파일: Nginx가 빠르게 응답
- API: Spring Boot 등 앱 서버가 처리

WAS 부하를 줄이고 응답 속도를 개선할 수 있다.

### 3.5 경로 기반 라우팅

하나의 도메인 아래에서 경로별로 다른 서비스로 보낼 수 있다.

```plaintext
https://example.com/       → 프론트엔드 (정적 파일)
https://example.com/api/   → 백엔드 API
https://example.com/admin/ → 관리자 서버
```

마이크로서비스나 멀티 앱 구성에서 특히 유용하다.

---

## 4. Nginx란?

**Nginx**(엔진엑스, "engine x"로 읽는다)는 러시아 개발자 Igor Sysoev가 2004년에 만든 **고성능 웹 서버**다.

처음에는 C10K 문제(동시 연결 1만 개 처리)를 해결하기 위한 웹 서버로 알려졌다.  
지금은 단순 정적 파일 서버를 넘어, 리버스 프록시·로드 밸런서·캐시·API Gateway 역할까지 맡는 **인프라의 기본 도구**가 됐다.

Nginx의 대표 기능:

| 역할 | 설명 |
|------|------|
| 웹 서버 | HTML, CSS, JS 등 정적 파일 제공 |
| 리버스 프록시 | 요청을 내부 앱 서버로 전달 |
| 로드 밸런서 | 여러 백엔드에 트래픽 분산 |
| SSL 종단 | HTTPS 인증서 처리 |
| 캐시 | 응답 캐싱으로 부하 감소 |

---

## 5. Nginx가 많이 쓰이는 이유

### 5.1 높은 동시 연결 처리 성능

Nginx는 **이벤트 기반 비동기 아키텍처**를 쓴다.  
요청마다 스레드를 새로 만드는 방식보다, 적은 리소스로 많은 연결을 유지하기 좋다.

정적 파일 서빙이나 리버스 프록시처럼 **I/O 대기가 많은 작업**에서 강점이 있다.

### 5.2 한 도구로 여러 역할

앞서 본 것처럼 웹 서버 + 리버스 프록시 + 로드 밸런서 + SSL을 **하나의 설정 파일**로 묶을 수 있다.  
소규모 서비스에서는 별도 로드 밸런서 없이 Nginx만으로 운영이 가능하다.

### 5.3 설정이 비교적 단순하고 문서·사례가 많음

`server`, `location`, `proxy_pass` 정도만 익혀도 기본 리버스 프록시를 구성할 수 있다.  
Stack Overflow, 공식 문서, 블로그 예제가 풍부해서 문제가 생겨도 해결 자료를 찾기 쉽다.

### 5.4 오픈소스이고 배포 환경 호환성이 좋음

무료이며 Ubuntu, Amazon Linux, Docker 등 어디서나 동일하게 쓸 수 있다.  
Certbot과의 연동도 잘 되어 있어 Let's Encrypt 기반 HTTPS 구성이 표준처럼 자리 잡았다.

### 5.5 검증된 안정성

Netflix, Dropbox, GitHub 등 대규모 서비스에서도 Nginx(또는 Nginx 기반 구성)를 사용한다.  
"작은 프로젝트에서 시작해, 커져도 당장 갈아탈 필요가 없다"는 점이 실무에서 큰 장점이다.

### 5.6 대안과 비교했을 때

| 도구 | 특징 |
|------|------|
| **Nginx** | 가볍고 빠름, 리버스 프록시·정적 서빙에 최적, 설정 직관적 |
| **Apache** | 모듈 생태계 풍부, `.htaccess` 등 유연하지만 동시 연결에서 Nginx보다 무거운 편 |
| **Caddy** | HTTPS 자동 설정이 편리, 설정이 더 단순하지만 레퍼런스·사례는 Nginx보다 적음 |
| **AWS ALB** | 관리형 로드 밸런서, AWS 생태계와 잘 맞지만 비용·벤더 종속 |

1인 개발이나 EC2 단일 서버 배포에서는 **설정 부담 대비 기능**이 좋은 Nginx가 자연스러운 선택인 경우가 많다.

---

## 6. 실전 예시: Spring Boot + Nginx

실제 배포에서 흔한 구조는 다음과 같다.

```plaintext
[Browser]
    │ HTTPS (443)
    ▼
[Nginx on EC2]  ← SSL 인증서 (Certbot)
    │ HTTP (127.0.0.1:8080)
    ▼
[Spring Boot]
```

### 6.1 Nginx 리버스 프록시 설정

```nginx
# /etc/nginx/sites-available/backend
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

각 헤더의 의미:

| 헤더 | 역할 |
|------|------|
| `Host` | 원래 요청한 호스트명을 백엔드에 전달 |
| `X-Real-IP` | 클라이언트 IP (Nginx가 직접 연결된 주소 기준) |
| `X-Forwarded-For` | 프록시를 거친 클라이언트 IP 체인 |
| `X-Forwarded-Proto` | 클라이언트가 쓴 프로토콜 (`http` / `https`) |

Spring Boot는 프록시 뒤에 있으면 `remoteAddr`이 `127.0.0.1`로 보이기 때문에,  
실제 클라이언트 IP나 HTTPS 여부를 알려면 위 헤더가 필요하다.

### 6.2 HTTPS 적용

Certbot으로 인증서를 발급하면 Nginx 설정에 SSL 블록이 추가된다.

```bash
sudo certbot --nginx -d api.your-domain.com
```

이후 구조는 다음과 같이 바뀐다.

```plaintext
[Browser] --HTTPS--> [Nginx] --HTTP--> [Spring Boot :8080]
```

프론트엔드(Vercel 등)는 `https://api.your-domain.com`으로 API를 호출하고,  
백엔드는 Nginx 뒤에서 안전하게 동작한다.

---

## 7. 주의할 점

### X-Forwarded-For는 무조건 믿으면 안 됨

`X-Forwarded-For`는 클라이언트가 임의로 넣을 수 있다.  
**신뢰할 수 있는 프록시(Nginx)에서 추가한 값만** 사용해야 한다.

즉, 직접 연결된 `remoteAddr`이 Nginx일 때만 `X-Forwarded-For`의 첫 번째 IP를 클라이언트 IP로 쓰는 식으로 검증이 필요하다.

### proxy_pass URL 끝의 슬래시

```nginx
proxy_pass http://127.0.0.1:8080;   # /api/users → 백엔드 /api/users
proxy_pass http://127.0.0.1:8080/;  # /api/users → 백엔드 /users (경로가 잘림)
```

끝에 `/`가 있으면 `location` 경로가 잘려서 전달된다. 의도한 라우팅인지 확인해야 한다.

### 설정 변경 후 문법 검사

```bash
sudo nginx -t
sudo systemctl reload nginx
```

`reload`는 무중단으로 설정을 반영한다. `restart`보다 운영 중에 안전하다.

---

## 8. 정리

| 개념 | 한 줄 요약 |
|------|-----------|
| **리버스 프록시** | 클라이언트 요청을 받아 내부 서버로 넘기는 서버 앞단 대리인 |
| **Nginx** | 정적 서빙·리버스 프록시·로드 밸런싱·SSL을 한 번에 처리하는 웹 서버 |
| **왜 쓰나** | 보안, HTTPS, 부하 분산, 정적/동적 분리, 단일 진입점 |
| **왜 Nginx인가** | 성능, 단순한 설정, 풍부한 사례, Certbot 연동, 검증된 안정성 |

리버스 프록시는 "요청을 대신 받아 준다"는 개념이고, Nginx는 그 역할을 가장 흔하게 맡는 도구다.  
Spring Boot를 EC2에 올릴 때 Nginx를 앞에 두는 것은 단순한 습관이 아니라, **운영·보안·확장**을 위한 실용적인 선택이다.

---

**관련 글**

- [[TIL] Nginx, 리버스 프록시, 로드 밸런서](/til/2025-05-24-til/)
- [친구하자 프로젝트 일기 — Nginx + Certbot HTTPS 배포](/projectdiary/2025-10-13-diary/)

**참고**

- [Nginx 공식 문서 — HTTP Load Balancing](https://nginx.org/en/docs/http/load_balancing.html)
- [Nginx 공식 문서 — NGINX Reverse Proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)
