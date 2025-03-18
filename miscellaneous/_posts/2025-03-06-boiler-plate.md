---
layout: post
title: Boiler Plate
description: >
  반복적으로 사용되는 기본 코드 템플릿인 Boilerplate에 대해 알아보자.
sitemap: false
---

# [Etc] 🎞️ Boilerplate

- [Access Token과 Refresh Token이란?](#1-access-token과-refresh-token이란)

---

## Boilerplate란?

- 소프트웨어 개발에서 반복적으로 사용되는 사용되는 <strong>기본 코드 템플릿</strong>
- 🔥 즉, "매번 새로 작성해야하는 기본 코드세트"를 보일러플레이트라고 함
- 의미
  - 원래는 인쇄 산업에서 반복적으로 사용되는 금속판을 의미
  - 이후 소프트웨어 개발에서도 "반복적으로 작성해야하는 코드 덩어리"를 의미하게 되었다.

## 보일러플레이트의 특징

1. 반복적인 코드

- 프로젝트를 시작할 때 매번 작성해야하는 코드들이 포함됨
- 예를 들어, 웹 애플리케이션을 만들 때 기본적인 프로젝트 구조, 설정 파일, 인증 로직 등이 해당

2. 템플릿 역할

- 코드 재사용성을 높이고, 개발 시간을 줄여줌
- 예를 들어, React, Express, Spring Boot같은 프레임워크에서는 보일러플레이트 코드가 포함된 템플릿이 제공됨

3. 프레임워크 및 라이브러리에서 자주 사용됨

- React : `create-react-app`이 기본적인 프로젝트 구조와 설정을 자동으로 생성
- Express : `express-generator`를 사용하면 기본적인 Express 프로젝트 생성
- Spring Boot : `Spring Initializr`를 사용사면 기본적인 설정이 포함된 프로젝트 생성

## 예제 코드

- Spring Boot 보일러플레이트

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MyApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }
}
```
