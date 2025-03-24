---
layout: post
title: git clone VS git fork
description: >
  git clone과 git fork의 동작 방식에 대해 알아보자.
sitemap: false
---

# [Git] git clone VS git fork

- [git clone](#git-clone)
- [git fork](#git-fork)
- [주요 차이점 정리](#주요-차이점-정리)
- [워크플로우](#워크플로우)
- [실전 예시](#실전-예시)

---

## git clone

- 역할
  - 원격 저장소를 로컬 컴퓨터에 복제
- 작업 대상
  - 원격 저장소
- 특징
  - 저장소의 완전한 복사본(전체 커밋 내역, 브랜치 등)을 가져옴
  - 복제 후, 원격 저장소가 자동으로 `origin`이라는 이름으로 연결됨
  - 로컬에서 작업한 내용을 원격 저장소에 반영하려면 `push`사용
- 동작 방식
  1. Git 저장소 초기화 (`git init`)
     - 새로 생성된 폴더는 Git 저장소로 설정됨
     - `.git` 디렉터리가 자동으로 생성됨
  2. 원격 저장소 설정 (`git remote add origin`)
     - 복제한 원격 저장소가 자동으로 `origin`이라는 이름으로 연결됨
     - 로컬에서 원격 저장소와 동기화(`push`, `pull`)를 가능하게 함
  3. 브랜치 체크아웃
     - 기본 브랜치(`main` or `master`)의 최신 상태가 복제됨
     - 이 브랜치는 로컬 저장소로 가져와 자동으로 체크아웃됨
  4. 파일 다운로드
     - 원격 저장소에 있는 모든 파일과 폴더가 로컬 디렉토리에 다운로드됨
- `git clone` 명령을 실행하면, 다운받은 폴더는 자동으로 Git 저장소로 초기화되고, 원격 저장소와도 연결된 상태임
  - **`git init`이나 `git remote add`를 실행할 필요가 없음**

## git fork

- 역할
  - 원격 저장소를 자신의 원격 계정으로 복제
- 작업 대상
  - GitHub/GitLab 계정 상의 저장소
- 특징
  - 원본 저장소의 복사본이 내 계정의 원격 저장소로 생성됨
  - **내 계정에서 관리할 수 있는 원격 저장소를 만든다는 것**이 핵심
  - 원본 저장소와 연결은 유지되지만, 독립적인 저장소로 사용됨
  - 추가 단계
    - 포크 후, 로컬에 복사하려면 <strong>`git clone`</strong>을 사용해야 함
- 사용 시기
  - 오픈소스 프로젝트에 기여할 때, 원본 저장소를 수정하지 않고 내 계정에서 관리 가능한 복사본을 만들어야 할 때 사용
  - **Pull Request**를 보내기 위한 준비 단계로 사용

## 주요 차이점 정리

| **특징**           | **git clone**                        | **git fork**                                                 |
| ------------------ | ------------------------------------ | ------------------------------------------------------------ |
| 복제 대상          | 원격 저장소 ➡️ 로컬 저장소           | 원격 저장소 ➡️ 내 원격 저장소                                |
| 저장소 위치        | 로컬에서 작업                        | 내 계정의 원격 저장소에서 작업                               |
| 연결된 원격 저장소 | `origin`으로 원본 저장소 연결        | 내 계정의 원격 저장소 (원본 저장소는 upstream으로 연결 가능) |
| 사용 목적          | 로컬에서 작업하고 원본 저장소에 반영 | 내 계정에서 독립적으로 원격 저장소 관리                      |
| 주로 사용 상황     | 협업 프로젝트에 바로 참여            | 오픈소스 프로젝트에 기여 (Pull Request 준비)                 |

## 워크플로우

### 일반적으로 **Fork → Clone → Push → Pull Request**가 오픈 소스 협업의 표준 워크플로우

1. Fork 저장소 생성

   - 먼저, 해당 저장소를 **Fork**하여 내 계정으로 복사
     - GitHub에서 기여하고자 하는 저장소 페이지로 이동
     - 우측 상단의 **Fork** 버튼을 클릭
     - 그러면 내 계정에 저장소 복사본이 생성됨

2. Fork 저장소 Clone

   - Fork된 저장소를 로컬로 복제
     ```bash
     git clone https://github.com/your-username/repository.git
     ```
     - `your-username`은 GitHub 계정 이름으로 대체
     - Clone이 완료되면 로컬 환경에서 작업 가능

3. 원본 저장소 추가 (선택 사항)

   - 원본 저장소와 동기화를 유지하려면, 원본 저장소를 **`upstream`**으로 추가
     ```bash
     git remote add upstream https://github.com/original-owner/repository.git
     ```
     - `original-owner`는 원본 저장소의 소유자 이름으로 대체
     - `git remote -v` 명령을 사용하여 설정이 제대로 되었는지 확인 가능

4. 로컬에서 작업

   - 새로운 파일을 추가하거나 수정 후 커밋
     ```bash
     git add .
     git commit -m "Add new feature"
     ```

5. Fork된 저장소에 Push

   - 로컬에서 작업한 내용을 자신의 Fork 저장소에 Push
     ```bash
     git push origin main
     ```
     - 여기서 `main`은 사용하는 브랜치 이름

6. Pull Request 생성

   - GitHub로 돌아가, Fork된 저장소에서 원본 저장소로 **Pull Request**를 생성

     1. 내 Fork 저장소 페이지에서 **"Contribute"** 버튼 클릭.
     2. **"Open Pull Request"** 버튼 클릭.
     3. 변경 사항에 대한 설명을 작성하고 Pull Request를 제출합니다.

### ✅ 요약

다른 사람의 저장소에 기여하기 위한 전체 과정

1. **Fork**: 저장소를 내 계정으로 복제.
2. **Clone**: 내 계정에 있는 저장소를 로컬로 복제.
3. **원본 저장소 추가**: 원본 저장소와 동기화(선택 사항).
4. **작업**: 로컬에서 파일 수정 및 커밋.
5. **Push**: 작업 내용을 내 계정 저장소로 업로드.
6. **Pull Request**: 원본 저장소에 변경 사항을 제안.

## 실전 예시

1. `git clone`만 사용하는 경우

   - 팀 프로젝트에서 기존 저장소를 복제하여 작업 후, 원본 저장소에 바로 push

   ```bash
   git clone <repository-url>
   cd <repository-folder>
   # 작업 후
   git push origin <branch-name>
   ```

2. `git fork`와 `git clone`을 함께 사용하는 경우
   - 오픈소스 프로젝트에서 자신의 계정으로 fork 후, 로컬에서 복제하여 작업 후 pull request 보냄
   ```bash
   # GitHub에서 Fork한 후
   git clone <forked-repository-url>
   cd <repository-folder>
   # 원본 저장소를 upstream으로 추가
   git remote add upstream <original-repository-url>
   git fetch upstream
   # 작업 후, 내 계정 원격 저장소에 Push
   git push origin <branch-name>
   ```
