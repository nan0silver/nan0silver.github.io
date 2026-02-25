---
layout: post
title: AWS ECS 배포 공식 문서 정리 (개발자용)
description: >
  ECS 서비스 배포(롤링 업데이트, Blue/Green, Circuit Breaker, CloudWatch Alarms, 이미지 해석 등) 관련 AWS 공식 문서를 개발자 관점에서 정리했다.
sitemap: false
date: 2026-02-24
---

# AWS ECS 배포 공식 문서 정리 (개발자용)

Amazon ECS 서비스 배포와 관련된 AWS 공식 문서를 개발자 관점에서 정리한 문서다.  
기준 문서: [Deploy Amazon ECS services by replacing tasks](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-type-ecs.html) 및 연관 문서.

---

## 목차

1. [배포 컨트롤러와 전략 개요](#1-배포-컨트롤러와-전략-개요)
2. [롤링 업데이트 (ECS 배포 타입)](#2-롤링-업데이트-ecs-배포-타입)
3. [배포 실패 감지: Circuit Breaker vs CloudWatch Alarms](#3-배포-실패-감지-circuit-breaker-vs-cloudwatch-alarms)
4. [컨테이너 이미지 해석 (Image Resolution)](#4-컨테이너-이미지-해석-image-resolution)
5. [Blue/Green 배포](#5-bluegreen-배포)
6. [배포 중단 및 강제 새 배포](#6-배포-중단-및-강제-새-배포)
7. [DeploymentConfiguration API 요약](#7-deploymentconfiguration-api-요약)
8. [참고 링크](#8-참고-링크)

---

## 1. 배포 컨트롤러와 전략 개요

### 1.1 스케줄링 전략 (Scheduling strategy)

| 전략 | 설명 |
|------|------|
| **REPLICA** | 원하는 태스크 수를 클러스터에 유지. AZ 간 균형 유지. 기본값. |
| **DAEMON** | 클러스터 내 활성 컨테이너 인스턴스마다 정확히 1개 태스크. `desiredCount` 불필요. **Fargate 미지원.** |

- REPLICA: 태스크 배치 전략/제약으로 배치 결정 가능. 지정 없으면 AZ에 분산.
- DAEMON: 로깅·모니터링·추적용 지원 컨테이너, 또는 인스턴스당 1개 앱 실행 시 사용. `maximumPercent`는 **100**만 허용.

### 1.2 배포 컨트롤러 (Deployment controller)

| 컨트롤러 | 설명 |
|----------|------|
| **ECS** | ECS 네이티브. 롤링/블루그린/리니어/카나리 전략 선택 가능. |
| **CODE_DEPLOY** | AWS CodeDeploy 기반 블루/그린. |
| **EXTERNAL** | 서드파티 배포 컨트롤러. |

### 1.3 ECS 컨트롤러의 배포 전략 (Deployment strategy)

| 전략 | 요약 | 적합한 경우 |
|------|------|-------------|
| **ROLLING** | 기존 태스크를 새 태스크로 점진 교체. `minimumHealthyPercent`, `maximumPercent`로 제어. | 점진적 업데이트, 리소스 절약, 롤백이 수 분 단위여도 됨, 로드밸런서 불필요, 상태 유지 앱, 비용 민감. **기본값.** |
| **BLUE_GREEN** | Blue(현재) / Green(신규) 환경을 두고 트래픽 전환. | 배포 전 검증, 무중단 배포, 즉시 롤백, ALB/NLB/Service Connect 사용 시. |
| **LINEAR** | 일정 시간에 걸쳐 트래픽을 균등 비율로 신규로 이동. | 점진적 검증, 배포 중 메트릭 모니터링, 위험 최소화. ALB/NLB/Service Connect 필요. |
| **CANARY** | 소량 트래픽만 먼저 신규로 보내고, 일정 시간 후 나머지 일괄 전환. | 소수 사용자로 기능/성능 검증, 폭발 반경 제한. ALB/NLB/Service Connect 필요. |

- **Task set**: 한 서비스 배포에서 동일 태스크 정의로 돌아가는 태스크 묶음.
- **Rollback**: 문제 감지 시 이전 버전으로 되돌리기. Circuit Breaker / CloudWatch Alarms에서 옵션으로 설정 가능.

---

## 2. 롤링 업데이트 (ECS 배포 타입)

롤링 업데이트는 **현재 돌아가는 태스크를 새 태스크로 교체**하는 방식이다. 교체 속도와 동시 실행 수는 배포 설정 두 파라미터로 결정된다.

### 2.1 minimumHealthyPercent

- **의미**: 배포 중 **RUNNING 상태로 유지해야 하는 태스크 수**의 하한(desired count 대비 %).
- **계산**: `ceil(desiredCount × minimumHealthyPercent / 100)`.
- **기본값**: REPLICA — CLI/API/SDK **100%**, 콘솔 **50%**. DAEMON — **0%**.
- **역할**: "이만큼은 반드시 살아 있어야 한다" → 그만큼만 내리고, 그 자리에 새 태스크를 띄울 수 있다. **추가 클러스터 용량 없이 배포**하려면 100% 미만으로 낮춘다.

**예시**

- desiredCount=4, minimumHealthyPercent=50% → 최소 2개 RUNNING. 스케줄러는 기존 2개를 먼저 중지한 뒤 새 2개를 띄울 수 있다.
- desiredCount=2, minimumHealthyPercent=75% → 최소 2개(ceil(1.5)=2). 기존 태스크를 하나도 중지하지 못하므로, **새 태스크를 띄울 여유가 있으면** 먼저 새 것을 띄우고 나서 기존 것을 중지한다.

### 2.2 maximumPercent

- **의미**: 배포 중 **RUNNING + PENDING** 태스크 수의 상한(desired count 대비 %).
- **계산**: `floor(desiredCount × maximumPercent / 100)`.
- **기본값**: REPLICA 스케줄러 **200%**.
- **역할**: "이만큼까지는 동시에 돌려도 된다" → 배치 크기(batch size) 결정. 200%면 desiredCount=4일 때 최대 8개까지 동시에 있을 수 있어, **새 4개를 먼저 띄운 뒤 기존 4개를 중지**하는 식으로 무중단에 가깝게 배포할 수 있다.

**예시**

- desiredCount=4, maximumPercent=200% → 최대 8개. 새 4개 기동 후 기존 4개 중지 가능.
- desiredCount=3, maximumPercent=125% → floor(3.75)=3. 새 태스크를 하나도 더 띄우지 못하므로, 기존 것을 하나 중지한 뒤 새 것을 하나 띄우는 식으로만 진행된다.

### 2.3 중요 제약

- **최소 1개는 중지/시작 가능해야 함**:  
  `minimumHealthyPercent`/`maximumPercent` 조합 때문에 "하나도 중지할 수 없음" 또는 "하나도 시작할 수 없음"이 되면 배포가 **진행되지 않고** 서비스 이벤트 메시지가 발생한다.  
  → [service (service-name) was unable to stop or start tasks during a deployment...](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-event-messages-list.html#service-event-messages-7) 참고.

### 2.4 Unhealthy 태스크 교체

- 배포 중 태스크가 unhealthy가 되면, `minimumHealthyPercent`를 지키기 위해 **같은 서비스 리비전**으로 대체 태스크를 띄운다.
- `maximumPercent` 여유가 있으면 **먼저 대체 태스크를 띄우고** 그 다음 unhealthy 태스크를 중지한다.  
  여유가 없으면 **unhealthy를 한 개씩 중지**해 용량을 확보한 뒤 대체 태스크를 띄운다.

---

## 3. 배포 실패 감지: Circuit Breaker vs CloudWatch Alarms

롤링 업데이트(`ECS` 배포 타입)에서 **배포 실패**를 판단하는 방법은 두 가지다. 둘 다 사용하면 **둘 중 하나만 만족해도** 배포가 실패로 처리된다.

### 3.1 Circuit Breaker (배포 서킷 브레이커)

- **용도**: "태스크가 기동되지 않을 때" 또는 "헬스체크가 계속 실패할 때" 배포를 실패로 간주하고, 옵션으로 **자동 롤백**.
- **지원**: **롤링 업데이트(ECS)** 전용.

**동작 단계**

1. **Stage 1**  
   - 태스크가 **RUNNING**으로 전이되는지 감시.  
   - **성공**: RUNNING으로 전이된 태스크가 1개 이상 있으면 실패 조건은 건너뛰고 Stage 2로.  
   - **실패**: RUNNING으로 가지 못한 태스크가 **연속으로** threshold개 있으면 배포를 **FAILED**로 전환.

2. **Stage 2**  
   - RUNNING인 태스크가 1개 이상 있을 때 진입.  
   - ELB, AWS Cloud Map, **컨테이너 헬스체크**로 상태 검사.  
   - **성공**: 1개 이상 태스크가 헬스체크 통과.  
   - **실패**: 헬스체크 실패로 교체된 태스크 수가 **threshold**에 도달하면 배포 **FAILED**.

**Failure threshold 계산**

- 공식: `min(200, max(3, ceil(0.5 × desiredCount)))`.  
  - desiredCount=1 → 3  
  - desiredCount=25 → 13  
  - desiredCount=400 → 200  
  - desiredCount=800 → 200  
- 이 값은 **변경 불가**.

**롤백**

- `rollback=true`로 두면, 실패한 배포를 중단하고 **가장 최근 COMPLETED 상태 배포**로 롤백한다.  
- 롤백 대상이 COMPLETED → IN_PROGRESS로 바뀌므로, 그 배포가 다시 COMPLETED가 되기 전에는 그 배포로의 추가 롤백은 불가.  
- COMPLETED인 배포가 하나도 없으면 서킷 브레이커는 새 태스크를 띄우지 않고 배포는 정지된 상태로 둔다.

**CLI 예시 (Circuit Breaker + 롤백)**

```bash
aws ecs create-service \
  --service-name MyService \
  --deployment-controller type=ECS \
  --desired-count 3 \
  --deployment-configuration "deploymentCircuitBreaker={enable=true,rollback=true}" \
  --task-definition sample-fargate:1 \
  --launch-type FARGATE \
  ...
```

### 3.2 CloudWatch Alarms

- **용도**: **앱 메트릭** 기준으로 배포 실패 판단(예: 5xx 증가, CPU/메모리 스파이크).  
- **지원**: **롤링 업데이트(ECS)** 전용.

**동작**

- 지정한 알람이 **ALARM** 상태가 되면 해당 배포를 **FAILED**로 전환.  
- `rollback=true`면 이전 완료된 배포로 롤백.

**Bake time**

- 트래픽이 신규 리비전으로 옮겨진 **이후**, 두 리비전이 동시에 돌아가는 기간.  
- 이 기간이 지나야 배포가 **COMPLETED**로 바뀌고, 그동안 알람을 모니터링한다.  
- 기본 bake time은 5분 미만. 알람으로 실패 감지 시 bake time을 조정할 수 있으며, ECS 기본값으로 되돌리려면 수동으로 다시 설정해야 한다.

**권장 알람 예**

- ALB 사용 시: `HTTPCode_ELB_5XX_Count`, `HTTPCode_ELB_4XX_Count`
- 기존 앱 메트릭: `CPUUtilization`, `MemoryUtilization` (클러스터/서비스)
- SQS 사용 시: `ApproximateNumberOfMessagesNotVisible`

**주의**

- 배포 **시작 시점**에 이미 알람이 ALARM이면, 그 배포에서는 알람 감지를 **하지 않는다** (기존 실패를 고치는 배포를 막지 않기 위함).
- ECS가 `DescribeAlarms`를 호출하므로 CloudWatch 할당량에 포함된다. 할당량 초과 시 알람 폴링이 지연·스로틀되어 롤백이 늦어질 수 있다.

**CLI 예시 (Alarms + 롤백)**

```bash
aws ecs create-service \
  ... \
  --deployment-configuration "alarms={alarmNames=[alarm1Name,alarm2Name],enable=true,rollback=true}" \
  ...
```

### 3.3 EventBridge

- 배포 상태 변경 시 EventBridge로 이벤트 전송.  
- `SERVICE_DEPLOYMENT_FAILED` 등으로 규칙 만들어 모니터링·수동 대응 권장.

---

## 4. 컨테이너 이미지 해석 (Image Resolution)

- 태스크 정의에는 보통 **이미지 태그**(예: `myrepo:latest`)를 쓰는데, ECS는 기본적으로 이 태그를 **이미지 digest**로 해석(고정)한다.
- **한 번 digest가 정해지면**, 그 서비스의 모든 태스크와 이후 배포는 **같은 digest**를 사용해 **버전 일관성**을 유지한다.

**동작**

- 서비스 태스크 1개: 그 태스크로 digest 확정.
- 태스크 여러 개: 배포 시 **스케줄러가 맨 처음 띄운 태스크**로 digest 확정.
- **3번 연속** digest 확정에 실패하면:  
  - Circuit Breaker 사용 시 → 배포 실패·롤백.  
  - 미사용 시 → digest 없이 배포 계속 진행할 수 있음.

**제약·참고**

- ECS Agent: 1.31.0 미만 — digest 미지원. 1.31.0~1.69.0 — **ECR 이미지만** digest 해석. 1.70.0+ — 모든 레지스트리.
- Fargate Linux: 플랫폼 버전 1.3.0 이상. Windows: 1.0.0 이상.
- Sidecar(GuardDuty, Service Connect 프록시 등)는 digest를 캡처하지 않음.
- 태스크가 많은 서비스에서 지연을 줄이려면: EC2 인스턴스에서는 Agent 1.83.0 이상 사용, 또는 태스크 정의에 **이미지 digest를 직접 지정**.
- desiredCount=0인 서비스는 digest를 확정할 수 없음. 나중에 desiredCount>0으로 배포해야 확정됨.
- **같은 태그의 새 이미지**를 배포하려면 **force new deployment**를 해야 새로 pull한 이미지 digest가 반영된다.

**버전 일관성**

- 컨테이너 정의에서 `versionConsistency`로 컨테이너별 동작 설정 가능.
- EC2 capacity provider에서 초기 배포 시 용량 부족으로 태스크 기동이 실패하면, 버전 일관성이 깨질 수 있다. 용량이 제한적일 때는 `versionConsistency: "enabled"`를 명시해 두는 것이 좋다.

---

## 5. Blue/Green 배포

### 5.1 요약

- **Blue**: 현재 프로덕션. **Green**: 새 리비전.
- Green을 띄우고 검증한 뒤, 트래픽을 Blue → Green으로 전환.  
- **ALB, NLB 또는 Service Connect** 필요.

### 5.2 6단계 워크플로

| 단계 | 설명 |
|------|------|
| **Preparation** | Blue 옆에 Green 환경·타겟 그룹 준비. |
| **Deployment** | Green에 새 서비스 리비전 배포. Blue는 그대로 트래픽 처리. |
| **Testing** | ALB로 테스트 트래픽만 Green으로 보내 검증. |
| **Traffic shifting** | 프로덕션 트래픽을 Blue → Green으로 전환. ECS 블루/그린은 **한 번에 100%** 전환. |
| **Monitoring** | Bake time 동안 헬스·알람 모니터링. 문제 시 롤백. |
| **Completion** | Blue 종료 또는 롤백 대비해 유지. |

### 5.3 라이프사이클 스테이지

각 스테이지는 최대 **24시간**. 24시간 초과 시 타임아웃 후 실패·롤백. CloudFormation은 **전체 배포 36시간** 제한.

| 스테이지 | 설명 | Lifecycle hook 사용 |
|----------|------|---------------------|
| RECONCILE_SERVICE | ACTIVE 리비전이 2개 이상일 때만 발생. | Yes |
| PRE_SCALE_UP | Green 미시작, Blue 100%. | Yes |
| SCALE_UP | Green 0→100% 스케일 업, 트래픽 없음. | No |
| POST_SCALE_UP | Green 기동됨, Blue 100%. | Yes |
| TEST_TRAFFIC_SHIFT | Blue 100% 프로덕션, Green 0→100% 테스트 트래픽. | Yes |
| POST_TEST_TRAFFIC_SHIFT | Green 100% 테스트 트래픽. | Yes |
| PRODUCTION_TRAFFIC_SHIFT | 프로덕션 트래픽이 Green으로 이동 중. | Yes |
| POST_PRODUCTION_TRAFFIC_SHIFT | 프로덕션 트래픽 전환 완료. | Yes |
| BAKE_TIME | Blue·Green 동시 실행 기간. | No |
| CLEAN_UP | Blue 0개, Green이 프로덕션. | No |

---

## 6. 배포 중단 및 강제 새 배포

### 6.1 배포 중단 (Stop deployment)

- Circuit Breaker나 CloudWatch Alarms로 자동 감지되지 않은 **실패 배포**를 수동으로 멈추고 롤백할 때 사용.
- **Stop type**: **ROLLBACK** — 이전 서비스 리비전으로 롤백. (서비스 생성 시 rollback 옵션을 안 켜도 수동 롤백 가능.)

**대상 상태**: PENDING, IN_PROGRESS, STOP_REQUESTED, ROLLBACK_REQUESTED, ROLLBACK_IN_PROGRESS.

**CLI**

```bash
# 1) 배포 ARN 조회
aws ecs list-service-deployments --cluster cluster-name --service service-name

# 2) 해당 배포 롤백
aws ecs stop-service-deployment \
  --service-deployment-arn <serviceDeploymentArn> \
  --stop-type ROLLBACK
```

### 6.2 강제 새 배포 (Force new deployment)

- 태스크 정의는 그대로 두고 **같은 태그의 최신 이미지**를 다시 pull 해서 배포하고 싶을 때(예: `latest` 태그).
- `UpdateService` 시 `forceNewDeployment: true` 사용.  
  새 태스크가 기동될 때 현재 이미지(태그)를 다시 pull하고, 필요 시 **이미지 digest도 다시 확정**된다.

---

## 7. DeploymentConfiguration API 요약

| 필드 | 타입 | 설명 |
|------|------|------|
| **minimumHealthyPercent** | Integer | 롤링 업데이트 시 RUNNING 유지 하한(%). REPLICA 기본 100%(CLI/API), 콘솔 50%. DAEMON 기본 0%. |
| **maximumPercent** | Integer | 롤링 업데이트 시 RUNNING+PENDING 상한(%). REPLICA 기본 200%. DAEMON은 100 고정. |
| **deploymentCircuitBreaker** | Object | enable, rollback. 롤링(ECS) 전용. |
| **alarms** | DeploymentAlarms | alarmNames, enable, rollback. 롤링(ECS) 전용. |
| **strategy** | String | ROLLING \| BLUE_GREEN \| LINEAR \| CANARY. |
| **bakeTimeInMinutes** | Integer | BLUE_GREEN 시 트래픽 전환 후 blue·green 동시 실행 시간(분). |
| **canaryConfiguration** | Object | CANARY 전략일 때만. |
| **linearConfiguration** | Object | LINEAR 전략일 때만. |
| **lifecycleHooks** | Array | 배포 라이프사이클 특정 단계에서 실행할 훅. |

CODE_DEPLOY/EXTERNAL + EC2 launch type에서는 `minimumHealthyPercent`/`maximumPercent`를 사용자 지정할 수 없고, DRAINING 시 동작에만 쓰인다. Fargate + CODE_DEPLOY/EXTERNAL에서는 이 값들이 배포 제어에 쓰이지 않지만 Describe 시에는 반환된다.

---

## 8. 참고 링크

| 문서 | URL |
|------|-----|
| Deploy by replacing tasks (롤링 업데이트) | https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-type-ecs.html |
| Deployment circuit breaker | https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-circuit-breaker.html |
| CloudWatch alarms for deployment failure | https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-alarm-failure.html |
| Service deployment controllers and strategies | https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs_service-options.html |
| Blue/green deployment workflow | https://docs.aws.amazon.com/AmazonECS/latest/developerguide/blue-green-deployment-how-it-works.html |
| Stopping service deployments | https://docs.aws.amazon.com/AmazonECS/latest/developerguide/stop-service-deployment.html |
| DeploymentConfiguration (API) | https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_DeploymentConfiguration.html |
| Service event messages (e.g. deployment stuck) | https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-event-messages-list.html |
| versionConsistency (task definition) | https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html#ContainerDefinition-versionconsistency |
| forceNewDeployment (UpdateService) | https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_UpdateService.html |

---

*이 문서는 AWS 공식 문서를 바탕으로 정리했으며, 실제 구현 시 최신 Developer Guide와 API Reference를 반드시 확인하는 것이 좋다.*
