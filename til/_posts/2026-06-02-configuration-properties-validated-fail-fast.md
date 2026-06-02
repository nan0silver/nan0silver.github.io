---
layout: post
collection: til
description: >
  @ConfigurationProperties와 @Validated로 설정값을 앱 시작 시 검증하는 방법,
  ${ENV_VAR}와 ${ENV_VAR:default}의 차이, 운영 환경에서 fail-fast로 배포 실패를 앞당기는 이유를 정리한 글이다.
categories: ["til"]
tags:
  [
    "TIL",
    "Spring Boot",
    "ConfigurationProperties",
    "Validation",
    "fail-fast",
    "운영",
  ]
date: 2026-06-02 00:00:00
last_modified_at: 2026-06-02 00:00:00
sitemap: false
---

# [TIL] @ConfigurationProperties + @Validated — 설정값 검증과 fail-fast

> 운영 환경변수가 빠져 있어도 앱이 뜨고, 첫 요청에서야 터지는 상황은 디버깅 비용이 크다. `@ConfigurationProperties`에 `@Validated`를 붙이고 `@NotBlank`로 필수값을 선언하면, 배포 직후 시작 단계에서 바로 실패(fail-fast)시킬 수 있다.

- [들어가며](#들어가며)
- [1. 런타임 실패 vs 시작 시 실패](#1-런타임-실패-vs-시작-시-실패)
- [2. @ConfigurationProperties로 설정을 타입 안전하게 묶기](#2-configurationproperties로-설정을-타입-안전하게-묶기)
- [3. @Validated로 시작 시점 검증 붙이기](#3-validated로-시작-시점-검증-붙이기)
- [4. ${ENV_VAR} vs ${ENV_VAR:default}](#4-env_var-vs-env_vardefault)
- [5. fail-fast가 운영에서 중요한 이유](#5-fail-fast가-운영에서-중요한-이유)
- [6. 환경별 설정 분리 패턴](#6-환경별-설정-분리-패턴)
- [7. 흔한 실수와 점검 포인트](#7-흔한-실수와-점검-포인트)
- [8. 운영 적용 체크리스트](#8-운영-적용-체크리스트)
- [마무리](#마무리)

---

## 들어가며

Spring Boot 앱을 운영에 올릴 때, 환경변수 누락은 흔한 실수다.

예를 들어 내부 API 키, DB URL, 외부 서비스 토큰 같은 값이 비어 있으면 서비스가 정상 동작하지 않는다. 그런데 설정을 느슨하게 두면 이런 일이 벌어진다.

- 앱은 **정상 기동**한다.
- 첫 트래픽이 들어온 뒤 **401/500**이 터진다.
- 온콜이 "배포는 됐는데 왜 안 되지?"부터 조사한다.

이 문제를 줄이는 핵심은 하나다.

- **필수 설정은 앱 시작 시점에 검증하고, 없으면 즉시 실패시킨다.**

---

## 1. 런타임 실패 vs 시작 시 실패

| 시점                | 증상                         | 대응 비용                     |
| ------------------- | ---------------------------- | ----------------------------- |
| 시작 시 (fail-fast) | 배포/기동 단계에서 바로 실패 | 원인 좁히기 쉬움, 롤백 빠름   |
| 런타임              | 트래픽 유입 후 간헐적 장애   | 로그 추적·재현·사용자 영향 큼 |

운영에서는 "나중에 알아차리기"보다 "처음부터 못 뜨게 하기"가 훨씬 낫다. Kubernetes나 CI/CD 파이프라인도 기동 실패를 빠르게 감지할 수 있어서, 장애 반경을 배포 직후로 제한할 수 있다.

---

## 2. @ConfigurationProperties로 설정을 타입 안전하게 묶기

문자열을 여기저기 `@Value`로 흩뿌리기보다, 설정 전용 클래스로 묶는 편이 낫다.

```java
@ConfigurationProperties(prefix = "app.security")
public class SecurityProperties {

    private String internalApiKey;
    private List<String> allowedIps = List.of();

    // getter, setter
}
```

```yaml
app:
  security:
    internal-api-key: ${INTERNAL_API_KEY}
    allowed-ips: ${ALLOWED_IPS:127.0.0.1}
```

장점:

- 설정 키가 한곳에 모여 읽기 쉽다.
- IDE 자동완성·타입 체크를 받을 수 있다.
- 검증 규칙도 같은 클래스에 붙일 수 있다.

`@EnableConfigurationProperties(SecurityProperties.class)` 또는 `@ConfigurationPropertiesScan`으로 빈으로 등록하면 된다.

---

## 3. @Validated로 시작 시점 검증 붙이기

`@ConfigurationProperties`만으로는 "값이 비어 있음"을 막지 못한다. 빈 문자열(`""`)도 그대로 바인딩될 수 있다.

그래서 클래스에 `@Validated`를 붙이고, 필드에 Bean Validation 어노테이션을 선언한다.

```java
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "app.security")
public class SecurityProperties {

    @NotBlank
    private String internalApiKey;

    @NotEmpty
    private List<String> allowedIps;

    // getter, setter
}
```

자주 쓰는 어노테이션:

| 어노테이션  | 의미                                       |
| ----------- | ------------------------------------------ |
| `@NotBlank` | `null`, 빈 문자열, 공백만 있는 문자열 불가 |
| `@NotEmpty` | `null`, 빈 컬렉션/배열/문자열 불가         |
| `@NotNull`  | `null` 불가 (빈 문자열은 허용)             |

`spring-boot-starter-validation` 의존성이 있어야 한다. Spring Boot 3.x에서는 보통 starter-web에 포함되어 있다.

검증이 실패하면 애플리케이션 컨텍스트 기동이 중단되고, 로그에 어떤 프로퍼티가 문제인지 힌트가 남는다.

```
Binding to target ... failed:
    Property: app.security.internal-api-key
    Value: ""
    Reason: must not be blank
```

이 메시지가 보이면 "환경변수 누락"이 아니라 "바인딩은 됐지만 검증 실패"인지, "애초에 값이 없어서 빈 문자열이 들어온 것"인지 바로 감이 온다.

---

## 4. ${ENV_VAR} vs ${ENV_VAR:default}

YAML에서 환경변수를 참조할 때, 기본값 유무에 따라 동작이 달라진다.

### `${ENV_VAR}` — 기본값 없음

```yaml
app:
  security:
    internal-api-key: ${INTERNAL_API_KEY}
```

- `INTERNAL_API_KEY`가 **없으면** Spring Boot가 기동 시 `Could not resolve placeholder 'INTERNAL_API_KEY'`로 실패한다.
- placeholder 해석 단계에서 바로 터지므로, 역시 fail-fast에 가깝다.

### `${ENV_VAR:default}` — 기본값 있음

```yaml
app:
  security:
    allowed-ips: ${ALLOWED_IPS:127.0.0.1}
```

- 환경변수가 없어도 `127.0.0.1`이 들어간다.
- 앱은 뜨지만, 운영에서 의도한 값이 아닐 수 있다.

### 어떻게 쓰는 게 맞을까

| 설정 성격                  | 권장 방식                  |
| -------------------------- | -------------------------- |
| 운영 필수 (API 키, DB URL) | `${ENV_VAR}` + `@NotBlank` |
| 개발 편의용 기본값         | `${ENV_VAR:local-default}` |
| 운영에서도 안전한 기본값   | 신중히. 정말 무방한 값만   |

운영 필수값에 `:default`를 붙이면, **환경변수 누락이 조용히 기본값으로 흡수**된다. 이게 가장 위험한 패턴이다. 앱은 뜨는데 보안 설정이 엉뚱한 값으로 동작할 수 있다.

---

## 5. fail-fast가 운영에서 중요한 이유

fail-fast는 "빨리 실패한다"는 뜻이지만, 실무에서는 "빨리 **원인을 좁힌다**"는 효과가 더 크다.

1. **배포 파이프라인에서 차단** — 기동 probe가 실패하면 새 버전이 트래픽을 받기 전에 롤백된다.
2. **장애 범위 축소** — 사용자 트래픽이 들어오기 전에 문제를 발견한다.
3. **원인 추적 단순화** — "설정 누락" vs "비즈니스 로직 버그"를 분리할 수 있다.

반대로 fail-slow(늦게 실패)는 이런 비용을 만든다.

- 헬스체크는 통과했는데 실제 API는 실패
- 로그에 원인이 흩어져 있음
- 온콜이 애플리케이션 코드부터 의심함

운영 보안 설정(내부 API 키, IP 허용 목록 등)은 특히 fail-fast 대상이다. 1편에서 다룬 Actuator 노출 제어와 마찬가지로, **잘못된 설정이 조용히 통과하는 것**이 가장 위험하다.

---

## 6. 환경별 설정 분리 패턴

개발과 운영의 요구는 다르다. 프로파일로 분리하는 것이 일반적이다.

```yaml
# application-dev.yml
app:
  security:
    internal-api-key: ${INTERNAL_API_KEY:dev-local-key}
    allowed-ips: 127.0.0.1,0:0:0:0:0:0:0:1
```

```yaml
# application-prod.yml
app:
  security:
    internal-api-key: ${INTERNAL_API_KEY}
    allowed-ips: ${ALLOWED_IPS}
```

운영 프로파일에서는:

- 필수값에 기본값을 두지 않는다.
- `@NotBlank` / `@NotEmpty`로 빈 값도 막는다.

개발 프로파일에서는:

- 로컬 기동 편의를 위해 기본값을 둘 수 있다.
- 다만 운영 프로파일 설정이 dev 기본값에 의존하지 않도록 파일을 분리한다.

`@Profile("prod")` 빈이 이 `SecurityProperties`를 주입받아 쓰는 구조라면, 설정 검증과 프로파일 분리가 함께 맞물려 동작한다.

---

## 7. 흔한 실수와 점검 포인트

### 실수 1: `@Validated`를 빼먹음

`@NotBlank`를 필드에 붙였는데 클래스에 `@Validated`가 없으면 검증이 실행되지 않는다.

### 실수 2: 운영 필수값에 `:default` 사용

환경변수 누락이 기본값으로 숨겨진다. 운영에서는 피한다.

### 실수 3: `@NotNull`만 쓰고 빈 문자열은 놓침

환경변수가 `INTERNAL_API_KEY=`처럼 빈 문자열로 들어오면 `@NotNull`은 통과한다. 문자열 필수값은 `@NotBlank`가 맞다.

### 실수 4: 검증 실패 메시지를 안 읽음

기동 실패 로그에 `Property: ... Reason: ...`가 찍힌다. "Bean 생성 실패"만 보고 코드를 의심하기 전에 설정부터 확인한다.

### 실수 5: 테스트 프로파일에서 prod 검증 규칙이 그대로 적용됨

`@ActiveProfiles("test")`를 쓰는 테스트에서는 prod 전용 `@ConfigurationProperties` 빈이 아예 생성되지 않을 수 있다. 테스트용 설정 파일(`application-test.yml`)을 따로 두는 편이 안전하다.

---

## 8. 운영 적용 체크리스트

- [ ] 운영 필수 설정을 `@ConfigurationProperties` 클래스로 묶었는가
- [ ] 클래스에 `@Validated`, 필드에 `@NotBlank` / `@NotEmpty`를 선언했는가
- [ ] 운영 프로파일에서 `${ENV_VAR:default}` 대신 `${ENV_VAR}`를 쓰는가
- [ ] `application-prod.yml`과 배포 매니페스트의 환경변수 목록이 일치하는가
- [ ] 배포 후 기동 실패 시 로그에서 어떤 프로퍼티가 문제인지 확인할 수 있는가

체크리스트를 배포 전 검증 단계에 넣으면, "앱은 떴는데 설정이 틀렸다"는 유형의 장애를 크게 줄일 수 있다.

---

## 마무리

`@ConfigurationProperties`는 설정을 구조화하는 도구이고, `@Validated`는 그 구조가 **운영 조건을 만족하는지** 시작 시점에 확인하는 안전장치다.

정리하면 아래 한 줄로 충분하다.

- 운영 필수 설정은 `${ENV_VAR}` + `@NotBlank`로 묶고, 없으면 앱이 뜨지 않게 만든다.

1편에서 Actuator 노출 범위를 줄였다면, 2편은 **잘못된 설정이 조용히 통과하지 못하게** 막는 단계다. 둘 다 "운영에서 나중에 터지는 문제"를 "배포 직후에 드러나는 문제"로 바꾸는 같은 방향의 작업이다.
