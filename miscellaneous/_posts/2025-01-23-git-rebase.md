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

- Git에서 브랜치의 커밋 히스토리를 재구성할 때 사용하는 명령어
- 이를 통해 브랜치의 히스토리를 "정리(clean)"하거나 최신 상태를 기반으로 변경사항을 다시 적용할 수 있음

## git rebase VS git merge

- 일반적으로 merge와 같은 목적으로 사용되지만, 다른 방식으로 작동
  - merge
    - 두 브랜치의 히스토리를 합치면서, 새로운 병합 커밋을 생성
  - rebase
    - 한 브랜치의 커밋을 다른 브랜치의 끝으로 옮겨서, 히스토리가 마치 일렬로 정리된 것처럼 보임
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
