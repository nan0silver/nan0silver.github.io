---
layout: post
collection: til
description: >
  Capacitor Android 앱에서 HTTPS만 사용하도록 usesCleartextTraffic을 false로 설정할 때, 카카오 SDK와의 Manifest merger 충돌을 tools:replace로 해결하는 방법과, CORS와의 관계를 정리했습니다.
categories: ["til"]
tags: ["TIL", "Android", "Capacitor", "보안", "HTTPS", "Manifest"]
date: 2026-03-05 00:00:00
last_modified_at: 2026-03-05 00:00:00
sitemap: false
---

# [TIL] Android(Capacitor) HTTPS 전용 설정 · Manifest merger · usesCleartextTraffic과 CORS

> 📝 **TIL (Today I Learned)**  
> Capacitor로 빌드한 Android 앱에서 **HTTPS만 사용하도록** 보안 설정을 바꾸다가, 카카오 SDK와 Manifest merger 충돌이 났고, `tools:replace`로 해결했다.  
> 이 과정에서 **usesCleartextTraffic이 무엇인지**, **CORS와는 어떻게 다른지**까지 정리해 본다.

- [1. 배경: 하고 싶었던 일](#-1-배경-하고-싶었던-일)
- [2. usesCleartextTraffic이란?](#-2-usescleartexttraffic이란)
- [3. 실제로 한 설정 변경](#-3-실제로-한-설정-변경)
- [4. Manifest merger 충돌 (카카오 SDK)](#-4-manifest-merger-충돌-카카오-sdk)
- [5. tools:replace로 해결](#-5-toolsreplace로-해결)
- [6. 혼동하기 쉬운 점 (CORS)](#-6-혼동하기-쉬운-점-cors)
- [7. 배포 시 주의사항 · 정리](#-7-배포-시-주의사항--정리)

---

## 🎯 1. 배경: 하고 싶었던 일

- **Capacitor**로 웹 앱을 감싼 Android 앱을 쓰고 있음.
- 백엔드/API는 모두 **HTTPS**(예: `chingoohaja.app`)만 사용함.
- 그래서 앱에서 **HTTP(암호화되지 않은 통신)는 허용하지 않고, HTTPS만 쓰도록** 하고 싶었다.
- Android에서는 이걸 **`usesCleartextTraffic`** 과 **Network Security Config** 로 제어한다.

---

## 📌 2. usesCleartextTraffic이란?

**Cleartext** = 암호화되지 않은 평문 통신. 즉 **HTTP**를 의미한다.

| 값 | 의미 |
|:---|:---|
| `true` | 앱이 **HTTP** 주소로도 요청 가능 (개발/테스트용으로 자주 켜 둠) |
| `false` | **HTTPS만** 허용, HTTP 요청은 **차단** |

즉, **“앱이 HTTP를 쓸 수 있게 할지 여부”**만 정하는 설정이다.  
API가 전부 HTTPS라면 보안을 위해 `false`로 두는 것이 맞다.

---

## 🔧 3. 실제로 한 설정 변경

### 3.1 AndroidManifest.xml

- `android:usesCleartextTraffic="true"` → **`false`** 로 변경  
- (이미 있다면) `android:networkSecurityConfig="@xml/network_security_config"` 유지

### 3.2 network_security_config.xml

- **base-config** 의 `cleartextTrafficPermitted="true"` → **`false`**
- API가 모두 HTTPS(`chingoohaja.app` 등)이므로, cleartext를 허용하던 **domain-config** 블록은 제거

이렇게 하면 앱 전체에서 HTTP는 막히고, HTTPS만 허용된다.

---

## ⚠️ 4. Manifest merger 충돌 (카카오 SDK)

위처럼 바꾼 뒤 **Android Studio에서 빌드**하면 아래와 같은 에러가 날 수 있다.

```text
Manifest merger failed : Attribute application@usesCleartextTraffic value=(false) from AndroidManifest.xml:4:9-45
is also present at [com.kakao.sdk:v2-friend:2.20.1] AndroidManifest.xml:10:18-53 value=(true).
Suggestion: add 'tools:replace="android:usesCleartextTraffic"' to <application> element at AndroidManifest.xml:3:5-74:19 to override.
```

**원인**

- 우리 앱: `usesCleartextTraffic="false"`
- 카카오 SDK(`com.kakao.sdk:v2-friend`): 자체 Manifest에서 `usesCleartextTraffic="true"` 선언
- **Manifest merger**가 여러 Manifest를 합칠 때, 같은 속성에 서로 다른 값이 있으면 충돌로 처리한다.

그래서 “예전처럼 cleartext를 다시 켜야 하나?”라고 생각할 수 있지만, **되돌릴 필요는 없다.**  
대신 **우리 앱의 값(false)을 우선시키면** 된다.

---

## ✅ 5. tools:replace로 해결

에러 메시지에서 제안한 대로, **`<application>` 태그에 `tools:replace="android:usesCleartextTraffic"`** 를 추가하면 된다.

**의미**

- 머지 시 **카카오 SDK의 `true`** 대신 **우리 앱의 `false`** 가 적용된다.
- `xmlns:tools` 는 보통 manifest 최상단에 이미 있으므로, 별도 선언 없이 `tools:replace`만 추가하면 된다.

**변경 예시 (AndroidManifest.xml)**

```xml
<application
    android:usesCleartextTraffic="false"
    tools:replace="android:usesCleartextTraffic"
    android:networkSecurityConfig="@xml/network_security_config"
    ...>
```

이렇게 하면 빌드는 통과하고, 앱은 계속 **HTTPS만** 사용하게 된다.  
카카오 로그인 등도 실제로 HTTPS를 쓰고 있다면 동작에는 문제 없다.

---

## 🔗 6. 혼동하기 쉬운 점 (CORS)

**“이 설정 바꾸면 CORS 나오지 않나?”** 하고 헷갈릴 수 있는데, **CORS와는 별개**다.  
usesCleartextTraffic은 “앱이 HTTP를 허용할지”만 정하고, CORS는 “어떤 출처를 서버가 허용할지”를 서버가 정한다.  
그래서 이 값을 false로 둔다고 CORS가 생기거나 사라지지 않으며, CORS는 백엔드 허용 origin/헤더 설정으로만 처리하면 된다.

---

## 📋 7. 배포 시 주의사항 · 정리

- **usesCleartextTraffic="false"**  
  - HTTP 차단, HTTPS만 허용 → 보안상 유리.  
  - API가 전부 HTTPS면 배포 후에도 그대로 두면 된다.
- **Manifest merger 충돌**  
  - 서드파티 SDK가 `usesCleartextTraffic="true"` 를 들고 오면,  
    **되돌리지 말고** `tools:replace="android:usesCleartextTraffic"` 로 **우리 값(false)** 을 우선 적용하는 것이 좋다.
- **CORS**는 서버 쪽 허용 설정의 영역이라, 이 Android 설정과는 무관하다.

정리하면, **되돌릴 필요 없이** `false` + `tools:replace` 로 두고 배포해도 되고,  
API와 카카오가 HTTPS만 사용한다면 그대로 두는 것이 맞다.
