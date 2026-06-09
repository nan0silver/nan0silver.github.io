---
redirect_from:
  - /java/2025-02-04-serialization/
layout: post
title: 직렬화 (Serialization)와 역직렬화(Deserialization)
description: >
  직렬화 (Serialization)와 역직렬화(Deserialization)에 대해 알아보자.
sitemap: false
---

# [Etc] 직렬화 (Serialization)와 역직렬화(Deserialization)

- [직렬화와 역직렬화](#직렬화serialization과-역직렬화deserialization--️-)
- [직렬화란? 📦](#직렬화-serialization-이란-)
- [역직렬화란? 📦 ➡️ 💻](#역직렬화-deserialization-이란--️-)
- [언어별 직렬화 및 역직렬화 예시](#언어별-직렬화-및-역직렬화-예시)

---

## 직렬화(Serialization)과 역직렬화(Deserialization) 💾 ➡️ 💻

- **직렬화**
  - 프로그램에서 사용하는 데이터를 파일이나 네트워크를 통해 전송하거나 저장하기 쉬운 형태로 변환하는 과정
- **역직렬화**
  - 그 반대로, 저장되거나 전송된 데이터를 다시 프로그램에서 사용할 수 있는 원래의 데이터 형태로 복원하는 과정

## 직렬화 (Serialization) 이란? 📦

**직렬화**는 메모리 상에 있는 객체나 데이터 구조를 바이트 스트림 형태로 변환하는 것을 의미한다.

> 마치 택배 상자에 물건을 포장하는 것처럼, 데이터를 "직렬" 형태로 나열하여 보관하거나 전송하기 좋게 만드는 것.

- **주요 목적**:

  - **데이터 저장**: 객체의 상태를 파일이나 데이터베이스에 저장하여 영구적으로 보관 💾
  - **데이터 전송**: 네트워크를 통해 객체를 다른 시스템으로 전송 🌐
  - **원격 호출 (RPC, RMI)**: 객체를 네트워크를 통해 다른 시스템의 메소드 인자로 전달 📞

- **예시**:
  - 객체를 JSON이나 XML 형태로 변환하여 텍스트 파일에 저장
  - 객체를 바이너리 형태로 변환하여 네트워크 소켓을 통해 전송

## 역직렬화 (Deserialization) 이란? 📦 ➡️ 💻

**역직렬화**는 직렬화된 바이트 스트림을 다시 원래의 객체나 데이터 구조로 복원하는 과정

> 택배 상자를 열어 내용물을 꺼내는 것과 비슷하게, 직렬화된 데이터를 "역으로 직렬"화하여 프로그램이 이해할 수 있는 형태로 되돌리는 것.

- **주요 목적**:

  - **저장된 데이터 로드**: 파일이나 데이터베이스에서 직렬화된 객체를 읽어와 메모리에 복원 💾 ➡️ 💻
  - **전송된 데이터 수신**: 네트워크를 통해 수신된 직렬화된 데이터를 객체로 변환 🌐 ➡️ 💻
  - **원격 호출 결과 처리**: 원격 시스템으로부터 직렬화된 객체 형태로 결과를 받아 원래 객체로 복원 📞 ➡️ 💻

- **예시**:
  - JSON이나 XML 텍스트 파일을 읽어 객체로 복원
  - 바이너리 데이터를 네트워크 소켓으로부터 읽어 객체로 복원

## 언어별 직렬화 및 역직렬화 예시

### JavaScripnt (Node.js)

JavaScript에서는 기본적으로 JSON 객체를 사용하여 직렬화 및 역직렬화를 많이 수행

- 바이너리 직렬화는 Buffer 객체 등을 활용해야 합니다.

```javascript
// 직렬화 (Serialization)
const data = { name: "David", city: "Seoul" };
const jsonString = JSON.stringify(data); // 📦 -> JSON String
console.log(jsonString); // {"name":"David","city":"Seoul"}

// 역직렬화 (Deserialization)
const loadedData = JSON.parse(jsonString); // JSON String -> 📦 -> 💻
console.log(loadedData); // { name: 'David', city: 'Seoul' }
```

### Python

Python에서는 `pickle` 모듈을 사용하여 직렬화 및 역직렬화를 기본적으로 지원한다.

- JSON, `marshal` 등 다양한 모듈도 활용 가능

```python
    import pickle

    # 직렬화 (Serialization)
    data = {'name': 'Alice', 'age': 30}
    with open('data.pickle', 'wb') as f:
        pickle.dump(data, f) # 📦 -> 💾

    # 역직렬화 (Deserialization)
    with open('data.pickle', 'rb') as f:
        loaded_data = pickle.load(f) # 💾 -> 📦 -> 💻
    print(loaded_data) # {'name': 'Alice', 'age': 30}
```

### Java

Java는 `java.io.Serializable` 인터페이스를 구현한 클래스에 대해 직렬화를 기본적으로 지원합니다.

- JSON 라이브러리 (Jackson, Gson 등)를 사용하여 JSON 직렬화/역직렬화도 많이 사용됨.

```java
import java.io.*;

class Person implements Serializable {
    String name;
    int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public String toString() {
        return "Person{name='" + name + "', age=" + age + '}';
    }
}

public class SerializationExample {
    public static void main(String[] args) {
        // 직렬화 (Serialization)
        Person person = new Person("Bob", 25);
        try (FileOutputStream fileOut = new FileOutputStream("person.ser");
             ObjectOutputStream out = new ObjectOutputStream(fileOut)) {
            out.writeObject(person); // 📦 -> 💾
            System.out.println("Serialized data is saved in person.ser");
        } catch (IOException i) {
            i.printStackTrace();
        }

        // 역직렬화 (Deserialization)
        Person loadedPerson = null;
        try (FileInputStream fileIn = new FileInputStream("person.ser");
             ObjectInputStream in = new ObjectInputStream(fileIn)) {
            loadedPerson = (Person) in.readObject(); // 💾 -> 📦 -> 💻
        } catch (IOException i) {
            i.printStackTrace();
            return;
        } catch (ClassNotFoundException c) {
            System.out.println("Person class not found");
            c.printStackTrace();
            return;
        }
        System.out.println("Deserialized Person: " + loadedPerson); // Deserialized Person: Person{name='Bob', age=25}
    }
}
```

### Kotlin

Kotlin은 Java와 유사하게 `java.io.Serializable` 인터페이스를 사용하거나, Jackson, Gson 같은 JSON 라이브러리를 활용

- Kotlin Serialization library를 사용하여 더 간편하게 직렬화/역직렬화를 할 수도 있음

```kotlin
    import kotlinx.serialization.*
    import kotlinx.serialization.json.*
    import java.io.*

    @Serializable
    data class User(val name: String, val age: Int)

    fun main() {
        // 직렬화 (Serialization)
        val user = User("Eve", 28)
        val json = Json.encodeToString(User.serializer(), user) # 📦 -> JSON String
        println(json) # {"name":"Eve","age":28}

        // 역직렬화 (Deserialization)
        val loadedUser = Json.decodeFromString(User.serializer(), json) # JSON String -> 📦 -> 💻
        println(loadedUser) # User(name=Eve, age=28)


        // Java Serializable 사용 (Java와 동일)
        // ... (Java 예시 코드와 유사)
    }
```
