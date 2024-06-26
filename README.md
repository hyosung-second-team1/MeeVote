# 📆 MEEVOTE

## **0️⃣ 프로젝트 개요**

🎈 프로젝트명 : 미봇(MEEVOTE)

📌 프로젝트 컨셉 : 투표를 통해 공평하게 모임 장소를 정할 수 있는 일정 관리 서비스

🛠 개발 기간 : 24.04.29 ~ 24.05.17 (3주)

🧑🏻 팀원 : 권수현, 김한주, 이소민, 이우성

💻 사용 기술스택 : Spring Boot, MyBatis, JSP, JQuery

<br>

## **1️⃣ 팀원 정보 및 업무 분담 내역**

| 이름            | 역할     | 설명                                                        |
| --------------- | -------- | ------------------------------------------------------------ |
| 김한주 (팀장) | 화면 개발 | 회원 기능<br>일정 생성<br>투표 생성 및 투표 진행<br>카카오맵 API를 통한 장소 정보 제공 |
| 권수현 | 화면 개발 | 달력을 통한 일정 표시<br>알람창 조회 및 알람 삭제 |
| 이우성 | 배포, API 개발 | 프로젝트 초기 설정<br>ec2 서버 서비스 배포<br>인증, 회원, 통계, 투표 API 구현 |
| 이소민 | API 개발 | 일정, 회원 초대 API 구현 |

<br>

## **2️⃣ 서비스 대표 기능**

| 기능 | 세부기능 |
| --- | --- |
| 회원기능 | 이메일 인증을 통한 회원가입<br>프로필 사진 변경<br>주소 검색 API를 통한 주소 등록 |
| 달력을 통한 일정 조회 | fullcalendar 라이브러리를 통해 달력으로 일정 표시<br>사이드바에 시간 순서로 일정 정보 제공 |
| 일정 상세 조회 | 일정 상세 정보 조회 및 카카오맵 API를 통한 장소 추가 정보 제공 |
| 개인 일정 생성 | 개인 일정 생성<br>카카오맵 API 장소 검색을 통한 일정 장소 추가 기능 제공<br>설정한 날짜를 달력을 통해 표시 |
| 모임 일정 생성 | 모임 일정 생성<br>카카오맵 API 장소 검색을 통한 일정 장소 추가 기능 제공<br>회원 검색을 통한 참여 인원 초대<br>설정한 날짜를 달력을 통해 표시 |
| 모임 일정 장소 투표 | 카카오맵 API를 통해 장소 검색 후 투표 장소로 추가<br>장소까지의 거리, 택시비, 이동시간 등 추가정보 제공<br>모임장이 임의로 투표 종료 가능 |
| 일정 히스토리 조회 | 지난 일정 테이블 형식으로 조회<br>카테고리 혹은 개인과 그룹 일정으로 필터링 가능<br>모임 횟수에 대한 통계 자료 제공 |
| 알람 | 모임 일정 초대, 다가오는 일정 등을 알람에 표시<br>알람을 확인하면 알람창에서 삭제 |

<br>

## 3️⃣ 서비스 화면

#### 회원가입

![회원가입](/exec/screenshot/01.png)

#### 로그인

![로그인](/exec/screenshot/02.png)

#### 캘린더

![캘린더](/exec/screenshot/03.png)

#### 개인 일정 생성
![개인 일정 생성](/exec/screenshot/04.png)

#### 모임 일정 생성

![모임 일정 생성](/exec/screenshot/05.png)

#### 일정 히스토리

![01](/exec/screenshot/06.png)

#### 일정 상세보기

![01](/exec/screenshot/07.png)

#### 모임 일정 투표 장소 등록

![01](/exec/screenshot/08.png)

#### 모임 일정 장소 투표

![01](/exec/screenshot/09.png)


<br>

## **4️⃣ API**

![erd](/exec/api.png)

<br>

## **5️⃣ ERD**

![erd](/exec/erd.png)

<br>

## **6️⃣ 시스템 아키텍쳐**

![system_architecture](/exec/architecture.png)

<br>

## **7️⃣ 개발 환경**

<h4>🌐 공통</h4>

| 상세 | 내용 |
|---|---|
| GitHub | 형상 관리 |
| Slack | 커뮤니케이션 |
| Notion | 일정 및 문서 관리 |
| Figma | 디자인 |
| Intelli J | IDE |

<h4>📱 Server</h4>

| 상세 | 버전 |
|---|---|
| Oracle | 11c |
| Java | 17 |
| Spring Boot | 3.1.11 |
| Swagger | 2.2.0 |
| MyBatis | 3.0.3 |
| JSP | 2.3 |

<br>

## **8️⃣ 회고**

| 이름 | 내용 |
|---|---|
| 😘권수현 | 일상 생활에서 정말 필요하다 생각되는 주제로 프로젝트를 진행하게 되어 즐거웠습니다.<br> 프론트엔드 공부를 시작한지 얼마 안 되어 참여하게 된 프로젝트였기에 모르는 부분이 많았지만,<br> 프론트 경험이 있는 팀원들 덕분에 많이 배우고,<br>  백엔드와 프론트엔드가 어떻게 소통하고,<br> 어떤 식으로 협업해야 하는지 익힐 수 있었던 뜻깊은 경험이었습니다. |
| 😎김한주 | Spring Boot와 JSP, JQuery 등 거의 모든 기술을 처음 사용해보는 프로젝트였습니다.<br> 확실히 처음엔 해매는 감이 있었지만 점차 익숙해지면서 최종적으론 무사히 프로젝트를 마무리할 수 있었습니다.<br> 짧은 기간에 많은 걸 구현해야하는 타임어택 같은 느낌의 프로젝트라 많이 힘들었지만<br> 모든 팀원들이 잠을 줄여가며 열심히 해준 덕분에 정말 좋은 결과물이 나온 것 같습니다. |
| 😄이우성 | 예전부터 생각했던 서비스를 이번 기회에 실제로 구현하게 되어 좋은 경험이었습니다.<br> 짧은 기간동안 진행했기 때문에 어려움이 있었지만,<br> 효율적인 개발 프로세스와 협업에 대해서 고민할 수 있는 시간이었습니다.<br> 또한 마이바티스와 오라클 스케줄러를 처음으로 적용해보면서 기술 역량을 기를 수 있었습니다.<br> 마지막으로 훌륭한 팀원들과 협업할 수 있었던 점이 가장 좋은 경험이었습니다! |
| 😋이소민|                                                             |
