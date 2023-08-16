---
layout: post
title: flutter 05 - Difference Between URI and URL
description: >
  URI와 URL에 관한 차이
sitemap: false
---

# [Flutter] URI과 URL의 차이


- flutter앱을 개발하는 도중, http통신관련 코드를 짜면서 Uri.parse()함수를 여러 번 접하게 되었다.
- 주소 관련 변수명을 url로 쓰고 있어 이 둘의 의미가 혼동되어 정확하게 알아보고자 하였다.

<참고> https://www.elancer.co.kr/blog/view?seq=74

## URI (Uniform Resource Identifier)

- 우리 말로 '통합 자원 식별자'
  - Uniform   -> 리소스를 식별는 통일된 방식
  - Resource  -> URI로 식별이 가능한 웹 브라우저 파일 및 그 이외의 리소스를 포함하는 모든 종류의 자원
  - Identifier  -> 다른 항목과 구분하기 위해 필요한 정보
- <strong> 즉, URI는 인터넷상의 리소스 자원 자체를 식별하는 고유한 문자열 시퀀스</strong>



## URL (Uniform Resource Locator)

- 네트워크상에서 통합 자원(리소스)의 <strong>“위치”</strong>를 나타내기 위한 규약
- 웹 사이트 주소 + 컴퓨터 네트워크 상의 자원
  - 특정 웹 페이지의 주소에 접속하기 위해서는 웹 사이트의 주소뿐만 아니라 프로토콜(https, http, sftp, smp 등)을 함께 알아야 접속이 가능한데, URL은 이들 모두를 나타낸다.

## URN (Uniform Resource Name)

- 리소스의 위치, 프로토콜, 호스트 등과는 상관없이 각 자원에 이름을 부여한 것
- 웹 문서의 물리적인 위치와 상관없이 웹 문서 자체를 나타낸다.


## URI와 URL의 차이점

-  URI= 식별자, URL=식별자+위치
  - nan0silver.github.io는 리소스의 이름만 나타내므로 URI
  - https://nan0silver.github.io/는 이름과 위치를 나타내므로 URL (프로토콜 http를 포함하기 때문)

- URL ⊂ URI
- URL은 프로토콜과 결합된 상태이다. (프로토콜 + 이름)
- URI는 그 자체로 이름이 될 수 있다.