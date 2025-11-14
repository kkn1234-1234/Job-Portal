# JobConnect – Full Stack Job Portal

Modern recruitment platform that connects applicants and employers across India. The project consists of a Spring Boot backend (`JobportalBackend`) and a React + Vite frontend (`JobPortalFrontend`).

---

## ✨ Highlights

### Applicant Experience
- Browse rich job listings with filters for location, work mode, experience level, and keywords.
- Maintain a professional profile (bio, skills, resume link) and manage saved jobs.
- Apply with meaningful cover letters and track status transitions (Pending → Reviewed → Shortlisted → Accepted/Rejected).
- Receive in-app notifications whenever employers update application statuses.

### Employer Experience
- Post and manage job openings with detailed requirements and benefits.
- Review applications per job, leave internal notes, and update applicant statuses in a single click.
- Dashboard cards highlight shortlisted, accepted, and rejected counts for quick triage.
- Applicant cards surface full profiles, resume links, skills, and contact details.

### Platform Features
- JWT-secured authentication with dedicated roles (`APPLICANT`, `EMPLOYER`).
- Separate `ApplicantAccount` and `EmployerAccount` entities orchestrated by `AccountService`.
- MySQL-backed notification system linking applicants and employers.
- Responsive UI crafted with Tailwind CSS, Framer Motion, and Lucide icons.

---

## 🧱 Tech Stack

| Layer    | Tools |
|----------|-------|
| Backend  | Java 21, Spring Boot 3, Spring Security (JWT), Spring Data JPA, MySQL 8, Maven, Lombok |
| Frontend | React 18, Vite 5, React Router 6, Tailwind CSS 3, Axios, React Hot Toast, Framer Motion, Lucide React |
| DevOps   | Maven builds, npm scripts, environment variables, MySQL schema seeding |

---

## 📂 Project Structure

```bash
job_portal_wind_surf/
├── README.md
├── JobportalBackend/            # Spring Boot REST API
│   ├── src/main/java/com/jobconnect/
│   │   ├── config/              # Security, CORS, JWT utilities
│   │   ├── controller/          # REST endpoints
│   │   ├── dto/                 # Request/response DTOs
│   │   ├── entity/              # ApplicantAccount, EmployerAccount, Job, JobApplication, Notification, ...
│   │   ├── repository/          # Spring Data repositories
│   │   └── service/             # Business logic (auth, jobs, applications, notifications)
│   └── src/main/resources/
│       ├── application.properties
│       └── data.sql             # Demo seed data
└── JobPortalFrontend/           # React + Tailwind SPA
    ├── src/api/                 # Axios wrappers for backend APIs
    ├── src/pages/               # Applicant & Employer dashboards
    ├── src/components/          # Reusable UI widgets
    └── tailwind.config.js
```

---

## 🧭 Architecture & Workflow Diagrams

High-level views of how the system is wired end‑to‑end.

- **High-level Architecture** – how the React SPA talks to the Spring Boot API and how the API persists data in MySQL.
- **Notification Workflow** – how employer actions on applications propagate into notifications visible to applicants.

![High-level Architecture]<img width="1536" height="1024" alt="architecture-overview" src="https://github.com/user-attachments/assets/bd62a026-275c-4797-a725-4f3a8fbb83d2" />

![Notification Workflow]<img width="1536" height="1024" alt="notification-workflow" src="https://github.com/user-attachments/assets/580b49d2-5a9e-4fc9-8b3e-ab22a8cd3a59" />

---

## 🚀 Getting Started

### 1. Prerequisites

- Java 21+
- Maven 3.8+
- Node.js 18+ (Vite dev server uses `npm run dev`)
- MySQL 8

### 2. Clone the repo

```bash
git clone https://github.com/kkn1234-1234/Job-Portal.git
cd job_portal
```

### 3. Configure the database

Create the schema once:

```sql
CREATE DATABASE jobportal;
```

Update `JobportalBackend/src/main/resources/application.properties` if needed:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/jobportal?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=root
spring.sql.init.mode=never   # change to always if you want demo seeds on every boot

jwt.secret=your-secure-secret
```

> Recommend externalising DB, JWT, and mail secrets via environment variables before deploying publicly.

### 4. Run the backend (port 9091)

```bash
cd JobportalBackend
mvn clean install
mvn spring-boot:run
```

The app includes schema adjustments (for example, ensuring `notifications.user_id` allows nulls) and wires JWT, CORS, and security filters.

### 5. Run the frontend (port 5173)

```bash
cd ../JobPortalFrontend
npm install
npm run dev
```

Navigate to `http://localhost:5173`. Axios auto-attaches JWT tokens from `localStorage`, and CORS is already configured for `http://localhost:5173` and `http://localhost:3000`.

---

## 🔐 Demo Credentials

Seed data includes multiple Indian employers and applicants. All seeded accounts share the password **`12345678`** (BCrypt hashed).

Example employer logins:

| Company | Email |
|---------|-------|
| Tata Consultancy Services | `careers@tcs.com` |
| Infosys Limited | `talent@infosys.com` |
| Wipro Limited | `careers@wipro.com` |

Example applicants:

| Name | Email |
|------|-------|
| Rohan Reddy | `rohan.reddy1@example.in` |
| Isha Das | `isha.das2@example.in` |
| Aditya Khan | `aditya.khan3@example.in` |

Log in as an employer, review applicants for a job, update statuses, then switch to the applicant account to see notification counts, detail views, and status history.

---

## 🔄 Key Flows

1. **Applicant applies** → JobApplication stored with `PENDING` status and optional cover letter.
2. **Employer updates status / leaves notes** → `ApplicationService` validates ownership, updates status and notes, then triggers `NotificationService.createNotification(applicantId, employerId, ...)`.
3. **Notification fan-out** → Applicants fetch unread counts via `/api/notifications/unread-count` and mark individual/all notifications read.
4. **Frontend refresh** → React state updates to reflect new status chips, toasts confirm actions, and metrics cards recompute counts.

---

## 🧪 Suggested Test Plan

1. Start backend and frontend.
2. Log in as `careers@tcs.com` (employer) and review job applications for one listing.

---

### Screenshots
<img width="1917" height="1017" alt="jp-1" src="https://github.com/user-attachments/assets/d529e750-a59f-4c43-b3a9-0acefc597efe" />
<img width="1911" height="1021" alt="jp-2" src="https://github.com/user-attachments/assets/3f4eeb59-d738-4ab6-869f-df5c7c03154a" />
<img width="1918" height="1021" alt="jp-3" src="https://github.com/user-attachments/assets/11986091-55b0-4145-a6fe-ed975a6087b9" />
<img width="1918" height="1016" alt="jp-4" src="https://github.com/user-attachments/assets/839d3f0e-9345-4a58-be89-93f299dc9976" />
<img width="1918" height="1006" alt="jp-5" src="https://github.com/user-attachments/assets/782a6ea1-733e-4e04-a699-cea7d187c823" />
<img width="1907" height="1021" alt="jp-6" src="https://github.com/user-attachments/assets/3c581c99-1f6c-414b-a646-01653b75a59f" />
<img width="1918" height="1027" alt="jp-7" src="https://github.com/user-attachments/assets/4765eeb0-6fca-45f1-9b3f-127684649327" />
<img width="1918" height="1018" alt="jp-8" src="https://github.com/user-attachments/assets/20be8326-eecb-48c2-b2d1-564832b2c18f" />
<img width="1918" height="1023" alt="jp-9" src="https://github.com/user-attachments/assets/f83add69-48fa-4196-a683-e22b7a8c032b" />
<img width="1908" height="876" alt="jp-10" src="https://github.com/user-attachments/assets/9b88102b-7feb-4d3c-a572-b127e39d658a" />


### Demo Video Clip

[▶ Watch JOB_PORTAL_DEMO](assets/JOB_PORTAL_DEMO.mp4)


---

## 📌 Production Notes

- Move DB credentials, JWT secrets, and mail settings from `application.properties` into environment variables before deployment.
- Disable destructive seed scripts (`spring.sql.init.mode`) when using persistent databases.
- Add Flyway/Liquibase migrations and end-to-end tests (Playwright/Cypress) for stronger DevOps maturity.

---

## 🗺 Roadmap Ideas

- Interview scheduling with calendar integrations.
- WebSocket-based live notifications.
- Analytics dashboards showcasing ₹ salary insights and hiring trends.
- Multi-tenancy support for recruitment agencies.

---

## 🤝 Contributing

1. Fork the repo:  
   https://github.com/kkn1234-1234/Job-Portal.git
2. Create a new feature branch:  
   `git checkout -b feature/<feature-name>`
3. Commit your changes:  
   `git commit -m "feat: add <feature>"`
4. Push the branch to GitHub:  
   `git push origin feature/<feature-name>`
5. Open a Pull Request 🚀


---

## 📬 Contact

Questions or suggestions? Open a GitHub issue or drop a note at `kkn25kn@gmail.com`.

Built with ❤ for jobseekers and recruiters across India. 👩‍💻👨‍💼
