# React & Spring Boot Board Project

전체 스택: PostgreSQL + Spring Boot + React를 Docker Compose로 관리하는 게시판 애플리케이션

## 프로젝트 구조

```
.
├── docker-compose.yml        # 컨테이너 오케스트레이션 설정
├── init-db.sql              # PostgreSQL 초기 데이터
├── back-end/                # Spring Boot 백엔드
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/com/board/
│           │   ├── BoardApiApplication.java
│           │   ├── controller/PostController.java
│           │   ├── service/PostService.java
│           │   ├── dto/PostDTO.java
│           │   ├── dto/CreatePostRequest.java
│           │   ├── entity/Post.java
│           │   └── repository/PostRepository.java
│           └── resources/application.properties
└── front-end/               # React 프론트엔드
    ├── Dockerfile
    ├── package.json
    ├── public/index.html
    └── src/
        ├── index.js
        ├── index.css
        ├── App.js
        ├── App.css
        ├── services/boardAPI.js
        └── pages/BoardPage.js
```

## 시작하기

### 사전 요구사항
- Docker
- Docker Compose

### 실행 방법

1. 프로젝트 디렉토리로 이동
```bash
cd /root/project/React-Springboot-Study
```

2. Docker Compose로 모든 서비스 시작
```bash
docker-compose up --build
```

3. 서비스 접근
- **React Frontend**: http://localhost:3000
- **Spring Boot API**: http://localhost:8080
- **PostgreSQL**: localhost:5432 (postgres/postgres)

4. 컨테이너 중지
```bash
docker-compose down
```

5. 데이터 볼륨 삭제 (초기화)
```bash
docker-compose down -v
```

## API 엔드포인트

### POST 엔드포인트

| 메서드 | URL | 설명 |
|--------|-----|------|
| GET | `/api/posts` | 모든 게시물 조회 |
| GET | `/api/posts/{id}` | 특정 게시물 조회 |
| POST | `/api/posts` | 새 게시물 생성 |
| PUT | `/api/posts/{id}` | 게시물 수정 |
| DELETE | `/api/posts/{id}` | 게시물 삭제 |

### 요청/응답 예시

#### 게시물 생성
```json
POST /api/posts
{
  "title": "제목",
  "content": "내용",
  "author": "작성자명"
}

응답 (201):
{
  "id": 1,
  "title": "제목",
  "content": "내용",
  "author": "작성자명",
  "createdAt": "2024-01-20T10:30:00",
  "updatedAt": "2024-01-20T10:30:00"
}
```

#### 모든 게시물 조회
```json
GET /api/posts

응답 (200):
[
  {
    "id": 1,
    "title": "첫 번째 게시물",
    "content": "내용...",
    "author": "작성자1",
    "createdAt": "2024-01-20T10:30:00",
    "updatedAt": "2024-01-20T10:30:00"
  }
]
```

## 기술 스택

### Backend
- **Java 17**
- **Spring Boot 3.1.5**
- **Spring Data JPA**
- **PostgreSQL 15**
- **Lombok**
- **Maven**

### Frontend
- **React 18**
- **Axios**
- **CSS3**

### Database
- **PostgreSQL 15**

## 볼륨 설정

Docker Compose는 다음 볼륨을 관리합니다:

1. **postgres_data**: PostgreSQL 데이터 영속성
2. **./back-end**: Spring Boot 소스 코드 (핫 리로드)
3. **./front-end**: React 소스 코드 (핫 리로드)

## 개발 팁

### 로그 확인
```bash
# 모든 서비스 로그
docker-compose logs -f

# 특정 서비스 로그
docker-compose logs -f springboot
docker-compose logs -f react
docker-compose logs -f postgres
```

### 컨테이너 내부 접근
```bash
# Spring Boot 컨테이너
docker-compose exec springboot bash

# React 컨테이너
docker-compose exec react sh

# PostgreSQL 접근
docker-compose exec postgres psql -U postgres -d board_db
```

### 데이터베이스 초기화
```bash
# 볼륨 삭제 후 재시작
docker-compose down -v
docker-compose up --build
```

## 문제 해결

### Port 이미 사용 중인 경우
포트를 변경하려면 `docker-compose.yml`에서 다음 항목을 수정:
```yaml
ports:
  - "8080:8080"  # 첫 번째 포트를 변경
```

### 데이터베이스 연결 실패
1. PostgreSQL이 준비될 때까지 대기 (`healthcheck` 설정됨)
2. 로그 확인: `docker-compose logs postgres`

### React 핫 리로드 작동 안 함
컨테이너 재시작:
```bash
docker-compose restart react
```

## 다음 단계

- [ ] 회원가입 / 로그인 기능 추가
- [ ] 게시물 검색 기능
- [ ] 페이지네이션
- [ ] 댓글 기능
- [ ] 파일 업로드
