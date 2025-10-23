---
layout: post
title: Algorithm - 코테에서 많이 사용하는 JAVA Collections 모음집
description: >
  코딩테스트 대비 JAVA Collections의 사용처 및 메서드를 정리해보았습니다.
sitemap: false
---

# [Algorithm] 코테에서 자주 쓰이는 Collection 모음

1. [HashMap](#️-1️⃣-hashmapk-v--key-value-형태로-빠르게-찾고-세는-용도)
2. [HashSet](#-2️⃣-hashset--중복-없는-데이터-저장)
3. [ArrayList](#-3️⃣-arraylist--순서-있는-리스트-인덱스-접근-가능)
4. [PriorityQueue](#-4️⃣-priorityqueue--우선순위-큐-힙)
5. [Stack / Queue](#-5️⃣-stack--queue-deque--선형-구조)
6. [Collections / Arrays](#-6️⃣-collections--arrays-유틸리티-메서드)
7. [추천 연습문제 유형별 활용 예시](#-추천-연습문제-유형별-활용-예시)

---

## 🗂️ 1️⃣ HashMap<K, V> — key-value 형태로 빠르게 찾고 세는 용도

### 💡 핵심 활용 상황

- “이 값이 몇 번 나왔는가?”
- “이 key가 이미 존재하나?”
- “카테고리별 개수 세기 (위장 문제 등)”

### 🚀 자주 쓰는 메서드

| 메서드                              | 설명                   | 예시 코드                                              |
| ----------------------------------- | ---------------------- | ------------------------------------------------------ |
| `put(K key, V value)`               | 값 삽입 (덮어씀)       | `map.put("apple", 3);`                                 |
| `get(K key)`                        | key로 value 조회       | `int v = map.get("apple");`                            |
| `getOrDefault(K key, V defaultVal)` | key 없으면 기본값 반환 | `map.getOrDefault("pear", 0);`                         |
| `containsKey(K key)`                | key 존재 여부          | `if (map.containsKey("apple"))`                        |
| `remove(K key)`                     | key/value 쌍 삭제      | `map.remove("apple");`                                 |
| `keySet()`                          | 모든 key 조회          | `for (String k : map.keySet())`                        |
| `values()`                          | 모든 value 조회        | `for (int v : map.values())`                           |
| `entrySet()`                        | key+value 동시 접근    | `for (Map.Entry<String, Integer> e : map.entrySet()) { |

     System.out.println(e.getKey() + " → " + e.getValue());

}`|
|`size()`| 원소 수 |`map.size();`|
|`clear()`| 모두 삭제 |`map.clear();` |

---

## 🧩 2️⃣ HashSet — 중복 없는 데이터 저장

### 💡 핵심 활용 상황

- “이미 나온 적 있는 값인가?”
- “교집합, 중복 제거”
- “전화번호부 접두사, 참가자 중 완주 못한 사람 찾기 등”

### 🚀 자주 쓰는 메서드

| 메서드          | 설명                 | 예시 코드                                     |
| --------------- | -------------------- | --------------------------------------------- |
| `add(E e)`      | 원소 추가            | `set.add("apple");`                           |
| `contains(E e)` | 포함 여부 확인       | `if (set.contains("apple"))`                  |
| `remove(E e)`   | 원소 삭제            | `set.remove("apple");`                        |
| `size()`        | 원소 개수            | `set.size();`                                 |
| `clear()`       | 모두 삭제            | `set.clear();`                                |
| `isEmpty()`     | 비었는지 확인        | `if (set.isEmpty())`                          |
| `iterator()`    | 순회용 Iterator 생성 | `for (String s : set) System.out.println(s);` |

or
`Iterator<String> it = set.iterator();
while (it.hasNext()) {
      System.out.println(it.next());
}` |

> 💡 참고: HashSet은 내부적으로 HashMap을 사용하므로 add, contains 모두 O(1)입니다.

---

## 📋 3️⃣ ArrayList — 순서 있는 리스트 (인덱스 접근 가능)

### 💡 핵심 활용 상황

- “순차적 접근”, “정렬”, “조합/순열 저장”
- BFS/DFS에서 방문 순서 저장 등

### 🚀 자주 쓰는 메서드

| 메서드                          | 설명              | 예시 코드                                    |
| ------------------------------- | ----------------- | -------------------------------------------- |
| `add(E e)`                      | 끝에 추가         | `list.add(5);`                               |
| `add(int idx, E e)`             | 인덱스에 삽입     | `list.add(1, 10);`                           |
| `get(int idx)`                  | 특정 인덱스 조회  | `list.get(0);`                               |
| `set(int idx, E e)`             | 특정 위치 값 수정 | `list.set(2, 99);`                           |
| `remove(int idx)`               | 인덱스로 삭제     | `list.remove(1);`                            |
| `contains(E e)`                 | 포함 여부         | `if (list.contains(5))`                      |
| `size()`                        | 크기 확인         | `list.size();`                               |
| `clear()`                       | 모두 삭제         | `list.clear();`                              |
| `sort(Comparator<? super E> c)` | 정렬              | `Arrays.sort(arr, new Comparator<String>() { |

            @Override
            public int compare(String o1, String o2) {
                if (o1.length()==o2.length()) {
                    return o1.compareTo(o2);
                } else {
                    return o1.length()-o2.length();
                }}});` |

---

## 🧮 4️⃣ PriorityQueue — 우선순위 큐 (힙)

### 💡 핵심 활용 상황

- “가장 작은/큰 값”을 반복적으로 꺼낼 때 (Dijkstra, HeapSort, 스케줄링 문제 등)

### 🚀 자주 쓰는 메서드

| 메서드      | 설명                         | 예시 코드              |
| ----------- | ---------------------------- | ---------------------- |
| `add(E e)`  | 원소 추가                    | `pq.add(10);`          |
| `peek()`    | 최상단 원소 확인(삭제 안 함) | `int top = pq.peek();` |
| `poll()`    | 최상단 원소 꺼내기           | `int top = pq.poll();` |
| `isEmpty()` | 비었는지 확인                | `if (pq.isEmpty())`    |

> 💡 디폴트는 오름차순(최소 힙) → 작은 숫자가 먼저 나옴
>
> 내림차순은 `new PriorityQueue<>(Collections.reverseOrder());`

---

## 🧰 5️⃣ Stack / Queue (Deque) — 선형 구조

### 💡 Queue

```java
Queue<Integer> q = new LinkedList<>();
```

### 💡 Stack (Deque로 대체 권장)

```java
Deque<Integer> stack = new ArrayDeque<>();
```

---

## 💎 6️⃣ Collections / Arrays 유틸리티 메서드

| 클래스                      | 메서드      | 설명 |
| --------------------------- | ----------- | ---- |
| `Collections.sort(list)`    | 리스트 정렬 |      |
| `Collections.reverse(list)` | 역순 정렬   |      |
| `Collections.max(list)`     | 최댓값      |      |
| `Collections.min(list)`     | 최솟값      |      |
| `Arrays.sort(arr)`          | 배열 정렬   |      |
| `Arrays.equals(arr1, arr2)` | 배열 비교   |      |
| `Arrays.toString(arr)`      | 배열 출력용 |      |

---

## 📘 추천 연습문제 유형별 활용 예시

| 유형                               | 핵심 자료구조/메서드              | 예시 문제                          |
| ---------------------------------- | --------------------------------- | ---------------------------------- |
| Hash (중복, 완주하지 못한 선수 등) | `HashMap`, `HashSet`              | `map.getOrDefault`, `set.contains` |
| Stack/Queue                        | `Deque`, `LinkedList`             | 괄호 검사, 기능개발                |
| 정렬                               | `Arrays.sort`, `Collections.sort` | H-index, K번째 수                  |
| 이중 루프 회피                     | `HashMap` lookup                  | 전화번호 목록                      |
| 우선순위 문제                      | `PriorityQueue`                   | 더 맵게, 디스크 컨트롤러           |
| 그래프/BFS/DFS                     | `Queue`, `ArrayList`              | 미로 탐색, 네트워크                |

---
