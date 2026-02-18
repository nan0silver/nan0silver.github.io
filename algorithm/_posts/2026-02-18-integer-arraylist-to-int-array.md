---
layout: post
title: Algorithm - Integer ArrayList을 int 배열로 변환하는 방법
description: >
  알고리즘 문제 풀이 시 Integer ArrayList를 int[] 배열로 변환해야 할 때 사용할 수 있는 방법을 정리했습니다.
sitemap: false
---

# [Algorithm] Integer ArrayList을 int 배열로 변환하는 방법

알고리즘 문제를 풀다 보면 `List<Integer>`로 모아둔 결과를 최종적으로 `int[]` 배열로 반환해야 하는 경우가 많다. `String` 리스트는 `toArray()`로 쉽게 변환할 수 있지만, **primitive 타입인 int는 `toArray()`를 그대로 쓸 수 없다.** 이번 글에서는 Integer ArrayList를 int 배열로 바꾸는 방법을 정리해보자.

1. [String List vs Integer List](#-1️⃣-string-list-vs-integer-list)
2. [방법 1: 반복문 사용](#-2️⃣-방법-1-반복문-사용)
3. [방법 2·3: Stream + mapToInt](#-3️⃣-방법-23-stream--maptoint)
4. [방법 4: null 필터링이 필요할 때](#-4️⃣-방법-4-null-필터링이-필요할-때)
5. [정리](#-5️⃣-정리)

---

## 📌 1️⃣ String List vs Integer List

**String 타입의 List**는 `toArray()`로 바로 배열로 만들 수 있다.

```java
List<String> list = new ArrayList<>();
list.add("a");
list.add("b");
list.add("c");

// toArray() - 배열 선언과 동시에 할당
String[] arr = list.toArray(new String[0]);  // ["a", "b", "c"]

// toArray() - 배열 선언 후 값 할당
String[] arr2 = new String[list.size()];
list.toArray(arr2);  // ["a", "b", "c"]
```

반면 **int는 primitive 타입**이라 `List<int>` 같은 제네릭이 불가능하고, `List<Integer>`를 쓴다. 이때 `toArray()`만으로는 `int[]`를 얻을 수 없어서 아래와 같은 변환 방법을 사용해야 한다.

---

## 🔄 2️⃣ 방법 1: 반복문 사용

가장 직관적인 방법이다. 리스트 크기만큼 `int[]`를 만들고, 각 요소를 `intValue()`로 unboxing해서 넣는다.

```java
List<Integer> list = new ArrayList<>();
list.add(1);
list.add(2);
list.add(3);

int[] arr = new int[list.size()];
for (int i = 0; i < list.size(); i++) {
    arr[i] = list.get(i).intValue();
}
```

- **장점**: 코드가 단순하고 의도가 분명함.  
- **단점**: 한 줄로 쓰기 어렵고, null이 있으면 NPE 가능.

---

## 🚀 3️⃣ 방법 2·3: Stream + mapToInt

Stream으로 리스트를 `IntStream`으로 바꾼 뒤 `toArray()`로 `int[]`를 만드는 방법이다. 알고리즘/코테 풀이에서 한 줄로 쓰기 좋다.

```java
List<Integer> list = new ArrayList<>();
list.add(1);
list.add(2);
list.add(3);

// 방법 2: 람다로 자동 unboxing
int[] arr2 = list.stream()
        .mapToInt(i -> i)
        .toArray();

// 방법 3: 메서드 레퍼런스로 명시적 변환
int[] arr3 = list.stream()
        .mapToInt(Integer::intValue)
        .toArray();
```

- **방법 2**: `i -> i`에서 Java가 `Integer`를 `int`로 자동 unboxing 해준다.  
- **방법 3**: `Integer::intValue`로 직접 int로 변환한다.  
- **공통**: 코드가 짧고, 리스트에 null이 없을 때 사용하기 적합하다.

---

## ⚠️ 4️⃣ 방법 4: null 필터링이 필요할 때

리스트에 **null이 들어갈 수 있는 경우**에는 그대로 `mapToInt`를 쓰면 NPE가 난다. 이때는 `filter`로 null을 제거한 뒤 변환하면 된다.

```java
List<Integer> list = new ArrayList<>();
list.add(1);
list.add(null);
list.add(3);

// null 제거 후 int[] 로 변환
int[] arr4 = list.stream()
        .filter(i -> i != null)
        .mapToInt(i -> i)
        .toArray();
// 결과: [1, 3]
```

---

## 📋 5️⃣ 정리

| 상황 | 추천 방법 |
|------|-----------|
| 단순 변환, null 없음 | `list.stream().mapToInt(i -> i).toArray()` |
| 변환 로직을 명시하고 싶을 때 | `list.stream().mapToInt(Integer::intValue).toArray()` |
| null이 포함될 수 있을 때 | `filter(i -> i != null)` 후 `mapToInt(i -> i).toArray()` |
| Stream 없이 명시적으로 쓰고 싶을 때 | 반복문 + `list.get(i).intValue()` |

알고리즘 문제에서 **반환 타입이 `int[]`인데 중간에 `List<Integer>`로 처리한 경우** 위 방법 중 하나로 마지막에 배열로 바꿔주면 된다.

---

**참고**  
- [내가 개발자라니 - Integer ArrayList을 int 배열로 변환하는 방법](https://hoehen-flug.tistory.com/49)
