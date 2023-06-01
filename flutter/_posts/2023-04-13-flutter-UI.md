---
layout: post
title: flutter 02 - flutter UI
description: >
  Flutte 개발 전 알아야 된 UI관련 설명과 생명주기에 관한 내용을 담고 있다.
sitemap: false
---

# Flutter UI

## Flutter Layout

- Flutter Layout의 핵심은 <strong>위젯</strong>
    - 위젯은 현재 주어진 상태(데이터)를 기반으로 어떤 UI를 구현할지 정의
        - 플러터 프레임워크는 기존 상태 위젯과 새로운 상태의 위젯을 비교하여 UI변화를 반영
            > 최소한의 리소스로 UI변경을 이룸
    - 레이아웃 모델, 앱 내 이미지, 아이콘, 글자 등 거의 모든 것이 위젯
    - 위젯은 자식을 하나만 갖는 위젯과 자식을 여럿 갖는 위젯으로 나뉨
       - 자식을 하나만 갖는 위젯
            - container 위젯
                - 자식 위젯을 커스터마이징할 수 있는 위젯 클래스
                - 여백, 간격, 테두리, 배경색 등을 추가할 수 있음
                - 나머지 UI는 속성에 의해 제어됨 (color속성, Text.style속성 등)
        - 자식을 여럿 갖는 위젯
            - children 매개변수를 입력 받음
            - 리스트로 여러 위젯을 입력할 수 있음
            - Column 위젯, Row 위젯
                - children 매개변수에 입력된 모든 위젯들을 세로(가로)로 베치
            - ListView 위젯
                - 리스트 구현가능, 입력된 위젯이 화면을 벗어나게 되면 스크롤 가능해짐
    - 예시
        - <figure>
            <image src="/Users/nahyun/Documents/Git/gitBlog/nan0silver.github.io/assets/img/blog/lakes-icons-visual.png">


        - <figure>
            <image src = "/Users/nahyun/Documents/Git/gitBlog/nan0silver.github.io/assets/img/blog/sample-flutter-layout.png">
        

        - 위의 스크린샷에 해당하는 위젯을 구현하기 위한 위젯 트리이다.
<br>

- ❗️Material apps vs Non-Material apps
    - Material apps
        - 플랫 디자인의 장점을 살리면서도 빛에 따른 종이의 그림자 효과를 이요해 입체감을 살리는 디자인방식을 가진 앱
        - 구글에서 사용하고 있는 플랫 디자인 지침
            - 앱마다 다른 디자인을 통일시키기 위함
        - <strong>Scaffold 위젯</strong>
            - 기본적인 material design의 시각적인 레이아웃 구조를 실행한다.

- Scafflod 위젯 vs Container
    - Scafflod
        - 기본적으로 appbar, body라는 2개의 옵션을 가짐
        - <figure>
            <image src = "/Users/nahyun/Documents/Git/gitBlog/nan0silver.github.io/assets/img/blog/flutter-scaffold.webp">
    
    - Container
        - Scafflod의 body부분에 들어가는 부속품
        - 봉지라고 생각하면 됨
        - <span style="color:red">한 개의 자식</span>을 가지는 레이아웃 위젯
        - Container의 생성자는 아래와 같다.
        - <pre><code>Container({
            Key key,
            this.alignment,
            this.padding,
            Color color,
            Decoration decoration,
            this.foregroundDecoration,
            double width,
            double height,
            BoxConstraints constraints,
            this.margin,
            this.transform,
            this.child,
            })</pre></code>
        - 


## Widget의 생명주기

- Stateful Widget의 생명주기
    - stateless widget은 한 번 만들어지면 갱신할 수 없어 생명주기가 없다.
    - stateful widget은 10단계의 생명주기가 있다. 
    <br>
    1. createState()함수
        - 상태를 생성하는 함수
        - 다른 생명주기 함수들이 포함된 State 클래스를 반환
        - StatefulWidget 클래스를 상속받는 클래스는 반드시 이 함수를 호출해야 한다.
        - <pre><code> Class MyHomePage extends StatefulWidget {
            @override
            _MyHomePageState createState() => new _MyHomePageState();
            } </code></pre>
    
    2. mounted == true
        - createState() 함수가 호출되어 상태가 생성되면 mounted 속성이 true가 된다.
            - 위젯을 제어할 수 있는 buildContext클래스에 접근 가능해짐
            - buildContext가 활성화되어야 setState()함수 이용 가능
        
    3. initState()함수
        - 위젯을 초기화하는 함수
        - 주로 데이터 목록을 만들거나 처음 필요한 데이터를 주고받을 때 호출
        - 이 함수를 호출할 때 내부에서 _getJsonData() 함수를 호출하면 서버에서 데이터를 가져와 화면에 출력할 수 있음

    4. didChangeDependencies()함수
        - initState()함수 호출 후, 해당 위젯이 데이터에 의존하는 위젯이라면 반드시 호출해야하는 함수
        - 주로 상속받은 위젯을 사용할 때 피상속자가 변경되면 호출
    
    5. build()함수
        - 위젯을 화면에 렌더링하는 함수 (Widget을 반환한다.)
        - <pre><code> @override
            Widget build(BuildContext context) {
                return MaterialApp(
                    title: 'Flutter Demo',
                    theme: ThemeData(
                        primarySwatch: Colors.blue,
                    ),
                    home: MyHomePage(title: 'Flutter Demo Page'),
                );
            }</code></pre>

    6. didUpdateWidget()함수
        - 부모 위젯이나 데이터가 변경되어 위젯을 갱신해야 할 때 호출하는 함수
        - initState()함수는 위젯을 초기화할 때 한 번만 호출되므로 위젯이 변경되었을 때 이 함수를 호출해야함
    
    7. setState()함수
        - 데이터가 변경되었다는 것을 알려주고 이를 반영하여 화면 UI를 변경하는 함수
        
    8. deactive()함수
        - 위젯의 상태 관리를 중지하는 함수
        - State객체가 플러터 구성 트리에서 제거될 때 호출됨
        - dispose()함수를 호출하기 전까지는 State객체를 재사용할 수 있게 해줌
    
    9. dispose()함수
        - State객체를 영구적으로 소멸할 때 호출되는 함수
        
    10. mounted == false
        - 생명주기를 끝내주는 함수
        - false가 된 다음 이 State는 재사용할 수 없다.

        

