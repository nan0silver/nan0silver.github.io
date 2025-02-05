---
layout: post
title: JavaScript 함수
description: >
  JavaScript의 함수에 대해 알아보자.
sitemap: false
---

# [JavaScript] 함수

- [함수 (function)](#함수-function)
- [화살표 함수](#화살표-함수)
- [고차 함수 (map, filter, reduce)](#고차-함수)
- [구조 분해 할당](#구조-분해-할당)

---

## 함수 (function)

- 함수 선언

  - `function`으로 선언
  - 호이스팅 (hoisting)

    - JavaScript에서 변수, 함수 선언, 클래스 등의 선언이 코드 실행 전에 메모리에 미리 할당되는 현상
      - 코드에서 선언이 끌어올려진(hoisted) 것처럼 동작
    - | 변수 타입 | 선언 Hoisting | 초기화 여부    | 선언 전 접근             |
      | --------- | ------------- | -------------- | ------------------------ |
      | `var`     | ✅ O          | ✅ (undefined) | ✅ 가능 (undefined 반환) |
      | `let`     | ✅ O          | ❌ (TDZ 존재)  | ❌ ReferenceError        |
      | `const`   | ✅ O          | ❌ (TDZ 존재)  | ❌ ReferenceError        |

    - 함수 선언 이전에 호출이 가능

  - ```javascript
    function welcomeMessage(username) {
      return "Hi, ${username}!";
    }
    console.log(welcomeMessage("Lily"));
    ```

- 함수 표현식
  - 이름이 없는 함수를 만들어 변수에 할당하여 정의
  - 호이스팅되지 않으므로, 함수 정의 이후에만 호출 가능

## 화살표 함수

- ES6에서 도입된 간결한 함수 표현 방식
- ```javascript
  //ex1
  const welcomeMessage = (username) => "Hi, ${username}!";

  console.log(welcomeMessage("Lily"));

  //ex2
  const calculateArea = (width, height) => {
    let area = width * height;
    return area;
  };

  console.log(calculateArea(5, 10)); // 출력: 50
  ```

- 함수 표현식보다 간결하게 작성 가능함
- `this` 바인딩이 화살표 함수의 정의 위치에서 고정되는 특성을 가짐

  - `this` 바인딩 (Binding)

    - `this` 키워드가 특정 실행 문맥(Excution Context)에서 어떤 객체를 가리키는지 결정되는 과정
    - JavaScript에서 `this`는 어떻게, 어디서 호출되었느냐에 따라 값이 달라짐
    - 전통적인 함수와 화살표 함수의 `this` 바인딩 방식이 다름
      - 전통적인 함수
        - 호출 맥락에 따라 this가 변경될 수 있음
      - 화살표 함수
        - this가 고정되어 예상치 못한 this의 문제를 방지함
    - ### 기본적인 this 바인딩 규칙

      - | 호출 방식                    | `this`가 가리키는 대상                             |
        | ---------------------------- | -------------------------------------------------- |
        | 일반 함수 호출               | `window` (브라우저) 또는 `undefined` (strict mode) |
        | 메서드 호출 (객체 안에서)    | 해당 객체                                          |
        | 생성자 함수                  | 새로 생성된 인스턴스                               |
        | `call`, `apply`, `bind` 사용 | 명시적으로 지정된 객체                             |
        | 화살표 함수                  | 부모(외부) 스코프의 `this`                         |
      - 예시

      ````javascript
          //일반 함수 호출
          function showThis() {
              console.log(this);
          }
          showThis(); //브라우저: window, strict mode: undefined

          //화살표 함수
          const user2 = {
              name: "Lily",
              greet: function() {
                  const arrow = () => {
                      console.log(this.name);
                  };
                  arrow();
              }
          };
          user2.greet(); //"Lily"
          ```
      ````

## 고차 함수

### map

- 배열의 각 요소를 변환하여 새로운 배열 생성
- 원본 배열은 유지
- ```javascript
  const num = [1, 2, 3];
  const mul = num.map((n) => n * 10);
  console.log(mul); //[ 10, 20, 30 ]
  ```

### filter

- 배열에서 조건에 맞는 요소만 반환하여 새로운 배열을 생성
- 원본 배열은 유지
- ```javascript
  const words = ["apple", "banana", "avocado", "cherry", "apricot"];
  const aWords = words.filter((word) => word.startsWith("a"));

  console.log(aWords); // ["apple", "avocado", "apricot"]
  ```

### reduce

- 배열의 모든 요소를 순회하며 누적하여 단일 값(accumulator) 생성
- 초기값 설정 가능
- 집계 연산에 유용
- ```javascript
  const numbers = [1, 2, 3, 4, 5];
  const product = numbers.reduce((acc, num) => acc * num, 1);

  console.log(product); // 120
  ```

## 구조 분해 할당

- 배열 구조 분해 할당
  - 배열을 개별 변수로 분해 가능
  - 스프레드 연산자(`...`)로 나머지 요소 처리 가능
  - ```javascript
    const [x, y, ...remaining] = [10, 20, 30, 40, 50];
    console.log(x, y, remaining); // 10 20 [30, 40, 50]
    ```
- 객체 구조 분해 할당

  - 객체에서 속성을 변후로 추출 가능
  - 기본값 설정 가능
  - ```javascript
    const { brand, model, year = 2023 } = { brand: "Tesla", model: "Model S" };
    console.log(brand, model, year); // Tesla Model S 2023
    ```

  - 중첩된 객체의 속성도 분해하여 사용 가능

    - ```javascript
      const person = {
        info: {
          firstName: "Alice",
          lastName: "Johnson",
        },
        age: 28,
      };

      const {
        info: { firstName, lastName },
        age,
      } = person;
      console.log(firstName, lastName, age); // Alice Johnson 28
      ```

- 함수에서 구조 분해 활용

  - ```javascript
    function displayCar({ brand, model, year }) {
      console.log(`The car is a ${year} ${brand} ${model}`);
    }

    displayCar({ brand: "Toyota", model: "Corolla", year: 2022 });
    // The car is a 2022 Toyota Corolla
    ```
