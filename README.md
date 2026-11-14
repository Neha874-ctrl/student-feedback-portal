# Student Feedback Portal with Jenkins CI/CD Pipeline

A complete, beginner-friendly, full-stack web application designed for students to share feedback and ratings on courses and academic programs. This project demonstrates a production-style **Continuous Integration and Continuous Deployment (CI/CD)** workflow using **Jenkins Declarative Pipeline**, **Spring Boot 3**, **Java 17**, and an in-memory **H2 Database**.

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Key Features](#key-features)
4. [Project Architecture & Structure](#project-architecture--structure)
5. [Prerequisites](#prerequisites)
6. [Quick Start: Run Locally](#quick-start-run-locally)
7. [Running Automated Tests](#running-automated-tests)
8. [Packaging the Application](#packaging-the-application)
9. [Jenkins CI/CD Pipeline Setup](#jenkins-cicd-pipeline-setup)
10. [REST API Documentation](#rest-api-documentation)
11. [H2 Database Console](#h2-database-console)

---

## 🌟 Project Overview

The **Student Feedback Portal** provides an intuitive, responsive interface for academic institutions to gather real-time student insights. Built without complex frontend frameworks (pure HTML5, CSS3, JavaScript, and Bootstrap 5), it seamlessly connects to a robust Spring Boot REST backend.

The project is pre-configured with a 6-stage **Jenkins Declarative Pipeline** (`Jenkinsfile`) that automates code checkout, compilation, JUnit 5 testing, test report generation, artifact archiving, zero-downtime local background deployment on port `8081`, and automated health verification.

---

## 💻 Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Backend** | Java 17 | OpenJDK 17 LTS |
| **Framework** | Spring Boot 3.2.5 | Spring Web, Spring Data JPA, Jakarta Validation |
| **Database** | H2 Database | Embedded in-memory database (zero setup required) |
| **Frontend** | HTML5, CSS3, JavaScript | Modern ES6 `fetch()`, Bootstrap 5.3, Bootstrap Icons |
| **Build Tool** | Apache Maven | Maven Wrapper (`./mvnw` & `mvnw.cmd`) included |
| **Testing** | JUnit 5 & MockMvc | Unit & integration tests for all REST endpoints |
| **CI/CD** | Jenkins | Declarative Pipeline (`Jenkinsfile`) with automated deployment |
| **Version Control** | Git & GitHub | Complete repository structure |

---

## ✨ Key Features

### 1. Interactive Landing Page
- Modern blue and white aesthetic with clean typography and smooth transitions.
- Hero section explaining the purpose of the feedback system.
- Live summary counters: Total Submissions, Average Star Rating, System Health status.
- Direct navigation between Home, Submit Feedback, and Feedback Dashboard.

### 2. Submit Feedback Form
- Form fields:
  - **Student Name** (validated: 2–100 characters)
  - **Student Email** (validated: standard email pattern)
  - **Subject / Course Name** (with quick course autocomplete datalist)
  - **Interactive 1–5 Star Rating** (hover effects, dynamic star fill, and label)
  - **Feedback Comments** (validated: up to 1000 characters with live character counter)
- Client-side validation + server-side Jakarta Bean Validation.
- Dismissible success alert with a 1-click shortcut to view the newly submitted review on the dashboard.

### 3. Feedback Dashboard
- Real-time feedback cards retrieved directly from the Spring Boot backend (`GET /api/feedback`).
- Displays student initials avatar, name, email, course badge, star rating, submission date/time, and comments.
- **Search bar**: filter submissions instantly by student name, email, or course name.
- **Star rating filter**: filter by All Ratings, 5 Stars, 4 Stars, 3 Stars, 2 Stars, or 1 Star.
- **Delete feedback**: delete any entry with a confirmation modal and instant UI update.
- **Empty state**: friendly message and call-to-action button when no feedback exists.

### 4. Health Check Endpoint
- `/health` endpoint returning JSON status (`UP`), timestamp, and database status for Jenkins deployment verification.

---

## 📁 Project Architecture & Structure

```
student-feedback-portal/
├── .gitignore                               # Git ignored files & patterns
├── .mvn/                                    # Maven wrapper configuration
│   └── wrapper/
│       ├── maven-wrapper.jar
│       └── maven-wrapper.properties
├── Jenkinsfile                              # 6-Stage Declarative CI/CD Pipeline
├── mvnw                                     # Linux/macOS Maven wrapper script
├── mvnw.cmd                                 # Windows Maven wrapper script
├── pom.xml                                  # Maven dependencies and build plugins
├── README.md                                # Comprehensive documentation
└── src/
    ├── main/
    │   ├── java/com/example/feedback/
    │   │   ├── FeedbackApplication.java     # Spring Boot application entry point
    │   │   ├── controller/
    │   │   │   ├── FeedbackController.java  # REST APIs (/api/feedback)
    │   │   │   └── HealthController.java    # Health check endpoint (/health)
    │   │   ├── model/
    │   │   │   └── Feedback.java            # JPA entity & validation rules
    │   │   ├── repository/
    │   │   │   └── FeedbackRepository.java  # Spring Data JPA repository
    │   │   └── service/
    │   │       ├── FeedbackService.java     # Service interface
    │   │       └── FeedbackServiceImpl.java # Service implementation
    │   └── resources/
    │       ├── application.properties       # Database, port & JPA properties
    │       └── static/                      # Static web resources
    │           ├── index.html               # Main single-page web portal
    │           ├── script.js                # Frontend API fetch & DOM logic
    │           └── style.css                # Custom modern styling
    └── test/
        └── java/com/example/feedback/
            ├── FeedbackApplicationTests.java # Context load test
            ├── FeedbackControllerTest.java  # CRUD & validation integration tests
            └── HealthControllerTest.java    # /health endpoint test
```

---

## 🛠️ Prerequisites

Before running the application or configuring the Jenkins pipeline, verify that you have:

1. **Java Development Kit (JDK) 17**:
   ```bash
   java -version
   ```
2. **Git**:
   ```bash
   git --version
   ```
3. **cURL** (used for health verification):
   ```bash
   curl --version
   ```

*Note: You do not need to install Maven separately; the included Maven wrapper (`./mvnw`) handles Maven automatically.*

---

## 🚀 Quick Start: Run Locally

### Option 1: Using the Maven Wrapper (Default Port: 8080)

1. Clone or navigate to the project directory:
   ```bash
   cd student-feedback-portal
   ```

2. Make sure `mvnw` is executable (Linux / macOS):
   ```bash
   chmod +x ./mvnw
   ```

3. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```
   *(On Windows Command Prompt / PowerShell, run: `mvnw.cmd spring-boot:run`)*

4. Open your web browser and navigate to:
   - **Student Feedback Portal**: [http://localhost:8080](http://localhost:8080)
   - **Health Endpoint**: [http://localhost:8080/health](http://localhost:8080/health)
   - **H2 In-Memory Database Console**: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)

---

## 🧪 Running Automated Tests

Run the full suite of JUnit 5 tests using the Maven wrapper:

```bash
./mvnw test
```

Expected output:
```text
[INFO] Running com.example.feedback.HealthControllerTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.example.feedback.FeedbackControllerTest
[INFO] Tests run: 7, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.example.feedback.FeedbackApplicationTests
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
```

Surefire XML test reports are generated in `target/surefire-reports/`.

---

## 📦 Packaging the Application

To build the standalone executable JAR file:

```bash
./mvnw clean package
```

The resulting JAR file is located at:
```text
target/student-feedback-portal-1.0.0.jar
```

To run this packaged JAR directly (e.g. on port 8081):
```bash
java -jar target/student-feedback-portal-1.0.0.jar --server.port=8081
```

---

## ⚙️ Jenkins CI/CD Pipeline Setup

The project includes a production-grade `Jenkinsfile` in the root directory.

### Pipeline Stages Overview

```text
+----------+     +-------+     +------+     +---------+     +---------+     +--------+
| Checkout | --> | Build | --> | Test | --> | Package | --> | Archive | --> | Deploy |
+----------+     +-------+     +------+     +---------+     +---------+     +--------+
```

1. **Stage 1: Checkout**: Pulls the latest source code from the GitHub repository.
2. **Stage 2: Build**: Cleans and compiles the Java source code with `./mvnw clean compile`.
3. **Stage 3: Test**: Runs JUnit 5 tests via `./mvnw test` and publishes test reports to Jenkins.
4. **Stage 4: Package**: Packages the Spring Boot executable fat JAR (`./mvnw package -DskipTests`).
5. **Stage 5: Archive**: Archives the generated `target/*.jar` artifact in Jenkins for download.
6. **Stage 6: Deploy**:
   - Stops any previous application instance running on port `8081`.
   - Starts the newly built JAR in the background using `nohup` (`BUILD_ID=dontKillMe`).
   - Polls `http://localhost:8081/health` using `curl` until the application is confirmed healthy.

---

### Step-by-Step Instructions to Create the Jenkins Pipeline Job

#### Step 1: Push Source Code to GitHub
Ensure all project code is pushed to your GitHub repository:
```bash
git add .
git commit -m "feat: complete Student Feedback Portal with Jenkins CI/CD pipeline"
git push -u origin main
```

#### Step 2: Open Jenkins Dashboard
1. Open your browser and navigate to your Jenkins instance (typically `http://localhost:8080`).
2. Log in with your Jenkins administrative credentials.

#### Step 3: Create a New Pipeline Job
1. From the Jenkins Dashboard, click **New Item** in the left sidebar.
2. Enter an item name: `student-feedback-pipeline`.
3. Select **Pipeline** as the project type.
4. Click **OK**.

#### Step 4: Configure Pipeline from SCM
1. In the job configuration page, scroll down to the **Pipeline** section.
2. Change **Definition** from *Pipeline script* to **Pipeline script from SCM**.
3. Under **SCM**, select **Git**.
4. In **Repository URL**, enter your GitHub repository URL:
   ```text
   https://github.com/Neha874-ctrl/student-feedback-portal.git
   ```
5. If the repository is private, add or select your GitHub credentials in the **Credentials** dropdown. If public, leave as *none*.
6. In **Branch Specifier**, ensure it is set to `*/main` (or `*/master` according to your branch).
7. Under **Script Path**, confirm it specifies `Jenkinsfile`.
8. Click **Save**.

#### Step 5: Trigger Build and Monitor Deployment
1. Click **Build Now** on the left menu.
2. Click on the active build number (e.g. `#1`) and select **Console Output** to observe real-time execution:
   - Source code checkout
   - Maven build & dependency resolution
   - JUnit 5 test executions
   - Executable JAR packaging
   - Artifact archival
   - Background launch on port `8081`
   - Curl health check passing with `{"status":"UP", ...}`
3. Once the build finishes with **SUCCESS**, access the deployed portal at:
   ```text
   http://localhost:8081
   ```

---

## 🔌 REST API Documentation

All endpoints return and accept JSON.

| Method | Endpoint | Description | Request Body | Response Status |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/feedback` | Retrieve all submitted feedbacks (sorted newest first) | *None* | `200 OK` |
| `GET` | `/api/feedback/{id}` | Retrieve specific feedback by ID | *None* | `200 OK` / `404 Not Found` |
| `POST` | `/api/feedback` | Submit new student feedback | JSON Object (see schema below) | `201 Created` / `400 Bad Request` |
| `DELETE` | `/api/feedback/{id}` | Delete feedback by ID | *None* | `200 OK` / `404 Not Found` |
| `GET` | `/health` | Application health check endpoint for CI/CD | *None* | `200 OK` |

### Sample POST Request Body (`/api/feedback`):
```json
{
  "studentName": "Emily Watson",
  "studentEmail": "emily.watson@university.edu",
  "subject": "Cloud Computing & DevOps",
  "rating": 5,
  "comments": "The automated Jenkins CI/CD pipeline demonstration was very clear and insightful!"
}
```

### Sample Health Check Response (`/health`):
```json
{
  "status": "UP",
  "application": "Student Feedback Portal",
  "timestamp": "2026-11-14T18:50:00",
  "database": "H2 (In-Memory)"
}
```

---

## 🗄️ H2 Database Console

An interactive H2 web console is enabled for inspection during local development:

1. Open [http://localhost:8080/h2-console](http://localhost:8080/h2-console) (or `http://localhost:8081/h2-console` if running on port 8081).
2. Connect using these parameters:
   - **Driver Class**: `org.h2.Driver`
   - **JDBC URL**: `jdbc:h2:mem:feedbackdb`
   - **User Name**: `sa`
   - **Password**: *(leave blank)*
3. Click **Connect** to query the `FEEDBACK` table:
   ```sql
   SELECT * FROM FEEDBACK;
   ```

---

## 📄 License
This project is open-source and created for educational and demonstration purposes.
