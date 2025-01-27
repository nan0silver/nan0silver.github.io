---
layout: post
title: JavaScript 단축 평가 (Short-circuit evaluation)
description: >
  JavaScript 단축 평가 (Short-circuit evaluation)에 대해 알아보자.
sitemap: false
---

# [JavaScript] 단축 평가 (Short-circuit evaluation)

- [단축 평가란?](#단축-평가란)
- [단축 평가 동작 방식](#단축-평가-동작-방식)
- [단축 평가 활용 예시](#단축-평가-활용-예시)
- [주의사항](#주의사항)

---

## 단축 평가란?

- 논리 연산자 (`&&`, `||`) 를 평가할 때, **결과를 미리 결정할 수 있다면 나머지 표현식을 평가하지 않고 곧바로 결과를 반환하는 것**
  - **`&&` (AND) 연산자**: 두 피연산자가 모두 `true` 일 때만 `true` 를 반환합니다.
  - **`||` (OR) 연산자**: 두 피연산자 중 하나라도 `true` 이면 `true` 를 반환합니다.
- 논리 연산자의 동작 방식을 이용하여 불필요한 연산을 줄이고, 코드 실행 효율성을 높임.
  - `&&` (AND) 와 `||` (OR) 연산자를 조건문 없이 사용하는 코드를 가능하게 함

## 단축 평가 동작 방식

### 1. `&&` (AND) 연산자

`&&` 연산자는 **좌항부터 평가**

- **좌항이 `false` 라면**:
  - `&&` 연산의 결과는 항상 `false` 이므로, **우항을 평가하지 않고 곧바로 `false` 를 반환**
- **좌항이 `true` 라면**:
  - `&&` 연산의 결과는 우항에 따라 결정되므로, **우항을 평가하고 그 결과를 반환**

```javascript
console.log(false && true); //falsk
//(좌항이 false이므로 우항을 평가하지 않고 false 반환)

console.log(true && false); //false
//(좌항이 true이므로 우항을 평가하여 false 반환)

console.log(true && true); //true
//(좌항이 true이므로 우항을 평가하여 true 반환)
```

### 2. `||` (OR) 연산자

`||` 연산자는 `&&` 연산자와 마찬가지로 **좌항부터 평가**

- **좌항이 `true` 라면**:
  - `||` 연산의 결과는 항상 `true` 이므로, **우항을 평가하지 않고 곧바로 `true` 를 반환**
- **좌항이 `false` 라면**:
  - `||` 연산의 결과는 우항에 따라 결정되므로, **우항을 평가하고 그 결과를 반환**

```javascript
console.log(true || false); //true
//(좌항이 true이므로 우항을 평가하지 않고 true 반환)

console.log(false || true); //true
//(좌항이 false이므로 우항을 평가하여 true 반환)

console.log(false || false); //false
//(좌항이 false이므로 우항을 평가하여 false 반환)
```

## 단축 평가 활용 예시

### 1. 객체의 속성에 접근할 때

객체의 속성에 접근하기 전에 객체가 `null` 또는 `undefined` 인지 확인하는 코드를 단축 평가로 간결하게 작성 가능

```javascript
const person = { name: "Alice" };
// const person = null; // person이 null인 경우

// 조건문 사용
let name;
if (person) {
  name = person.name;
} else {
  name = "Unknown";
}
console.log(name); // Alice

// 단축 평가 사용
const name2 = person && person.name;
console.log(name2);
// Alice (person이 truthy 값이므로 person.name 평가)

const person2 = null;
const name3 = person2 && person2.name;
console.log(name3); // null (person2가 falsy 값이므로 person2 그대로 반환)

// || 연산자를 사용한 기본값 설정
const name4 = person2 || { name: "Unknown" };
console.log(name4); // { name: 'Unknown' } (person2가 falsy 값이므로 { name: 'Unknown' } 반환)
console.log(name4.name); // Unknown
```

### 2. 함수 매개변수에 기본값 설정

함수 매개변수에 기본값을 설정할 때 `||` 연산자를 사용하여 코드를 간결하게 만들 수 있다.

```javascript
function greet(name) {
  // 조건문 사용
  const userName = name ? name : "Guest";
  console.log(`Hello, ${userName}!`);
}

greet("Bob"); // Hello, Bob!
greet(); // Hello, Guest!

function greet2(name) {
  // 단축 평가 사용
  const userName = name || "Guest";
  console.log(`Hello, ${userName}!`);
}

greet2("Charlie"); // Hello, Charlie!
greet2(); // Hello, Guest!
```

### 3. 조건부 렌더링 (React)

React와 같은 UI 라이브러리에서 조건부 렌더링을 구현할 때 단축 평가를 유용하게 사용할 수 있다.

```jsx
function MyComponent({ items }) {
  return (
    <div>
      {/_ items가 존재하고 배열인 경우에만 목록 렌더링 _/}
      {items && Array.isArray(items) && (
        <ul>
          {items.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      )}
      {/_ items가 없거나 배열이 아닌 경우 메시지 표시 _/}
      {!items && <div>No items to display.</div>}
      {items || <div>No items to display.</div>} {/_ || 연산자 사용 _/}
    </div>
  );
}
```

## 주의사항

- 단축 평가는 코드를 간결하게 만들어주지만, 남용하면 코드의 가독성을 해칠 수 있음.
  - 적절한 상황에서 사용하는 것이 중요합니다.
- `&&` 와 `||` 연산자는 boolean 값이 아닌 값도 반환 가능
  - 단축 평가의 반환 값은 마지막으로 평가된 표현식의 결과이다.
