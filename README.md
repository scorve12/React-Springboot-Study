# React & Spring Boot 게시판 프로젝트

Spring Boot + React를 Docker Compose로 관리하는 풀스택 게시판 애플리케이션입니다.

**지원 데이터베이스**: PostgreSQL

## 목차
- [프로젝트 구조](#프로젝트-구조)
- [사전 요구사항](#사전-요구사항)
- [로컬 개발 환경](#로컬-개발-환경)
- [프로덕션 배포 (Oracle Cloud)](#프로덕션-배포-oracle-cloud)
- [API 문서 (Swagger)](#api-문서-swagger)
- [API 엔드포인트](#api-엔드포인트)
- [기술 스택](#기술-스택)
- [개발 팁](#개발-팁)
- [문제 해결](#문제-해결)

---

## 프로젝트 구조

```
.
├── docker-compose.yml          # 로컬 개발용
├── docker-compose.prod.yml     # 프로덕션 배포용
├── init-db.sql                 # PostgreSQL 초기 데이터
│
├── back-end/                   # Spring Boot 백엔드
│   ├── Dockerfile              # 프로덕션 빌드
│   ├── Dockerfile.dev          # 개발 모드 (Hot Reload)
│   ├── pom.xml
│   └── src/main/java/com/board/
│       ├── BoardApiApplication.java
│       ├── config/SwaggerConfig.java
│       ├── controller/PostController.java
│       ├── service/PostService.java
│       ├── repository/PostRepository.java
│       ├── entity/Post.java
│       └── dto/
│           ├── PostDTO.java
│           └── CreatePostRequest.java
│
└── front-end/                  # React 프론트엔드
    ├── Dockerfile              # 개발 모드
    ├── Dockerfile.prod         # 프로덕션 빌드 (Nginx)
    ├── nginx.conf              # Nginx 설정
    ├── package.json
    └── src/
        ├── App.js
        ├── App.css
        ├── services/boardAPI.js
        └── pages/
            ├── PostListPage.js      # 게시물 목록
            ├── PostListPage.css
            ├── PostDetailPage.js    # 게시물 상세
            ├── PostDetailPage.css
            ├── PostWritePage.js     # 글쓰기/수정
            └── PostWritePage.css
```

---

## 사전 요구사항

- **Docker** (20.10 이상)
- **Docker Compose** (v2 이상)

### Docker 설치 (Ubuntu)
```bash
# Docker 설치
curl -fsSL https://get.docker.com | sh

# 현재 사용자를 docker 그룹에 추가
sudo usermod -aG docker $USER

# 재로그인 후 확인
docker --version
docker compose version
```

---

## 로컬 개발 환경

로컬에서 개발할 때 사용합니다. React와 Spring Boot 모두 Hot Reload가 적용됩니다.

### 실행 방법

```bash
# 1. 프로젝트 클론
git clone <repository-url>
cd React-Springboot-Study

# 2. 개발 모드로 실행
docker compose up -d --build

# 3. 로그 확인 (선택사항)
docker compose logs -f
```

### 접속 주소

| 서비스 | URL | 설명 |
|--------|-----|------|
| React (프론트엔드) | http://localhost:3000 | 게시판 UI |
| Spring Boot (API) | http://localhost:8080 | REST API |
| Swagger UI | http://localhost:8080/swagger-ui/index.html | API 문서 |
| PostgreSQL | localhost:5432 | DB (postgres/postgres) |

### 코드 수정 시

- **React**: 파일 저장 시 자동 반영 (Hot Reload)
- **Spring Boot**: 파일 저장 시 자동 재시작 (DevTools)

### 종료

```bash
# 컨테이너 중지
docker compose down

# 컨테이너 + 데이터 삭제 (DB 초기화)
docker compose down -v
```

---

## 프로덕션 배포 (Oracle Cloud)

Oracle Cloud Free Tier의 Arm 인스턴스(24GB RAM)에 배포하는 방법입니다.

### 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                    Oracle Cloud VM                       │
│                                                          │
│   ┌─────────────┐    ┌─────────────┐    ┌───────────┐  │
│   │   Nginx     │───▶│ Spring Boot │───▶│ PostgreSQL│  │
│   │  (React)    │    │  (Dev Mode) │    │           │  │
│   │   :80       │    │   :8080     │    │   :5432   │  │
│   └─────────────┘    └─────────────┘    └───────────┘  │
│         │                                               │
│         │ /api/* 요청은 Spring Boot로 프록시            │
│         │ 정적 파일은 Nginx에서 직접 서빙               │
└─────────│───────────────────────────────────────────────┘
          │
          ▼
      사용자 브라우저
```

### 리소스 사용량

| 서비스 | 메모리 | 설명 |
|--------|--------|------|
| Spring Boot (dev) | ~500MB | 코드 수정 시 자동 반영 |
| React (Nginx) | ~20MB | 정적 파일 서빙 |
| PostgreSQL | ~50MB | 데이터베이스 |
| **합계** | **~600MB** | 24GB 중 충분한 여유 |

### Oracle Cloud 인스턴스 생성

1. [Oracle Cloud](https://cloud.oracle.com) 로그인
2. **Compute** → **Instances** → **Create Instance**
3. 설정:
   - **Image**: Oracle Linux 8 또는 Ubuntu 22.04
   - **Shape**: VM.Standard.A1.Flex (Ampere)
   - **OCPU**: 1~4개 (무료)
   - **Memory**: 6~24GB (무료)
4. SSH 키 등록 후 생성

### 서버 초기 설정

```bash
# SSH 접속
ssh -i <your-key.pem> ubuntu@<서버-IP>

# Docker 설치
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# 재로그인
exit
ssh -i <your-key.pem> ubuntu@<서버-IP>

# Git 설치 (필요시)
sudo apt update && sudo apt install -y git
```

### 방화벽 설정 (Oracle Cloud 콘솔)

1. **Networking** → **Virtual Cloud Networks** → VCN 선택
2. **Security Lists** → Default Security List
3. **Add Ingress Rules**:

| Source CIDR | Protocol | Port | 설명 |
|-------------|----------|------|------|
| 0.0.0.0/0 | TCP | 80 | HTTP |
| 0.0.0.0/0 | TCP | 443 | HTTPS (선택) |

### 프로젝트 배포

```bash
# 1. 프로젝트 클론
git clone <repository-url>
cd React-Springboot-Study

# 2. 프로덕션 모드로 실행
docker compose -f docker-compose.prod.yml up -d --build

# 3. 상태 확인
docker compose -f docker-compose.prod.yml ps

# 4. 로그 확인
docker compose -f docker-compose.prod.yml logs -f
```

### 접속 확인

| 서비스 | URL |
|--------|-----|
| 게시판 | http://\<서버-IP\> |
| Swagger | http://\<서버-IP\>/swagger-ui/index.html |

### 학생이 Spring Boot 코드 수정 시

```bash
# back-end/src 폴더의 Java 파일 수정 후
# DevTools가 자동으로 재시작함

# 만약 자동 반영이 안되면:
docker compose -f docker-compose.prod.yml restart springboot

# 로그 확인
docker compose -f docker-compose.prod.yml logs -f springboot
```

### 서비스 관리

```bash
# 중지
docker compose -f docker-compose.prod.yml down

# 재시작
docker compose -f docker-compose.prod.yml restart

# 특정 서비스만 재시작
docker compose -f docker-compose.prod.yml restart springboot

# 로그 확인
docker compose -f docker-compose.prod.yml logs -f [서비스명]

# 리소스 사용량 확인
docker stats
```

---

## API 문서 (Swagger)

Swagger UI를 통해 API를 테스트할 수 있습니다.

### 접속 주소
- **로컬**: http://localhost:8080/swagger-ui/index.html
- **프로덕션**: http://\<서버-IP\>/swagger-ui/index.html

### OpenAPI JSON
- http://localhost:8080/v3/api-docs

---

## API 엔드포인트

### 게시물 API

| 메서드 | URL | 설명 |
|--------|-----|------|
| GET | `/api/posts` | 모든 게시물 조회 |
| GET | `/api/posts/{id}` | 특정 게시물 조회 |
| POST | `/api/posts` | 새 게시물 생성 |
| PUT | `/api/posts/{id}` | 게시물 수정 |
| DELETE | `/api/posts/{id}` | 게시물 삭제 |

### 요청/응답 예시

#### 게시물 생성
```bash
curl -X POST http://localhost:8080/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "제목",
    "content": "내용",
    "author": "작성자"
  }'
```

응답 (201 Created):
```json
{
  "id": 1,
  "title": "제목",
  "content": "내용",
  "author": "작성자",
  "createdAt": "2026-01-20T10:30:00",
  "updatedAt": "2026-01-20T10:30:00"
}
```

#### 모든 게시물 조회
```bash
curl http://localhost:8080/api/posts
```

응답 (200 OK):
```json
[
  {
    "id": 1,
    "title": "첫 번째 게시물",
    "content": "내용...",
    "author": "작성자1",
    "createdAt": "2026-01-20T10:30:00",
    "updatedAt": "2026-01-20T10:30:00"
  }
]
```

---

## 기술 스택

### Backend
| 기술 | 버전 | 설명 |
|------|------|------|
| Java | 17 | LTS 버전 |
| Spring Boot | 3.1.5 | 웹 프레임워크 |
| Spring Data JPA | - | ORM |
| PostgreSQL | 15 | 데이터베이스 |
| Lombok | - | 보일러플레이트 코드 감소 |
| SpringDoc OpenAPI | 2.2.0 | Swagger UI |

### Frontend
| 기술 | 버전 | 설명 |
|------|------|------|
| React | 18 | UI 라이브러리 |
| React Router | 6 | 라우팅 |
| Axios | 1.6 | HTTP 클라이언트 |

### Infrastructure
| 기술 | 설명 |
|------|------|
| Docker | 컨테이너화 |
| Docker Compose | 멀티 컨테이너 관리 |
| Nginx | 리버스 프록시, 정적 파일 서빙 |

---

## 개발 팁

### 로그 확인
```bash
# 모든 서비스
docker compose logs -f

# 특정 서비스
docker compose logs -f springboot
docker compose logs -f react
docker compose logs -f postgres
```

### 컨테이너 내부 접근
```bash
# Spring Boot 컨테이너
docker compose exec springboot bash

# React 컨테이너
docker compose exec react sh

# PostgreSQL 접속
docker compose exec postgres psql -U postgres -d board_db
```

### 데이터베이스 조회
```sql
-- 테이블 목록
\dt

-- 게시물 조회
SELECT * FROM posts;

-- 나가기
\q
```

### 리소스 모니터링
```bash
# 실시간 리소스 사용량
docker stats

# 디스크 사용량
docker system df
```

---

## 문제 해결

### 포트가 이미 사용 중인 경우

```bash
# 사용 중인 포트 확인
sudo lsof -i :8080
sudo lsof -i :3000

# 프로세스 종료
sudo kill -9 <PID>
```

### 데이터베이스 연결 실패

```bash
# PostgreSQL 상태 확인
docker compose logs postgres

# 컨테이너 상태 확인
docker compose ps

# 재시작
docker compose restart postgres
```

### Spring Boot가 시작되지 않음

```bash
# 로그 확인
docker compose logs springboot

# 재빌드
docker compose up -d --build springboot
```

### React 페이지가 로드되지 않음

```bash
# 로그 확인
docker compose logs react

# node_modules 문제 시
docker compose exec react npm install
```

### Oracle Cloud에서 접속 불가

1. **Security List** 확인 (포트 80 열려있는지)
2. **서버 방화벽** 확인:
   ```bash
   sudo iptables -L -n
   ```
3. **컨테이너 상태** 확인:
   ```bash
   docker compose -f docker-compose.prod.yml ps
   ```

---

## 다음 단계 (학습 과제)

- [ ] 회원가입 / 로그인 기능 (Spring Security + JWT)
- [ ] 게시물 검색 기능
- [ ] 페이지네이션
- [ ] 댓글 기능
- [ ] 파일 업로드
- [ ] HTTPS 적용 (Let's Encrypt)

---

## 라이선스

MIT License
