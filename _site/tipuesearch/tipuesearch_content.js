var tipuesearch = {"pages": [{
    "title": "[AWS] AWS 기초",
    "text": "AWS의 주요 서비스를 실무에서 어떻게 활용하는가 내가 만든 백엔드 포트폴리오를 AWS 주요 인프라에 배포 내가 지원할 회사에서 쓰는 서비스를 곁들인 목차 S3 &amp; Cloudfront 소개 실무 활용 사례 part1 이미지 리사이징 권한 관리 내가 지원한 회사 채용공고 뜯어보기 실무 활용 사례 part2 CPA Glue &amp; Athena 를 통한 Data Lake 구축 수업 목표 AWS가 무엇인지 설명할 수 있다 S3의 주요 기능 및 활용 방안을 설명할 수 있다. 지원하고 싶은 회사의 지원 공고 뜯어보기 AWS Amazon Web Service 클라우드 컴퓨팅 플랫폼 AWS 계정 만들어보기 AWS Cloud Practitioner Essentials (Korean) Cloud Practitioner 자격증 있음 공부하는 것 추천함 (따는건 비쌈) 큰 회사에서는 AWS 자격증이 크게 상관없겠지만, 작은 회사에서는 AWS역량이 필수적 클라우드 컴퓨팅 인터넷을 통해 IT리소스(서버, 스토리지, 데이터베이스, 네트워킹 등)를 제공하고 관리하는 서비스 특징 확장성 (Scalability) 사용자가 필요에 따라 리소스를 쉽게 확장, 축소 가능 블랙 프라이데이에는 몇 배의 트래픽이 몰림. 이때마다 하드웨어를 사용하는건 비효율적, 이때만 자원을 사용하고 끝나면 반납할 수 있음 유연성 (Flexibility) 다양한 IT 환경에 맞춰 손쉽게 맞춤화 가능 자바스크립트로 백엔드 많이 사용 비용 효율성 (Cost Efficiency) 초기 자본 투자 없이, 사용한 만큼 지불하는 비용 구조 가용성 높은 가용성과 자동 백업, 복구 기능으로 서비스 중간 최소화 람다 서비스를 처음 띄울 때 서울 4개의 구역에 띄워놓을 수 있음. 한 개의 구역에 오류가 나도 다른 구역에서는 잘 쓸 수 있음. S3 Simple Storage Service AWS 최초의 서비스 클라우드 파일 저장소 AWS 사용하고 있는 회사라면 99%의 확률로 활용하고 있음 기본 개념 버킷 (Bucket) S3에서 데이터를 저장하는 컨테이너 모든 S3객체는 반드시 하나의 버킷에 속해 있음 S3 스토리지의 최상위 계층이며, 사용자가 데이터를 저장하고 관리할 수 있는 폴더와 비슷 컴퓨터에서 C드라이브와 비슷한 느낌 각 버킷은 고유한 이름을 가짐(전세걔 유일) 데이터 저장 위치(region), 권한 설정, 버전 관리, 수명 주기 정책 등 관리 가능 Key S3버킷 내 객체(파일)를 고유하게 식별하는 문자열 버킷 내 키는 객체의 “경로”로 생각 가능 디렉토리 구조를 흉내낼 수 있도록 설계됨 그냥 전체가 하나의 키임 사용 방법 AWS Console AWS Cli FTP 프로그램 file transfer protocol 사이버덕, 파일질라 Cloudfront AWS CDN 서비스 Contents Delivery Network 인터넷 사용자에게 웹 콘텐츠를 빠르고 효율적으로 제공하기 위해 설계된 분산형 서버 네트워크 S3를 비롯한 AWS의 다른 서비스와 연동이 쉬움 AWS를 사용하는 회사라면 99% 사용 S3는 저장에 특화, Cloudfront는 전송에 특화 S3는 직접 접근으로 주로 내부 사용자나 제한된 사용자들에게 제공을 많이함 하지만 Cloudfront는 CDN을 통해 접근하기때문에 속도도 빠르고 캐싱도 됨 S3 1GB당 약 0.117$, Cloudfront 1GB당 0.095$ CloudFront는 약정 계약이 가능 이미지 리사이즈 대역폭 및 비용 감소할 수 있음 첫 번째 AWS 활용 포트폴리오 S3에 이미지가 업로드 되면 자동적으로 원하는 크기로 리사이징하여 저장하는 방법 원하는 사이즈의 이미지를 실시간으로 생성하는 방법 본인이 자신있는 프로그래밍 언어를 선택하여 AWS Lambda 기능을 활용해서 작성 ‘aws cloudfront 이미지 리사이징’ 구글 검색 실무 활용 사례 -보안 민감정보 보호 방법 Signed URL 특정 사용자에게만 접근 권한을 부여하기 위해 URL에 만료 시간과 암호화된 서명을 포함한 URL Signed Cookie 특정 조건을 만족하는 사용자만 CloudFront를 통해 콘텐츠에 접근할 수 있도록 설정하는 보안 메커니즘 S3 hosting &amp; CloudFront S3는 서버사이트 스크립팅(PHP, Python등)이 필요없는 정적 웹사이트에 최적 설정이 간단하고 관리가 쉬움 서버 관리가 필요 없으며 AWS에서 모든 인프라를 관리 CPA Cost Per Action 광고주와 퍼블리셔를 연결하는 플랫폼이라면 이 모델에서 광고주는 특정 행동을 기준으로 퍼블리셔 비용 지불 EC2 (Elastic Compute Cloud) 개발자가 클라우드 컴퓨팅 작업을 할 수 있도록 설계된 서비스 가상화된 서버를 하나의 인스턴스 형태로 제공하며, 컴퓨팅 요구사항에 맞게 용량 조절 가능 IDC Internet Data Center 물리적 인프라를 제공하는 시설 리전 (Region) 물리적으로 분리된 지리적 위치 각 리전은 여러 개의 데이터 센터(Availability Zone, AZ)로 구성되어 있음 리전 간 데이터 전송은 네트워크 지연 시간(latency)이 발생할 수 있음 각 리전은 법적, 규제 요구 사항을 충족하도록 설계됨 Availability Zone 리전 내에서 독립적으로 운영되는 데이터 센터 각 AZ는 하나 이상의 데이터 센터로 구성되어 있음 VPC (가상 사설 네트워크) Virtual Private Cloud 네트워크 2개 이상의 컴퓨터나 장치가 서로 데이터를 주고 받을 수 있도록 연결된 시스템 사설 공개되지 않은, 외부와 분리되느 특정 사용자나 조직만 접근할 수 있는 가상 물리적인 하드웨어 장비나 네트워크 인프라 없이, 소프트웨어를 통해 논리적으로 격리 주요 용어 A대학교 캠퍼스를 예시로 했을 때 퍼블릭 서브넷 Public Subnet public : 인터넷과 직접 연결되어있다. subnet : sub + network, 하나의 네트워크를 더 작은 단위의 네트워크로 (부분 집합) 중앙 운동장, 도서관, 기념품샵 등등 프라이빗 서브넷 Private Subnet 인터넷과 직접 연결되어있지 않다. 교수 연구실, 실험실 (아무나 못들어가는) 라우팅 / 라우팅 테이블 Routing Table 라우팅 : 경로, 네트워크 내에서 데이터가 이동할 경로를 결정 캠퍼스 내 길 / 길 안내 지도 인터넷 게이트웨이 학교 정문 NAT 게이트웨이 Network Address Translation Network Address : IP주소 (Internet Protocol) 네트워크 상에서 각 장치를 식별하기 위해 사용되는 고유한 숫자 주소 내부 네트워크의 사설 IP 주소를 공용 IP주소로 변환 경비실, 차량 차단기, 보안 검사대 네트워크 ACL (Access Control List) 전체 구역 통제 시스템 서브넷 단위 Stateless, 상태 비기반, 독립적인 제어 들어올 때도 검사하고 나갈때도 검사함 우선순위가 있음 차단기의 정책, 비행기 탈 때와 비슷 보안 그룹 (Security Group) 개별 사무실 출입 통제 시스템 기본적으로 모든 트래픽은 차단하며 허용 규칙만 있음 stateful, 상태 기반 (신분증 제출하고 출입증 받아가는 느낌) 라우팅 테이블에 인터넷 게이트웨이랑 퍼블릭 서브넷이 연결 반대로 생각하면 퍼블릭 서브넷과 프라이빗 서브넷을 구분짓는 중요한 요소가 됨 주의 사항 AWS에서 처음으로 제공해주는 VPC는 가급적으로 사용하지 말자 람다를 private 서브에 올리고 nat를 사용하는 것을 추천 람다는 실행할 때마다 ip가 바뀜, 문제가 될 수 있음",
    "tags": "java",
    "url": "/java/2024-09-02-aws/"
  },{
    "title": "[JAVA] StringBuilder",
    "text": "목차 String StringBuilder String 반복적으로 String을 연결하거나, 수정해야 할 경우, 보통은 아래와 같은 경우로 string을 사용한다. java public class Main{ public static void main(String[] args) { String java = \"자바\"; java += \"공부\"; System.out.println(java); } } 하지만 string은 불변(immutable)객체이므로, “자바”메모리에 “공부”가 추가되는 것이 아니라, 새로운 메모리에 “자바공부”가 저장됨 문자열이 수정될 때마다 새로운 메모리를 할당받기 때문에 성능저하가 일어날 수 있음 StringBuilder StringBuilder는 mutable sequence of characters. 문자열이 변경될 때마다 새로운 메모리를 할당받지 않고, 버퍼를 통해 문자열을 관리하다 toStirng()을 통해 Stirng 객체를 생성 StringBuilder가 효율적인 경우 문자열의 반복적인 연결 문자열의 잦은 수정 대량의 문자열을 처리할 때 단점 StringBuilder는 thread-safe하지 않아 멀티쓰레드 환경에서 좋지 않다. 멀티쓰레스 환경에서는 StringBuffer를 추천 StringBuffer는 StringBuilder와 동일한 API를 사용하지만 각각의 메소드에 대해 동기화를 보장하기 때문 String보다는 빠르고 StirngBuilder보다는 느림",
    "tags": "java",
    "url": "/java/2024-08-29-stringbuilder/"
  },{
    "title": "[Code Challenge] 서로소 집합과 유니온 파인드",
    "text": "목차 서로소 집합 유니온 파인드 1) 유니온 파인드의 자료구조 2) 유니온 파인드의 예시 트리와 관련된 용어들 루트 노드, 자식노드, 부모노드, 서브트리, 리프노드, 깊이 이 이미지에서 깊이는 5 이진트리 자식 노드가 2개씩 있는 트리 서로소 집합 서로 공통된 원소를 가지고 있지 않은 두 개 이상의 집합 분리 집합 (Disjoint Set)이라고도 부름 사용 용도 서로 다른 원소들이 같은 집합에 속해있는지, 아닌지 판별할 때 사용 사이클이 존재하는지 판별할때 사용 Union-Find 자료구조로 서로소 집합을 표현 유니온 파인드가 다른 고급 알고리즘의 베이스가 됨 (Kruskal Algorithm) 유니온 파인드 유니온 파인드(Union-Find)의 자료구조 init, find, merge(union) 함수들의 형태로 보통 이루어짐 함수명 고정 X init 초기화 함수 Parent 배열에 대해 자신의 인덱스 값을 가지도록 초기화 초기에 자신의 부모 노드는 자신이라는 의미 - java void init() { for (int i = 1; i &lt;= n; ++i) { parent[i] = i; } } find 자신의 부모 노드를 찾는 함수 재귀 함수로 구현됨 자기 자신을 가리키는 인덱스 (루트 노드)를 찾을 때까지 반복 int find_parent1(int x) { return x == parent[x] ? x : find_parent1(parent[x]); } int find_parent2(int x) { if (x == parent[x]) return x; else return parent[x] = find_parent2(parent[x]); } // memoization을 사용하는 2가 더 빠름 merge 두 노드를 하나의 집합으로 합치는 함수 y의 부모 노드는 x - find 함수를 같이 사용 - if 문에서 x == y이면? 사이클이 발생하는 경우이므로 제외 - ```java void merge_parent(int x, int y) { int x = find_parent(x); int y = find_parent(y); if (x != y) parent[y] = x; } ``` 유니온 파인드의 예시 최종적으로 오직 루트 노드만이 자기 자신을 가리키게 됨 이러한 특서으로 루트 노드 찾을 수 있음",
    "tags": "algorithm",
    "url": "/algorithm/2024-07-18-day9/"
  },{
    "title": "[JAVA] 키보드로 사용자 입력받는 2가지 방법 (BufferdReader, Scanner)",
    "text": "목차 BufferReader, InputStreamReader, System.in Scanner 1. BufferdReader, InputStreamReader, System.in System.in 일반적으로 keyboard 입력을 지칭하는 Standard Input Stream InputStreamReader byte stream을 character stream으로 변경해주는 역할 수행 InputStreamReader 클래스는 생성자의 파라미터로 InputStream 객체를 전달받음 이 InputStream 객체의 종류에 따라 키보드 사용자 입력을 읽어들일수도 있고, 파일 내용을 읽어들일 수도 있음 사용법 InputstreamReader (InputStream in) InputstreamReader (InputStream in, String charsetName) InputstreamReader (InputStream in, Charset cs) InputstreamReader (InputStream in, CharsetDecoder dec) 생성자의 파라미터로 charset 정보를 전달받아 읽어들이는 stream의 charset을 지정할 수도 있음 BufferedReader 효율적으로 문자를 읽어들이기 위해 버퍼링을 해줌 버퍼링 (Buffering) 효율적인 데이터 처리를 위해 중간 저장공간(Buffer)을 사용하는 것 (주로 입출력에서 사용) 디스크 접근은 시간이 오래걸리기 때문에 한번에 데이터를 저장하여 시간을 줄이고, 필요할 때마다 데이터를 읽음 I/O작업은 시간이 많이 걸리기 때문에 버퍼링으로 접근횟수를 줄여 효율적으로 데이터 사용이 가능 기본 버퍼 사이즈를 그대로 이용할 수도, 생성자를 이용해 버퍼 사이즈를 지정할 수도 있음 보통 FileReader, InputStreamReader의 read()와 같이 비용이 많이 드는 Reader를 파라미터로 전달받아 사용함 만약 BufferedReader없이 FileReader나 InputStreamReader를 사용하면 시스템은 바이트별로 사용자의 입력을 받아서 처리하는 동작을 반복함 시스템에서 IO는 자원소모가 많음 하지만 BufferReader를 사용하면, 시스템은 버퍼가 비어있을 때만, 실제 IO를 일으켜서 데이터를 읽어오고, 나머지 경우에는 메모리에 있는 버퍼의 데이터를 읽어서 처리함 데이터를 문자열로 받아오기 때문에, 적절히 데이터를 처리 후 사용해야 한다. BufferdReader, InputStreamReader, System.in를 이용한 예제 import java.io.BufferedReader; import java.io.IOException; import java.io.InputStreamReader; public class UserInput { public static void main(String[] args) throws IOExceptio{ //키보드 사용자 입력을 받을 수 있는 객체 생성 BufferedReader reader = new BufferedReader(new InputStreamReader(System.in)); // 입력 데이터 읽기 (한 줄) String str = reader.readLine(); // 입력 데이터 출력 System.out.println(str); } } 2. Scanner Scanner 클래스를 이용하면 1번 방법보다 더 쉽게 사용자 키보드 입력을 받을 수 있음 입력받은 데이터를 Scanner클래스 메소드를 사용해 더 쉽게 가공 가능 예제 import java.util.Scanner; public class ScannerLoop { public static void main(String[] args) { // Scanner 선언 Scanner scanner = new Scanner(System.in); //다음으로 읽어들일 token이 있는지 체크 while (scanner.hasNext()) { //token별로 입력값을 읽어 String을 리턴 String str = scanner.next(); System.out.println(str); } scanner.close(); } } token(공백)별로 사용자 입력값을 읽어들이는 예제",
    "tags": "java",
    "url": "/java/2024-07-17-day8/"
  },{
    "title": "[Code Challenge] 동적 계획법",
    "text": "목차 Dynamic Programming 정의 DP의 종류 DP 사용조건 DP 유의점 동적 계획법 (DP, Dynamic Programming) 예시 문제 1 1000원짜리 커피를 500원짜리 동전과 100원짜리 동전만 사용하여 계산하려고 한다. 동전을 가장 적게 사용하여 계산하려고 할 때, 필요한 동전의 최소 개수는? (단, 동전은 무수히 많다.) Solution (500 * 2) VS (500 * 1 + 100 * 5) VS (100 * 10) 그리디 알고리즘으로 해결 가능 예시 문제 2 23원짜리 커피를 5원짜리 동전과 2원짜리 동전만 사용하여 계산하려고 한다. 동전을 가장 적게 사용하여 계산하려고 할 때, 필요한 동전의 최소 개수는? (단, 동전은 무수히 많다.) Solution 그리디 알고리즘으로 해결 불가능 그리디 알고리즘을 적용할 수 잇는 조건 중 하나인 최적 부분 구조 조건을 만족하지 않기 때문 지역적으로 최적이 전역적으로도 최적이 아님 Dynamic Programming 정의 이전에 계산한 값을 재사용하여, 하나의 문제를 한 번만 풀게 하는 알고리즘 패러다임 Divide &amp; Conquer과 비슷하지만, 중간 결과를 저장하여 효율성을 높인다는 점에서 차이 이전에 계산해둔 값을 메모리(배열 등)에 저장해서 반복 작업을 줄이는 기법이 핵심 하위 문제의 결과를 먼저 저장하고, 이를 나중에 필요할 때 사용 Tabulation(botton-up), Memoization(top-down) DP의 종류 Top-Down DP 가장 큰 문제부터 풀기 시작하여, 작은 문제들을 재귀적으로 호출하여 답을 구하는 방식 주로 재귀를 통해 해결 ${\\color{yellow}메모이제이션(Memoization)}$을 활용하여 복잡도를 줄임 예시 int fibo(int n) { if (n &lt;= 2 ) return 1; int &amp;ret = dp[n] if (ret != -1) return ret; return ret = fibo(n-1) + fibo(n-2) } Botton-Up DP 작은 문제들을 먼저 풀기 시작하여, 최종적으로 가장 큰 문제들을 해결하는 방식 주로 반복문을 통해 해결 ${\\color{yellow}점화식과 기저사례}$(base case)가 필요 -&gt; ${\\color{yellow}Tabulation}$ 예시 for (int i = 2; i &lt;= 40; ++i) { dp[i] = dp[i-1] + dp[i-2]; } //점화식 DP 사용 조건 겹치는 부분(작은) 문제 (Overlapping Subproblem) 어떠한 문제가 여러 개의 부분(하위) 문제(subproblem)으로 쪼갤 수 있을 대 사용 최적 부분 구조 (Optimal Substructure) 문제의 정답을 작은 문제의 정답에서 구할 수 있을 때 사용 예시 N번째 피보나치 수를 구하는 문제 N-1번째 피보나치 수를 구하는 문제, N-2번째 피보나치 수를 구하는 문제로 쪼갤 수 있음 문제의 정답을 하위 문제의 정답의 합으로 구할 수 있음 재귀로 풀 때 O(2^N) 이미 구했던 값도 다시 계산해야 함 시간 초과 발생 빛 stack overflow 가능성이 높음 반복문으로 풀 때 O(N) 기저사례와 점화식으로 구현 DP 유의점 복잡한 문제의 경우, 점화식을 직접 계산해서 구해야 한다.",
    "tags": "algorithm",
    "url": "/algorithm/2024-07-16-day7/"
  },{
    "title": "[Code Challenge] 너비 우선 탐색 &amp; 다익스트라 알고리즘",
    "text": "목차 너비 우선 탐색 BFS 다익스트라 Dijkstra 알고리즘 너비 우선 탐색 (BFS) BFS (Breadth First Search) 하나의 정점으로부터 시작하여 차례대로 모든 정점들을 한 번씩 방문하는 것 루트 노드 (혹은 다른 임의의 노드)에서 시작해서 인접한 노드를 먼저 탐색하는 방법 두 노드 사이의 최단 경로 혹은 임의의 경로를 찾고 싶을 때 사용 BFS의 특징 재귀적으로 동작하는 DFS와 달리, BFS는 주로 큐(Queue) 사용 사이클이 있는 경우, 무한 루프에 빠지지 않도록 방문하는 방문 체크를 해주어야 함 물웅덩이에 돌멩이를 하나 던지면, 파동이 전체 방향으로 퍼져나가는 동심원의 형태로 탐색이 진행 BFS의 동작 순서 BFS의 구현 빈 큐 q 및 visited 배열 생성 시작 노드 ‘st’를 큐 q에 삽입 노드 ‘st’를 방문한 것으로 표시 큐 q가 비어있지 않은 동안 다음을 반복 : 큐의 맨 앞에서 요소를 꺼내 ‘now’에 저장 큐의 맨 앞의 요소를 제거 ‘now’의 값을 출력하고 뒤에 공백을 붙임 노드 ‘now’의 인접 리스트 v에서 각 이웃 ‘next’에 대해 만약 ‘next’가 아직 방문하지 않은 노드인 경우 : 노드 ‘next’를 방문한 것으로 표시 ‘next’를 큐 q에 넣음 BFS의 시간복잡도 V : 정점(노드)의 수, E : 간선의 수 인접 리스트로 표현된 그래프 O(V+E) 인접 행렬로 표현된 그래프 O(V^2) DFS와 BFS의 공통점과 차이점 공통점 그래프에서 시작 노드로부터 목적지 노드까지 도달하거니 특정 정보를 찾는 것이 목표 방문 기록을 체크해 이미 방문한 노드를 다시 방문하지 않게 하여 무한 루프 방지 DFS, BFS 두 방식 모드 조건 내의 모든 노드를 검색한다는 점에서 시간 복잡도는 동일 차이점 DFS는 주로 재귀로 구현하지만, BFS는 큐(queue) 자료구조를 활용하여 구현 일반적으로 DFS보다 BFS가 조금 더 빠르게 동작 동작 순서 상 DFS는 트리를 탐색할 때 자주 사용, BFS는 최단 경로 탐색에서 자주 사용 시간 복잡도 주어진 그래프의 구조와 시작 노드에 따라서 실제 시간 복잡도가 다를 수 있으며, 어떤 알고리즘이 더 효율적인지는 그래프의 형태와 알고리즘의 목적에 따라 달라짐 일반적으로 어떤 알고리즘을 선택할지는 문제의 특성과 요구사항에 따라 결정 다익스트라 (Dijkstra) 알고리즘 그래프 알고리즘 알고리즘을 사용하는 경우 BFS 사용 시, 격자모양의 미로에서는 상하좌우 방향의 가중치가 모두 동일 현재 정점에서 이어진 간선들의 가중치가 모두 동일 하지만 가중치가 모두 일정하지 않다면 -&gt; BFS를 사용할 수 없음 다익스트라 알고리즘 설명 한 정점에서 다른 모든 정점으로의 최단 경로를 구하는 알고리즘 간선의 가중치가 양수일 때만 사용 가능 음수면 다익스트라가 아닌 테이크스트라 알고리즘 사용 BFS와 유사하지만, 일반적인 큐가 아닌 우선순위 큐(Priority Queue)를 사용하여 비용이 가장 작은 간선부터 탐색한다는 차이점이 있음 우선순위 큐 (Priority Queue) 들어오는 순서에 상관 없이 우선 순위가 높은 데이터가 먼저 나가는 자료구조 Heap을 이용해 구현하는 것이 가장 효율적 ${\\color{red}그리디(Greedy) 알고리즘}$ 매 단계에서 현재까지의 부분 해(solution)를 최적화하여 최종적으로 전체 문제의 최적 해를 찾아냄 다익스트라 알고리즘 동작 순서 출발 노드 선택 출발 노드로부터 각 노드까지의 최단 거리 배열 초기화 출발노드 거리는 0, 나머지 노드는 무한대(충분히 큰 값)로 설정 현재 노드 설정 현재까지의 최단 거리가 확정된 노드 중 가장 가까운 노드 선택 이웃 노드 갱신 선택한 노드를 기준으로 해당 노드와 이웃한 노드들 간의 거리 갱신 모든 노드를 확인할 때까지 3,4단계 반복 핵심 아이디어 각 노드까지의 현재까지 알려진 최단 거리를 계속 갱신하며 출발 노드로부터 최단 경로를 찾는 것 비용이 가장 작은 간선부터 이어주기 위해 우선순위 큐를 사용한다. 다익스트라 알고리즘 시간 복잡도 V : 정점(노드)의 수, E : 간선의 수 O(ElogV) 다익스트라 알고리즘의 구현 문제 예시 방향 그래프가 주어지면 주어진 시작점에서 다른 모든 정점으로의 최단 경로의 비용을 구하여라 첫째 줄에 정점의 개수와 간선의 개수가 입력됨 둘째 줄에는 시작 정점의 번호가 입력됨 셋째 줄부터 간선의 개수만큼의 줄에 걸쳐 (u,v,w)가 주어짐 (u,v,w) -&gt; u에서 v로 가는 양의 가중치 w인 간선 존재 구현 예시 출발 노드 선택 출발 노드로부터 각 노드까지의 최단 거리 배열 초기화 현재 노드 설정 이웃 노드 갱신 모든 노드 확인할 때까지 3,4단계 반복",
    "tags": "algorithm",
    "url": "/algorithm/2024-07-15-day6/"
  },{
    "title": "[Code Challenge] 깊이 우선 탐색",
    "text": "목차 DFS란? DFS특징 DFS 시간 복잡도 깊이 우선 탐색 (DFS) DFS란?(Depth First Search) 특정 정점(노드)에서 시작해서 트리나 그래프에서 한 가지 경로를 최대한 깊게 탐색하고, 해당 경로를 끝까지 탐색한 후 다른 경로로 이동 미로를 탐색할 때 한 방향으로 갈 수 있을 때까지 계속 가다가, 더 이상 갈 수 없게 되면 다시 가장 가까운 갈림길로 돌아와서 다른 방향으로 다시 탐색을 진행하는 방법과 유사 모든 정점을 방문하고자 하는 경우에 사용 DFS 특징 일반적으로 재귀 함수 사용 Stack으로도 구현 가능 모든 경우의 수에 대해 탐색을 진행 사이클이 있는 경우, 무한 루프에 빠지지 않도록 방문 체크 해줘야함 BFS보다 깊은 경로를 빠르게 찾는데 용이 진행 순서 구현 함수 DFS(now): 현재 노드를 방문한 것으로 표시 현재 노드를 출력 모든 이웃노드 'next'에 대해서 반복: 만약 'next'를 아직 방문하지 않았다면: DFS(next) DFS 시간 복잡도 V : 정점(노드)의 수, E : 간선의 수 인접 리스트로 표현된 그래프 O(V+E) 인접 행렬로 표현된 그래프 O(V^2) 희소 그래프 Sparse Graph 그래프 내에 적은 숫자의 간선만을 가지는 그래프 인접 행렬보다 인접 리스트 사용이 유리",
    "tags": "algorithm",
    "url": "/algorithm/2024-07-12-day5/"
  },{
    "title": "[Code Challenge] 재귀와 정렬",
    "text": "목차 재귀 정렬 재귀 재귀 : 자신을 정의할 때, 자기 자신을 참조하는 것 재귀 함수 : 함수 내부에서 자기 자신을 호출하는 함수 주의할 점 무한 루프에 빠지지 않도록 종료 조건을 잘 설정 종료 조건을 기저 사례 (base case)라고도 함 함수의 파라미터 및 인자 설정에 유의 정렬 정렬의 종류 삽입 정렬 (Insertion Sort) 최악 O(n^2) 버블 정렬 (Bubble Sort) 최악 O(n^2) 합병 정렬 (Merge Sort) 최악 O(nlogn) 퀵 정렬 (Quick Sort) 최악 O(n^2) 평균 O(nlogn) 설명 배열의 요소들 중에서 피벗(Pivot)을 정하여, 피벗의 앞에는 피벗보다 작은 원소들이 오고, 피벗 뒤에는 피벗보다 큰 값이 오도록 배열을 둘로 나눔 분할된 두 개의 배열의 크기가 0이나 1이 될 때까지, 분할된 두 배열에 대해 재귀적으로 이 과정을 반복 재귀 호출이 한 번 진행될 때마다 최소한 하나의 원소가 최종적인 위치에 있게 되므로, 종료됨이 보장 힙 정렬 (Heap Sort) 최악 O(nlogn) 특정 정렬이 빠르다고 항상 좋은 것은 아님 데이터의 특성, 크기에 따라 적절한 방법 사용해야 함 언어들의 라이브러리 내장 sort 구현 C++ 인트로 정렬 (Intro Sort) 퀵 정렬 + 힙 정렬 + 삽입 정렬 Python 팀 정렬 (Tim Sort) 합병 정렬 + 삽입 정렬 Java Java7 이전에는 병합 정렬, 이후에는 팀 정렬 코테에선 왠만하면 내장 sort함수를 사용",
    "tags": "algorithm",
    "url": "/algorithm/2024-07-11-day4/"
  },{
    "title": "[Code Challenge] 문자열",
    "text": "목차 코딩테스트에 자주 나오는 문자열 1) 회문 2) 올바른 괄호 문자열 분할 정복과 백트래킹 1) 분할 정복 2) 백트레킹 코딩테스트에 자주 나오는 문자열 1. 회문 (Palindrome) 앞뒤 방향으로 볼 때, 같은 순서의 문자로 구성된 문자열을 의미 예시 “소주 만 병만 주소”, “Madam, I’m Adam”, “1234321” 2. 올바른 괄호 문자열 (VPS = Valid Parenthesis String) 조건 빈 문자열은 올바른 괄호 문자열이다 S가 올바른 괄호 문자열이라면, (S)도 올바른 괄호 문자열이다. S, T가 괄호 문자열이라면 ST도 올바른 괄호 문자열이다. 보통은 Stack을 사용해서 해결 ’)’가 입력될 때마다, 스택에 있는 ‘(‘를 하나씩 지움 이때, 스택(top)이 비어있거나, ‘(‘가 없으면 올바른 괄호 문자열이 아님 모든 문자열을 순회한 뒤, 스택이 비어있으면 올바른 괄호 문자열 치환 사용하기 ’(‘를 1, ‘)’를 -1로 치환 문자열 S를 전부 순회하며 합 계산 중간에 합이 음수가 되거나, 모든 계산이 끝나고 0이 아니면 올바른 괄호 문자열이 아님 분할 정복과 백트래킹 분할 정복 (Divide and Conquer) 큰 문자를 작은 문제로 분할하여 작은 문제의 답을 모다 큰 문제의 답을 구함 기저 사례(base case)를 잘 설정하여 일정 기준 이상 분할되지 않도록 해야 함 보통 재귀로 구현 예시 피보나치 수열 Z 백트래킹 답이 될 수 없는 경우는 탐색 대상에서 제외하며 효율적으로 답을 구하는 알고리즘 가지치기(pruning)를 통해 연산량을 유의미하게 줄여줌 가지치기를 사용하기 위해서는 현재 상태에서 도달할 수 있는 상태가 모두 답이 될 수 없음을 보여야 함 정확한 시간 복잡도 측정 어려움 보통 재귀로 구현 많이 연습해봐야 익힐 수 있음 예시 스도쿠 대입해보고 현재 상태에서 스도쿠를 완성할 수 없다면, 분기점으로 다시 돌아옴 Nqueen",
    "tags": "algorithm",
    "url": "/algorithm/2024-07-10-day3/"
  },{
    "title": "[Code Challenge] 유클리드 호제법",
    "text": "목차 유클리드 호제법 소수 판별법 유클리드 호제법 두 수가 서로 상대방 수를 나누어 원하는 수를 구하는 것 GCD (Greatest Common Divisor) 최대공약수 두 자연수 a, b에 대해서 (a &gt; b) a를 b로 나눈 나머지를 r이라고 하면 a와 b의 최대공약수는 b와 r의 최대공약수와 동일 이 성질에 따라, b를 r로 나눈 나머지 r’를 구하고, 다시 r을 r’로 나눈 나머지를 구하는 과정을 반복하여 나머지가 0이 되었을때 나누는 수가 a와 b의 최대공약수 예시 1071과 1029의 최대공약수 구하기 1071 % 1029 = 42 1029 % 42 = 21 42 % 21 = 0 21이 1071과 1029의 최대공약수 LCM (Least Common Multiple) 최소공배수 LCM(a, b) = a * b / GCD(a, b) 어떠한 두 수의 곱은, 그 두 수의 최대공약수와 최소공배수의 곱과 같다 cpp의 gcd, lcm 함수는 c++17부터 지원 numeric 모듈 보통 코테에서 c++17 사용 python은 math 모듈의 gcd, lcm 함수 gcd는 python 3.5 lcm은 python 3.9 보통 코테에서 python 3.8 사용 java는 지원하지 않음 소수 판별법 1은 소수, 합성수 아님 에라토스테네스의 체 O(Nlog(logN)) N이 커지면 거의 O(N) 회귀가 아닌 반복",
    "tags": "algorithm",
    "url": "/algorithm/2024-07-09-day2/"
  },{
    "title": "[Code Challenge] 시간 복잡도",
    "text": "시간 복잡도 언어별 실행 속도 cpp &gt; Java &gt; python 보통 언어별 시간 보정이 존재 우선 java가 편하니까 Java로 해보기로! 평균적으로 대략 1초에 1억 번 연산 (10^8) 실제 문항을 풀 때, N의 범위를 먼저 확인할 것 시간 복잡도를 고민하지 않고 무작정 구현붜 하면 처음부터 다시 코드를 작성해야함 예를 들어, 시간제한 1초 / 1 &lt;= N &lt;= 10^5 인 경우 O(N^2)는 불가능 O(NlogN)까지 가능",
    "tags": "algorithm",
    "url": "/algorithm/2024-07-08-day1/"
  },{
    "title": "[파이썬을 이용한 딥러닝/강화학습 주식투자] Chap 01 금융 데이터 분석",
    "text": "1. 금융 데이터 분석 1.1 금융데이터란? 금융데이터 주식, 채권, 펀드 등의 금융 상품 및 이와 관련있는 모든 정보 주식 종목 및 시장 데이터, 재무제포 관련 데이터, 환율 데이터 등이 있다. 1.2 금융 데이터 분석의 필요성 주식 투자자는 크게 개인, 기관, 외국인 등이 있다. 보통 개인은 기관, 외국인보다 수익률이 좋지 않다. 이유로는 정보의 비대칭성 개인들이 적은 종목의 단기투자에 집중함 많은 종목의 데이터를 분석하고, 판단하려면 프로그래밍 언어와 머신 러닝을 이용해야한다. 1.3 금융 데이터 분석 방법 기본적 분석 기술적 분석 정서 분석 1. 기본적 분석 (fundamental analysis) 기업의 가치, 산업, 경제를 평가하는 분석 방법 재무제표를 분석해 회사의 수익성, 안정성, 성장성 등 판단 대표적 분석 지표 PER (Price Earning Ratio) PBR (Price Book-value Ratio) ROE (Return On Equity) PBR/PER 산업분석 KB금융지주 경영연구소 등의 발표자료 참고 경기분석 Business Cycle, GDP, 금리, 환율, 경기종합지수 등 참고 2. 기술적 분석 (technical analysis) 차트 분석. 과거의 경험으로 미래를 예측하고자 하는 분석 방법 주로 차트의 OHLCV, 보조지표, 패턴을 분석 OHLC(open-high-low-close)및 거래량(volume)",
    "tags": "deeplearning",
    "url": "/deeplearning/2023-10-17-DLtrading-01/"
  },{
    "title": "[Flutter] URI과 URL의 차이",
    "text": "목차 URI URL URN URI와 URL의 차이점 flutter앱을 개발하는 도중, http통신관련 코드를 짜면서 Uri.parse()함수를 여러 번 접하게 되었다. 주소 관련 변수명을 url로 쓰고 있어 이 둘의 의미가 혼동되어 정확하게 알아보고자 하였다. URI (Uniform Resource Identifier) 우리 말로 ‘통합 자원 식별자’ Uniform -&gt; 리소스를 식별는 통일된 방식 Resource -&gt; URI로 식별이 가능한 웹 브라우저 파일 및 그 이외의 리소스를 포함하는 모든 종류의 자원 Identifier -&gt; 다른 항목과 구분하기 위해 필요한 정보 즉, URI는 인터넷상의 리소스 자원 자체를 식별하는 고유한 문자열 시퀀스 URL (Uniform Resource Locator) 네트워크상에서 통합 자원(리소스)의 “위치”를 나타내기 위한 규약 웹 사이트 주소 + 컴퓨터 네트워크 상의 자원 특정 웹 페이지의 주소에 접속하기 위해서는 웹 사이트의 주소뿐만 아니라 프로토콜(https, http, sftp, smp 등)을 함께 알아야 접속이 가능한데, URL은 이들 모두를 나타낸다. URN (Uniform Resource Name) 리소스의 위치, 프로토콜, 호스트 등과는 상관없이 각 자원에 이름을 부여한 것 웹 문서의 물리적인 위치와 상관없이 웹 문서 자체를 나타낸다. URI와 URL의 차이점 URI= 식별자, URL=식별자+위치 nan0silver.github.io는 리소스의 이름만 나타내므로 URI https://nan0silver.github.io/는 이름과 위치를 나타내므로 URL (프로토콜 http를 포함하기 때문) URL ⊂ URI URL은 프로토콜과 결합된 상태이다. (프로토콜 + 이름) URI는 그 자체로 이름이 될 수 있다.",
    "tags": "flutter",
    "url": "/flutter/2023-08-14-about-UriUrl/"
  },{
    "title": "[Flask] Flask서버에 외부 접근하는 방법",
    "text": "app.run()안에 바인딩될 호스트 정보를 넣어준다. app.run()은 127.0.0.1로 실행되며 이는 로컬에서만 실행가능하다. app.run(host=’0.0.0.0’)의 경우 모든 호스트로 접근 가능하다. 포트 변경을 원하는 경우 app.run(host=’0.0.0.0’, port=8000)과 같이 사용한다. 위의 방법으로 실행하면 flask서버를 실행한 컴퓨터의 IP주소와 함께 설정한 포트로 연결가능한 주소가 나온다.",
    "tags": "flutter",
    "url": "/flutter/2023-07-01-flask-run/"
  },{
    "title": "[Flutter] Flask 서버와 Flutter 통신",
    "text": "목차 Flask란? Dio Future Flask에서 json형태로 response보내는 함수 Flask란? 웹 애플리케이션 개발을 위한 파이썬 프레임워크 가장 유명한 Django(장고)보다 가볍고 필요한 기능만 최대한 라이트한 개발을 할 수 있다. Dio A powerful Http client for Dart http처럼 서버와 통신하기 위해 필요한 패키지 많은 기능을 가지고 있고, 여러가지 커스텀을 쉽게 할 수 있다. pubspec.yaml에 dependency를 추가해주어야 한다. Http와 json형식의 데이터로 받아올 때 차이점 Http로 요청 후 리턴받은 데이터를 decode해준 값이 Dio로 요청 후 리턴받은 데이터와 동일하다. https://kyungsnim.net/175 에서 참고 Future 지금은 없지만 미래에 요청한 데이터 혹은 에러가 담길 그릇 싱글스레드 환경에서 비동기 처리를 위함 비동기 : 어떤 동작이 완료되지 않아도 다음 동작을 수행하는 것 동기 : 모든 동작이 완료된 후 다음 동작을 수행하는 것 Flask에서 json 형태로 response보내는 함수 jsonify json response를 보내기 위해 이미 content-type header가 ‘application/json’로 되어 있는 flask.Response() 객체를 리턴 jsonify도 함수 내부에서도 json form으로 serialize하는 과정에서 json.dumps를 사용 다만 dump하기 전에 받은 값들을 모두 dictionary로 만들었다. Parameter accept dictionary list json.dumps python이 가지고 있는 json library의 json.dumps() 수동으로 MIME type header를 추가해주어야 하는 encoded string을 리턴한다. flask가 알아서 판단해 response를 자동으로 보내주도록 사용하기 때문에 직접적으로 사용할 수 있다. 다만 reponse header fields는 디폴트(text/html; charset=utf-80)로 처리된다. Parameter accept jsonify보다 더 많은 타입",
    "tags": "flutter",
    "url": "/flutter/2023-04-18-about-flask/"
  },{
    "title": "[Flutter] Flutter UI",
    "text": "목차 Flutter Layout Widget의 생명주기 Flutter Layout Flutter Layout의 핵심은 위젯 위젯은 현재 주어진 상태(데이터)를 기반으로 어떤 UI를 구현할지 정의 플러터 프레임워크는 기존 상태 위젯과 새로운 상태의 위젯을 비교하여 UI변화를 반영 최소한의 리소스로 UI변경을 이룸 레이아웃 모델, 앱 내 이미지, 아이콘, 글자 등 거의 모든 것이 위젯 위젯은 자식을 하나만 갖는 위젯과 자식을 여럿 갖는 위젯으로 나뉨 자식을 하나만 갖는 위젯 container 위젯 자식 위젯을 커스터마이징할 수 있는 위젯 클래스 여백, 간격, 테두리, 배경색 등을 추가할 수 있음 나머지 UI는 속성에 의해 제어됨 (color속성, Text.style속성 등) 자식을 여럿 갖는 위젯 children 매개변수를 입력 받음 리스트로 여러 위젯을 입력할 수 있음 Column 위젯, Row 위젯 children 매개변수에 입력된 모든 위젯들을 세로(가로)로 베치 ListView 위젯 리스트 구현가능, 입력된 위젯이 화면을 벗어나게 되면 스크롤 가능해짐 예시 위의 스크린샷에 해당하는 위젯을 구현하기 위한 위젯 트리이다. ❗️Material apps vs Non-Material apps Material apps 플랫 디자인의 장점을 살리면서도 빛에 따른 종이의 그림자 효과를 이요해 입체감을 살리는 디자인방식을 가진 앱 구글에서 사용하고 있는 플랫 디자인 지침 앱마다 다른 디자인을 통일시키기 위함 Scaffold 위젯 기본적인 material design의 시각적인 레이아웃 구조를 실행한다. Scafflod 위젯 vs Container Scafflod 기본적으로 appbar, body라는 2개의 옵션을 가짐 Container Scafflod의 body부분에 들어가는 부속품 봉지라고 생각하면 됨 한 개의 자식을 가지는 레이아웃 위젯 Container의 생성자는 아래와 같다. Container({ Key key, this.alignment, this.padding, Color color, Decoration decoration, this.foregroundDecoration, double width, double height, BoxConstraints constraints, this.margin, this.transform, this.child, })&lt;/pre&gt; Widget의 생명주기 Stateful Widget의 생명주기 stateless widget은 한 번 만들어지면 갱신할 수 없어 생명주기가 없다. stateful widget은 10단계의 생명주기가 있다. createState()함수 상태를 생성하는 함수 다른 생명주기 함수들이 포함된 State 클래스를 반환 StatefulWidget 클래스를 상속받는 클래스는 반드시 이 함수를 호출해야 한다. Class MyHomePage extends StatefulWidget { @override _MyHomePageState createState() =&gt; new _MyHomePageState(); } mounted == true createState() 함수가 호출되어 상태가 생성되면 mounted 속성이 true가 된다. 위젯을 제어할 수 있는 buildContext클래스에 접근 가능해짐 buildContext가 활성화되어야 setState()함수 이용 가능 initState()함수 위젯을 초기화하는 함수 주로 데이터 목록을 만들거나 처음 필요한 데이터를 주고받을 때 호출 이 함수를 호출할 때 내부에서 _getJsonData() 함수를 호출하면 서버에서 데이터를 가져와 화면에 출력할 수 있음 didChangeDependencies()함수 initState()함수 호출 후, 해당 위젯이 데이터에 의존하는 위젯이라면 반드시 호출해야하는 함수 주로 상속받은 위젯을 사용할 때 피상속자가 변경되면 호출 build()함수 위젯을 화면에 렌더링하는 함수 (Widget을 반환한다.) @override Widget build(BuildContext context) { return MaterialApp( title: 'Flutter Demo', theme: ThemeData( primarySwatch: Colors.blue, ), home: MyHomePage(title: 'Flutter Demo Page'), ); } didUpdateWidget()함수 부모 위젯이나 데이터가 변경되어 위젯을 갱신해야 할 때 호출하는 함수 initState()함수는 위젯을 초기화할 때 한 번만 호출되므로 위젯이 변경되었을 때 이 함수를 호출해야함 setState()함수 데이터가 변경되었다는 것을 알려주고 이를 반영하여 화면 UI를 변경하는 함수 deactive()함수 위젯의 상태 관리를 중지하는 함수 State객체가 플러터 구성 트리에서 제거될 때 호출됨 dispose()함수를 호출하기 전까지는 State객체를 재사용할 수 있게 해줌 dispose()함수 State객체를 영구적으로 소멸할 때 호출되는 함수 mounted == false 생명주기를 끝내주는 함수 false가 된 다음 이 State는 재사용할 수 없다.",
    "tags": "flutter",
    "url": "/flutter/2023-04-13-flutter-UI/"
  },{
    "title": "[Flutter] Start Flutter",
    "text": "목차 What is Flutter Dart Flutter Project What is Flutter? 크로스 플랫폼 앱 개발 프레임 워크 Dart 언어 사용 구글에서 만듬 컴파일 언어의 특징을 활용하여 앱 개발 가능 프레임워크, 엔진, 임베더 계층으로 구성 프레임워크 Dart로 개발된 여러 클래스로 앱 개발 엔진 플러터의 코어 C, C++ 데이터 통신, 다트 컴파일, 렌더링, 시스템 이벤트 임베더 플러터 앱이 크로스 플랫폼에서 동작하도록 플러터 엔진이 렌더링한 결과를 플랫폼별 네이티브 언어로 뷰를 만들어 화면에 보여줌 네이티브 언어 안드로이드 : 자바, 코틀린 IOS : 오브젝티브-C, 스위프트 플러터의 장점 높은 개발 효율 hot reload 코드 변경 이후 빌드시간에 의한 낭비되는 시간을 없애기 위해 업데이트된 소스파일들이 dart virtual machine에 주입되면 flutter는 변경된 사안을 기반으로 widge tree를 재구성 -&gt; 변경된 것이 빠르게 결과물에 적용됨 유연한 사용자 인터페이스 다양한 위젯 제공 강력한 애니메이션 기능 제공 빠른 속도 Dart 비동기 처리 방식 작업이 끝나기를 기다리지 않고 다음 작업을 처리하게 하는 것 작동 방식 async 함수를 비동기로 만듬 await 비동기 함수 안에서 언제 끝날지 모르는 작업 앞에 붙임 해당 작업의 결과를 받기 위해 비동기 함수이름 앞에 Future 붙임 예시 코드 Future checkVersion() async { var version = await lookUpVersion(); print(version); }&lt;/pre&gt; 하나의 thread로 동작 Flutter Project lib 폴더 플러터 앱 개발을 위한 다트 파일 pubspec.yaml 플러터의 다양한 패키지, 이미지, 폰트 사용할수 있게 해줌",
    "tags": "flutter",
    "url": "/flutter/2023-04-06-start-flutter/"
  }]};