# 🚀 CareerFit AI

🇰🇷 한국어 | 🇺🇸 [English](README.md)

AI 기반 취업 관리 플랫폼

CareerFit AI는 호주에서 취업을 준비하면서 직접 겪었던 불편함을 해결하기 위해 개발한 풀스택 SaaS 프로젝트입니다.

여러 채용 사이트에서 채용 공고를 확인하고, 공고의 요구사항을 제 기술과 하나씩 비교하는 과정이 반복되는 것이 불편했습니다.

이 과정을 하나의 서비스에서 해결하고자 AI를 활용한 취업 관리 플랫폼인 CareerFit AI를 개발하게 되었습니다.

프로젝트는 단순한 포트폴리오가 아니라 실제 서비스 개발 경험을 목표로 진행하였으며, Docker, AWS, Nginx, Cloudflare, GitHub Actions CI/CD까지 직접 구축하여 개발부터 배포 및 운영까지 전체 소프트웨어 개발 사이클을 경험했습니다.

---

# 🌐 Live Demo

### Production

https://career-fit-ai.com

---

# 🎯 데모 계정

### Demo User

- Email : test@career-fit-ai.com
- Password : CareerFit123!

> 관리자 계정은 공개되어 있지 않습니다.

---

# 📖 프로젝트 소개

CareerFit AI는 취업 준비 과정에서 필요한 다양한 기능을 하나의 서비스로 통합한 AI 기반 취업 관리 플랫폼입니다.

사용자는

- 커리어 프로필 작성
- 이력서 업로드
- AI를 이용한 프로필 자동 생성
- AI 채용공고 분석
- 지원 현황 관리
- 계정 및 세션 관리
- Google OAuth 로그인

등을 사용할 수 있습니다.

관리자는

- 사용자 관리
- 역할(Role) 관리
- 플랫폼 통계 확인
- 계정 활성화 / 비활성화
- 플랫폼 모니터링

기능을 사용할 수 있습니다.

---

# 🚀 프로젝트를 시작한 이유

호주에서 개발자로 취업을 준비하면서 여러 채용 사이트를 오가며 공고를 확인하는 일이 반복되었습니다.

공고마다 요구하는 기술을 하나씩 비교하고, 지원 현황도 따로 관리해야 하는 과정이 생각보다 비효율적이라고 느꼈습니다.

그래서

"채용공고 관리부터 AI 분석, 지원 현황 관리까지 하나의 서비스에서 해결할 수 없을까?"

라는 생각으로 CareerFit AI를 개발하게 되었습니다.

프로젝트를 진행하면서 단순한 CRUD 프로젝트가 아니라 실제 서비스 수준으로 만들어 보고 싶다는 목표가 생겼고,

- JWT Authentication
- Refresh Token Rotation
- Session Management
- Google OAuth
- Docker
- AWS
- GitHub Actions CI/CD

등을 직접 적용하며 실제 서비스 개발 과정을 경험했습니다.

---

# 📸 주요 화면

## 🤖 AI 채용공고 분석

Gemini AI를 이용하여 채용공고를 분석하고

- 적합도(Fit Score)
- 요구 기술
- 우대 기술
- 주요 업무
- 준비 사항
- 추천 여부

등을 제공합니다.

<p align="center">
<img src="./docs/screenshots/analysis.png" width="900"/>
</p>

---

## 🛠 관리자(Admin)

- 플랫폼 통계
- 사용자 관리
- 권한 관리
- 활동 모니터링

<p align="center">
<img src="./docs/screenshots/admin.png" width="900"/>
</p>

---

## 📋 지원 현황 관리

지원한 회사들을

- 검색
- 필터
- 정렬
- 상태 변경

하며 관리할 수 있습니다.

<p align="center">
<img src="./docs/screenshots/application.png" width="900"/>
</p>

---

## 🌐 랜딩 페이지

비회원도 AI 채용공고 분석을 사용할 수 있습니다.

<p align="center">
<img src="./docs/screenshots/landing.png" width="900"/>
</p>

---

## 📊 대시보드

최근 분석 결과와 지원 현황을 한눈에 확인할 수 있습니다.

<p align="center">
<img src="./docs/screenshots/dashboard.png" width="900"/>
</p>

---

## 👤 커리어 프로필

기술 스택

경력

희망 직무

근무 형태

등을 관리할 수 있습니다.

<p align="center">
<img src="./docs/screenshots/careerprofile.png" width="900"/>
</p>

---

## ⚙️ 설정

- 비밀번호 변경
- 세션 관리
- 계정 관리

<p align="center">
<img src="./docs/screenshots/setting.png" width="900"/>
</p>

---

## 🔐 로그인

이메일 로그인과 Google OAuth 로그인을 지원합니다.

<p align="center">
<img src="./docs/screenshots/signin.png" width="900"/>
</p>

---

# ✨ 주요 기능

## 🔐 인증 및 보안

- 회원가입
- 로그인
- JWT 인증
- Refresh Token Rotation
- Session Management
- 이메일 인증
- 비밀번호 찾기
- 비밀번호 변경
- Google OAuth
- RBAC(Role Based Access Control)

---

## 👤 프로필 관리

- 프로필 생성
- 수정
- 삭제
- 아바타 업로드
- 기술 스택 관리
- 커리어 목표 관리

---

## 📄 이력서 관리

- PDF 업로드
- PDF 미리보기
- PDF 텍스트 추출
- AI Resume Parsing
- AI 프로필 자동 생성

---

## 🤖 AI 기능

Gemini AI를 활용하여

- 채용공고 분석
- 적합도 계산
- 요구 기술 분석
- 준비 사항 생성
- 추천 여부 제공

---

## 📋 지원 현황 관리

- 지원 생성
- AI 분석 결과 기반 지원 생성
- 검색
- 필터
- 정렬
- 상태 변경

---

## 🛠 관리자 기능

- 플랫폼 통계
- 사용자 관리
- 권한 변경
- 계정 활성화 / 비활성화

---

# 🏗 시스템 아키텍처

```text
User
 │
 ▼
Cloudflare
 │
 ▼
Nginx Reverse Proxy
 │
 ├───────────────┐
 ▼               ▼
Frontend      Backend API
(Next.js)     (Express)
                    │
                    ▼
               PostgreSQL
```

Docker Compose 기반으로 AWS EC2에 배포하였습니다.

Cloudflare는 DNS 및 보안 기능을 제공하며,

Nginx는 Reverse Proxy 역할을 수행합니다.

Frontend는 REST API를 통해 Backend와 통신하며,

Backend는 PostgreSQL을 이용하여 사용자, 프로필, 이력서, AI 분석, 지원 현황 등을 관리합니다.

---

# 🛠 기술 스택

## Frontend

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Axios

## Backend

- Node.js
- Express
- TypeScript
- Prisma ORM

## Database

- PostgreSQL

## Authentication

- JWT
- Refresh Token Rotation
- Google OAuth

## AI

- Gemini API

## Email

- Resend

## Infrastructure

- AWS EC2
- Docker Compose
- Nginx
- Cloudflare
- Let's Encrypt

## CI/CD

- GitHub Actions

## Test

- Jest
- Supertest

---

# 📚 API 문서

Swagger UI를 통해 API 문서를 제공합니다.

### Development

http://localhost:4000/api-docs

### Production

https://career-fit-ai.com/api-docs

---

# 🚀 배포 환경

- AWS EC2
- Docker Compose
- PostgreSQL
- Nginx
- Cloudflare
- HTTPS
- GitHub Actions CI/CD

GitHub에 Push하면 GitHub Actions가 자동으로 EC2에 배포를 진행합니다.

---

# 🧪 테스트

Jest와 Supertest를 이용하여

- 인증
- 프로필
- 이력서
- 지원 관리
- 세션
- 관리자 API

통합 테스트를 진행했습니다.

---

# 💡 개발하면서 해결한 문제

### PDF 미리보기

문제

Docker 재배포 시 업로드한 PDF가 사라졌습니다.

해결

Docker Volume과 Nginx Static Routing을 적용하여 해결했습니다.

---

### 세션 관리

JWT만으로는 다중 로그인 관리가 어려웠습니다.

Refresh Token Rotation과 DB 기반 Session 관리 기능을 추가하여 해결했습니다.

---

### 데이터 정리

만료된 토큰과 Soft Delete 데이터가 계속 쌓이는 문제를 Cleanup Service와 Cron Job으로 해결했습니다.

---

# 🔄 프로젝트 발전 과정

CareerFit AI는 처음에는 Backend API(v1) 프로젝트였습니다.

프로젝트를 개발하고 배포하는 과정에서 인증, 인프라, 배포 방식 등을 개선할 필요성을 느꼈고,

v2에서는

- Next.js
- Docker
- AWS
- GitHub Actions
- Google OAuth
- Session Management
- Admin Dashboard

등을 추가하며 실제 서비스 수준으로 발전시켰습니다.

---

# 🔮 앞으로 개선할 기능

- Redis Cache
- AI 작업 Queue
- AWS S3
- Monitoring Dashboard
- Centralized Logging
- AI Resume Review
- AI Resume Improvement

---

# 👨‍💻 개발자

**한상훈**

Junior Backend Developer

관심 분야

- Backend Architecture
- Cloud Infrastructure
- REST API Design
- Authentication
- Scalable Web Services

GitHub

https://github.com/umemarop
