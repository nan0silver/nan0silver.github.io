---
layout: post
title: Algorithm - Linear Time Sorting Algorithm
description: >
 선형 시간이 걸리는 정렬 알고리즘에 대해 알아본다.
sitemap: false
---

# [Algorithm] Linear Time Sorting Algorithm

목차
1. [Counting Sort](#counting-sort)
2. [Radix Sort](#radix-sort)
3. [Order Statistics](#order-statistics)
4. [Randomized Selection](#randomized-selection)
5. [Worst-Case Linear-Time Selection](#worst-case-linear-time-selection)
6. [그외](#그외)

---
  

## Counting Sort

- No comparison sort
- 조건
    - 데이터의 크기 범위가 제한된 경우
    - 데이터의 갯수가 상수개인 경우
- ```c
    CountingSort(A, B, k) {
        for i = 1 to k
            C[i] = 0;
        for j = 1 to n
            C[A[j]] += 1;
        for i = 2 to k
            C[i] = C[i] + C[i-1];
        for j = n downto 1
        //stable하게 만들기 위해 1 to n이 아닌 n to 1 수행
            B[C[A[j]]] = A[j];
            C[A[j]] -= 1;
    }
    ```
- k가 n개 이하일 때 정렬이 가능하다.
    - k가 너무 큰 경우 각 자리수마다 counting sort를 수행하는 방법을 사용할 수 있다. - radix sort
- 시간 복잡도 : $$O(n)$$
- 장점 
    - stable하다
- 단점
    - in-place 알고리즘은 아니다. (extra place 필요)
  

## Radix Sort

- counting sort의 일반 버전
- ```c
    RadixSort(A, d){
        for i=1 to d
            StableSort(A) on digit i 
            //StableSort = counting sort
    }
    ```
- 시간 복잡도 : $$d*O(n)$$
- Radix Sort의 핵심은 stable한 것이다.
- counting sort때문에 in-place하진 않다.
- 자릿수의 최대 값은 $$logn$$이다. 따라서 radix sort가 merge sort보다 빠를 수 있다.
- 한계
    - 길이가 다른 문자열같은 digit이 정확하지 않으면 사용할 수 없다.
   

## Order Statistics

- n개의 요소들 중 i번째로 작은 요소를 고르는 것
- minimun은 첫 번째 order statistic


### Randomized Selection

- quicksort의 partition()을 사용한다.
- 하지만 우리는 오직 하나의 subarray만 평가하면 된다.
- ```c
    RandomizedSelect(A, l, r, k)
        if (l == r) then return A[l];
        p = RandomizedPartition(A, l, r)
        if (p == k) then return A[p];
        if (p < k) then
            return RandomizedSelect(A, l, p-1, k);
        else
            return RandomizedSelect(A, p+1, r, k);
        ```
- 시간 복잡도
    - worst case : $$O(n^2)$$
    - best, average case : $$O(n)$$
  
  
### Worst-Case Linear-Time Selection

- generte a good partitioning element
- Randomized selection에서 pivot value를 고르는데 추가로 $\Theta(n)$시간을 써 업그레이드한 방법
- 알고리즘
    - n개의 element들을 5개씩 묶어 그룹을 만든다.
    - 각 그룹의 중간값을 찾는다. -> $$O(const)$$
    - Select()를 재귀적으로 사용해 n/5개의 중간값 x를 찾는다.
        - $$n/5 + n/25 + n/125 + ... < n$$
    - x를 중심으로 partition을 진행한다.
- 시간 복잡도 : $$O(n)$$
- Quick sort에서도 해당 알고리즘을 이용해 worst case의 시간복잡도를 $$O(nlogn)$$으로 만들 수 있다.
    - 하지만 이 경우 pivot value를 찾는 과정에서 캐쉬가 한번 뒤집혀져 quick sort의 장점 중 하나인 cache friendly 장점이 사라진다.
    - 차라리 merge sort나 heap sort를 사용한다.
  
### 그외 

- Insertion sort
    - $$O(n^2)$$ 
- Merge sort, Heap sort, Quick sort
    - comparison sort
    - all comparison sorts are $$\Omega(nlogn)$$