---
layout: post
title: Responsive VS Reactive (프론트엔트 개발자 관점)
description: >
  프론트엔드 개발자 관점에서 Responsive와 Reactive의 뜻을 알아보자.
sitemap: false
---

# [Etc] Responsive VS Reactive

- [Responsive](#responsive-반응형)
- [Reactive](#reactive-반응형)
- [Responsive VS Reactive](#responsive-vs-reactive)
- [결합된 활용](#결합된-활용)

---

## Responsive (반응형)

- Responsive는 주로 UI/UX 디자인이나 프론트엔트 개발에서 사용되는 개념
- 애플리케이션 또는 웹 페이지가 화면 크기, 해상도, 디바이스 특성에 따라 적절히 변하도록 설계된 것을 의미
- 특징
  - 주요 초점
    - 레이아웃 및 디자인이 다양한 화면 환경(데스크톱, 태블릿, 모바일)에 적응
  - 기술
    - 주로 CSS, Flexbox, Grid, Viewport 등을 사용
  - 목적
    - 사용자 경험을 개선하고, 어떤 장치에서도 보기 좋은 디자인을 제공
- 예시
  - 웹사이트 반응형 디자인
    - 큰 화면에서는 여러 열(column)을 보여주고, 작은 화면에서는 한 열로 정렬
    - 이미지와 텍스트 사이즈가 디바이스 크기에 따라 자동으로 조정
  - [부트스트랩 (Bootstrap)](https://getbootstrap.kr/)
    - col-m-6와 같은 클래스 이름을 사용하여 화면 크기에 따라 레이아웃을 조정

## Reactive (반응형)

- Reactive는 주로 프로그래밍 패러다임과 관련이 있음
- 시스템이 변화를 감지하고 즉각적으로 동작을 수행하는 것을 의미
- 특징
  - 주요 초점
    - 데이터와 상태의 변화에 따라 UI가 자동으로 업데이트
  - 기술
    - Reactive Programming과 관련된 라이브러리와 프레임워크를 활용
    - ex) RxJS, React, Vue, Svelte 등
  - 목적
    - 상태 관리와 데이터 흐름을 단순화하고, 사용자 입력 또는 데이터 변화에 실시간으로 반응
- 예시

  - React.js에서의 State변화

    - 사용자가 버튼을 클릭하면 상태가 변경되고, 해당 상태에 따라 UI가 즉각적으로 업데이트

    ```javascript
    import React, { useState } from "react";

    function Counter() {
      const [count, setCount] = useState(0);

      return (
        <div>
          <p>Count: {count}</p>
          <button onClick={() => setCount(count + 1)}>Increase</button>
        </div>
      );
    }
    ```

  - RxJS 스트림

    - 데이터를 스트림(stream) 형태로 처리하고, 데이터 변경에 실시간으로 반응

    ```javascript
    import { fromEvent } from "rxjs";

    const button = document.getElementById("myButton");
    const clicks = fromEvent(button, "click");

    clicks.subscribe(() => console.log("Button clicked!"));
    ```

## Responsive VS Reactive

| **측면**  | **Responsive**                                     | **Reactive**                              |
| --------- | -------------------------------------------------- | ----------------------------------------- |
| 적용 범위 | 주로 UI/UX와 레이아웃 디자인                       | 상태 관리와 데이터 흐름                   |
| 목적      | 화면 크기에 따른 레이아웃 및 스타일 변경           | 데이터 및 상태 변경에 따른 즉각적인 반응  |
| 사용 기술 | CSS, Flexbox, Grid 등                              | React, RxJS, Vue 등 상태 기반 프레임워크  |
| 초점      | 디바이스별 최적화된 레이아웃 제공                  | 데이터의 흐름과 UI 동기화                 |
| 예시      | 모바일에서 1열 레이아웃, 데스크톱에서 3열 레이아웃 | 버튼 클릭 시 상태 업데이트 후 UI 리렌더링 |

## 결합된 활용

- Responsive와 Reactive는 함께 사용될 때 더 큰 효과를 발휘한다.
- 예를 들어, React.js로 만들어진 SPA(Single Page Application)에서 반응형 디자인(CSS)을 사용해 다양한 디바이스를 지원하면서, React의 상태 관리(State Management)를 통해 UI를 데이터와 동기화할 수 있음.
- 예시

  - Reaponsive는 레이아웃과 UI에 초점을 맞추고, Reactive는 데이터와 상태 관리에 집중
    - 둘이 상호보완적!

  ```javascript
  import React, { useState } from 'react';
  import './App.css'; // Responsive 스타일 포함

  function App() {
      const [isDarkMode, setIsDarkMode] = useState(false);

      return (
          <div className={`app ${isDarkMode ? 'dark-mode' : ''}`}>
              <p>Welcome to the responsive and reactive app!</p>
              <button onClick={() => setIsDarkMode(!isDarkMode)}>
                  Toggle Dark Mode
              </button>
          </div>
      );
  }

  /* App.css */
  .app {
      padding: 20px;
      transition: background-color 0.3s;
  }

  .dark-mode {
      background-color: #333;
      color: #fff;
  }

  @media (max-width: 768px) {
      .app {
          font-size: 14px;
      }
  }
  ```
