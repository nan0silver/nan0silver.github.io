---
layout: post
title: flutter 01 - start flutter 
description: >
  Flutter와 Dart언어에 대한 기본 정보를 설명합니다.
sitemap: false
---

# Start Flutter

## What is Flutter?

- 크로스 플랫폼 앱 개발 프레임 워크
- Dart 언어 사용
    - 구글에서 만듬
    - 컴파일 언어의 특징을 활용하여 앱 개발 가능
- 프레임워크, 엔진, 임베더 계층으로 구성
    - 프레임워크
        - Dart로 개발된 여러 클래스로 앱 개발
    - 엔진
        - 플러터의 코어
        - C, C++
        - 데이터 통신, 다트 컴파일, 렌더링, 시스템 이벤트
    - 임베더
        - 플러터 앱이 크로스 플랫폼에서 동작하도록 플러터 엔진이 렌더링한 결과를 플랫폼별 네이티브 언어로 뷰를 만들어 화면에 보여줌
            - 네이티브 언어
                - 안드로이드 : 자바, 코틀린
                - IOS : 오브젝티브-C, 스위프트 
- 플러터의 장점
    - 높은 개발 효율
        - hot reload
            - 코드 변경 이후 빌드시간에 의한 낭비되는 시간을 없애기 위해 업데이트된 소스파일들이 dart virtual machine에 주입되면 flutter는 변경된 사안을 기반으로 widge tree를 재구성
            -> 변경된 것이 빠르게 결과물에 적용됨
    - 유연한 사용자 인터페이스
        - 다양한 위젯 제공
        - 강력한 애니메이션 기능 제공
    - 빠른 속도


## Dart

- 비동기 처리 방식
    - 작업이 끝나기를 기다리지 않고 다음 작업을 처리하게 하는 것
    - 작동 방식
        - async
            - 함수를 비동기로 만듬
        - await
            - 비동기 함수 안에서 언제 끝날지 모르는 작업 앞에 붙임
            - 해당 작업의 결과를 받기 위해 비동기 함수이름 앞에 Future 붙임
        - 예시 코드
        <pre><code>
        Future checkVersion() async {
            var version = await lookUpVersion();
            print(version);
        }</pre></code>
- 하나의 thread로 동작


## Flutter Project

- lib 폴더
    - 플러터 앱 개발을 위한 다트 파일
- pubspec.yaml
    - 플러터의 다양한 패키지, 이미지, 폰트 사용할수 있게 해줌
        