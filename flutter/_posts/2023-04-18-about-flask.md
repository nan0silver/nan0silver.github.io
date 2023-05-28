---
layout: post
title: flutter 02 - flutter UI
description: >
  Flutte 개발 전 알아야 된 UI관련 설명과 생명주기에 관한 내용을 담고 있다.
sitemap: false
---

# Flask

- 웹 애플리케이션 개발을 위한 파이썬 프레임워크
- 가장 유명한 Django(장고)보다 가볍고 필요한 기능만 최대한 라이트한 개발을 할 수 있다.


# Flask 서버와 Flutter 통신

- Dio
  - A powerful Http client for Dart
  - http처럼 서버와 통신하기 위해 필요한 패키지
  - 많은 기능을 가지고 있고, 여러가지 커스텀을 쉽게 할 수 있다.
  - pubspec.yaml에 dependency를 추가해주어야 한다.
  - Http와 json형식의 데이터로 받아올 때 차이점
    - <strong>Http로 요청 후 리턴받은 데이터를 decode해준 값이 Dio로 요청 후 리턴받은 데이터와 동일하다.</strong>
    - <url>https://kyungsnim.net/175</url>에서 참고

- Future
  - 지금은 없지만 미래에 요청한 데이터 혹은 에러가 담길 그릇
  - 싱글스레드 환경에서 비동기 처리를 위함
    - 비동기 : 어떤 동작이 완료되지 않아도 다음 동작을 수행하는 것
    - 동기 : 모든 동작이 완료된 후 다음 동작을 수행하는 것

- flask에서 json 형태로 response보내는 함수
  - jsonify
    - json response를 보내기 위해 이미 content-type header가 'application/json'로 되어 있는 flask.Response() 객체를 리턴
    -  jsonify도 함수 내부에서도 json form으로 serialize하는 과정에서 json.dumps를 사용
        - 다만 dump하기 전에 받은 값들을 모두 dictionary로 만들었다.
    - Parameter accept
      - dictionary
      - list
  - json.dumps
    - python이 가지고 있는 json library의 json.dumps() 
    - 수동으로 MIME type header를 추가해주어야 하는 encoded string을 리턴한다.
    - flask가 알아서 판단해 response를 자동으로 보내주도록 사용하기 때문에 직접적으로 사용할 수 있다. 다만 reponse header fields는 디폴트(text/html; charset=utf-80)로 처리된다.
    - Parameter accept
      - jsonify보다 더 많은 타입
