---
layout: post
title: Spring VS Servlet
description: >
  Spring과 Servlet의 차이 대해 알아보자.
sitemap: false
---

# [Spring] Spring VS Servlet

- [Servlet과 Spring의 차이](#-servlet과-spring의-차이-쉽게-이해하기)
- [Servlet](#servlet-직접-요청을-처리하는-원시적인-방식)
- [Spring](#spring-웹-개발을-쉽게-만들어주는-프레임워크)
- [Servlet vs Spring 비교 정리 표](#servlet-vs-spring-비교-정리)
- [결론](#-결론-spring이-servlet보다-훨씬-편리하다)

---

## 🌐 **Servlet과 Spring의 차이: 쉽게 이해하기**

- Servlet과 Spring은 **Java로 웹 애플리케이션을 개발할 때 사용하는 기술**
- 하지만 **Servlet은 아주 기본적인 웹 기술**이고, **Spring은 이를 확장한 강력한 프레임워크**

---

### 🍽️ **비유: 레스토랑 운영 방식으로 이해하기**

> **Servlet** = "직접 주문받고 요리하고 서빙하는 작은 식당"  
> **Spring** = "자동 주문 시스템과 직원이 있는 대형 레스토랑"

---

## Servlet: 직접 요청을 처리하는 원시적인 방식

- Servlet은 **웹 요청을 처리하는 가장 기본적인 방법**
- 개발자가 **요청을 받고, 응답을 만들고, HTML을 직접 작성해야 함**.

- **Servlet의 특징**

  - ✅ 웹 요청을 직접 받아서 응답을 생성함.
  - ✅ 하지만 HTML 응답을 직접 만들어야 해서 코드가 길어짐.
  - ✅ 데이터베이스 연결, 보안 등 추가 기능을 직접 구현해야 함.

- **Servlet 예제 (Java 코드로 HTML 만들기)**
- ```java
    @WebServlet("/hello")
    public class HelloServlet extends HttpServlet {
        protected void doGet(HttpServletRequest request, HttpServletResponse response)
                throws ServletException, IOException {
            response.setContentType("text/html");
            PrintWriter out = response.getWriter();
            out.println("<html><body>");
            out.println("<h1>Hello, Servlet!</h1>");
            out.println("</body></html>");
        }
    }
  ```
- **문제점**:
  - HTML을 직접 만들고 응답을 구성해야 해서 코드가 길고 불편함
  - 데이터베이스 연결이나 보안 기능을 추가하려면 개발자가 직접 구현해야 함.

---

## Spring: 웹 개발을 쉽게 만들어주는 프레임워크

- Spring은 **Servlet을 더 쉽게 사용할 수 있도록** 만든 프레임워크
- 기본적인 요청 처리는 Servlet과 비슷하지만, Spring을 사용하면 **자동화된 기능이 많아서 개발이 편리**.

- **Spring의 특징**

  - ✅ 요청을 쉽게 처리할 수 있도록 `@Controller`와 `@RestController` 제공.
  - ✅ HTML을 직접 만들지 않고, JSON이나 템플릿을 사용해서 응답을 쉽게 생성할 수 있음.
  - ✅ 데이터베이스 연결, 보안 기능, API 호출 등을 자동으로 지원함.

- **Spring 예제 (더 간단한 코드)**
- ````java
      @RestController
      public class HelloController {
          @GetMapping("/hello")
          public String sayHello() {
              return "Hello, Spring!";
          }
      }
      ```
  🚀 **Spring을 사용하면 Servlet보다 훨씬 간결하고 직관적이다.**
  ````

---

## **Servlet vs Spring 비교 정리**

| 항목              | Servlet                        | Spring                                            |
| ----------------- | ------------------------------ | ------------------------------------------------- |
| 요청 처리 방식    | 직접 요청을 받고 응답을 작성   | `@Controller`와 `@RestController`로 간단하게 처리 |
| 코드 복잡도       | HTML을 직접 만들어야 해서 복잡 | JSON이나 템플릿 사용 가능 (코드가 간결)           |
| 데이터베이스 연결 | 직접 구현해야 함               | JPA, MyBatis 등의 지원                            |
| 보안 및 인증      | 직접 구현해야 함               | Spring Security 제공                              |
| 개발 속도         | 설정이 많고 코드가 길다        | 자동 설정 덕분에 개발이 빠름                      |

---

## 🚀 **결론: Spring이 Servlet보다 훨씬 편리하다!**

Servlet은 기본적인 웹 요청 처리를 할 수 있지만, 직접 HTML을 만들고 보안, 데이터베이스 연결 등을 다 처리해야 함.  
Spring은 이런 것들을 **자동화**해주기 때문에 개발이 훨씬 쉬워지고, 유지보수도 편하다.
