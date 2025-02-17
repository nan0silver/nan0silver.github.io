---
layout: post
title: git rebase
description: >
  git rebase의 동작 방식에 대해 알아보자.
sitemap: false
---

# [Git] git rebase

- [git rebase](#git-rebase)
- [git rebase VS git merge](#git-rebase-vs-git-merge)
- [git rebase 사용법](#git-rebase-사용법)
- [장점](#장점)
- [주의 사항](#주의-사항)

---

## git rebase

- Git에서 브랜치의 커밋 히스토리를 재구성할 때 사용하는 명령어로, 현재 브랜치의 기반이 되는 커밋을 변경한다.
  > 브랜치의 시작점을 다른 브랜치의 최신 커밋으로 옮겨서, 변경 이력을 깔끔하게 정리함
- 이를 통해 브랜치의 히스토리를 "정리(clean)"하거나 최신 상태를 기반으로 변경사항을 다시 적용할 수 있음
- ‼️ 실제 동작 방식
  - main 브랜치가 이렇게 변경되었다.
    > A - B - C (main 최신 상태)
  - 내 feature-branch는 main 브랜치를 기반으로 작업했지만 오랜된 상태임
    > A - B - (내 변경 사항 X, Y) (feature-branch)
  - ➡️ 이 상태에서 `git rebase main`을 실행하면
    > A - B - C - ( 내 변경 사항 X, Y) (rebase된 feature-branch)

## git rebase의 필요성

### 1. Base 브랜치가 변경될 때 Conflict 최소화

- 여러 개발자가 동시에 작업하는 경우, 메인 브랜치(main or develop)의 최신 커밋을 반영하지 않으면 충돌이 발생할 가능성이 높다/
- Rebase를 하면, 최신 코드 기준으로 브랜치 변경 이력을 재구성할 수 있어, Merge conflict를 최소화할 수 있다.
- ✅ 예제 : Rebase없이 충돌 발생
  - `feature-branch`에서 작업을 했지만, main 브랜치가 업데이트됨
  - `git merge main`을 하면 불필요한 merge commit이 생성됨
    - merge commit이 많아지면 협업시 코드리뷰할 때 이력 파악이 어려워짐
  - conflict가 날 가능성이 많아짐
  - ✅ Rebase로 conflict 최소화
  - ```bash
    git checkout feature-branch
    git rebase main
    # → 최신 main 브랜치 기준으로 변경 이력 재구성
    ```
    - ➡️ Rebase를 하면 최신 코드와 충돌을 최소화하면서 깔끔한 커밋 이력 유지 가능

## git rebase VS git merge

- 일반적으로 merge와 같은 목적으로 사용되지만, 다른 방식으로 작동
  - merge
    - 두 브랜치의 히스토리를 합치면서, 새로운 병합 커밋을 생성
    - **개발이 완료된 브랜치를 병합할 때 주로 사용**
    - **두 개의 문서를 그냥 합치기**
  - rebase
    - 한 브랜치의 커밋을 다른 브랜치의 끝으로 옮겨서, 히스토리가 마치 일렬로 정리된 것처럼 보임
    - 불필요한 병합 커밋을 없애고 이력을 깔끔하게 유지 가능
    - **개발 브랜치를 최신 코드로 업데이트 할 때 주로 사용**
    - **새로운 버전의 문서 위에 내 작업을 다시 복사해서 붙여넣기**
- 예시 이미지

  - <img src="https://github.com/nan0silver/nan0silver.github.io/blob/main/assets/img/blog/2025-01-23-git-rebase.png?raw=true" alt="git-rebase" style="width:150px; ">

  - `16d0e75` 커밋 아래는 merge 흔적
  - `16d0e75` 커밋 위는 rebase로 인한 선형 히스토리

## git rebase 사용법

1. 업스트림 브랜치로 리베이스

   ```
   git swicth -c feature
   git rebase main
   ```

   - `feature` 브랜치에서 작업한 커밋을들 `main` 브랜치의 최신 상태를 기반으로 재적용

2. interactive rebase
   ```
   git rebase -i HEAD~n
   ```
   - 마지막 n개의 커밋을 선택적으로 수정하거나 합칠 수 있음
   - 실행하면 편집 모드가 열리며, 옵션을 선택할 수 있음
     - pick, reword, edit, squash, drop등

## 장점

- 히스토리 정리
- 불필요한 merge 커밋 제거
- 최신 상태 유지

## 주의 사항

- 리베이스 중 충돌
- 이미 푸시된 브랜치에 리베이스 금지
- `git pull --rebase`
  - 원격 브랜치의 변경 사항을 병합 대신 리베이스로 가져올 때 사용
