# Student Feedback Portal with Jenkins CI/CD & JaCoCo Code Coverage

A complete, beginner-friendly, full-stack web application designed for students to share feedback and ratings on courses and academic programs. This project demonstrates a production-style **Continuous Integration and Continuous Deployment (CI/CD)** workflow using **Jenkins Declarative Pipeline**, **Spring Boot 3**, **Java 17**, an in-memory **H2 Database**, and automated code quality auditing with **JaCoCo**.

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Key Features](#key-features)
4. [Project Architecture & Structure](#project-architecture--structure)
5. [Prerequisites](#prerequisites)
6. [Quick Start: Run Locally](#quick-start-run-locally)
7. [Running Automated Tests](#running-automated-tests)
8. [JaCoCo Code Coverage](#jacoco-code-coverage)
9. [Packaging the Application](#packaging-the-application)
10. [Jenkins CI/CD Pipeline Setup](#jenkins-cicd-pipeline-setup)
11. [REST API Documentation](#rest-api-documentation)
12. [H2 Database Console](#h2-database-console)

---

## 🌟 Project Overview

The **Student Feedback Portal** provides an intuitive, responsive interface for academic institutions to gather real-time student insights. Built without complex frontend frameworks (pure HTML5, CSS3, JavaScript, and Bootstrap 5), it seamlessly connects to a robust Spring Boot REST backend.

The project is pre-configured with a 7-stage **Jenkins Declarative Pipeline** (`Jenkinsfile`) that automates code checkout, compilation, JUnit 5 testing, JaCoCo code coverage analysis, artifact archiving, zero-downtime local background deployment on port `8081`, and automated health verification.

---

## 💻 Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Backend** | Java 17 | OpenJDK 17 LTS |
| **Framework** | Spring Boot 3.2.5 | Spring Web, Spring Data JPA, Jakarta Validation |
| **Database** | H2 Database | Embedded in-memory database (zero setup required) |
| **Frontend** | HTML5, CSS3, JavaScript | Modern ES6 `fetch()`, Bootstrap 5.3, Bootstrap Icons |
| **Build Tool** | Apache Maven | Maven Wrapper (`./mvnw` & `mvnw.cmd`) included |
| **Testing** | JUnit 5 & Mockito | Unit & integration tests for service, controller, and models |
| **Code Coverage** | JaCoCo 0.8.14 | Bytecode-level automated coverage & report generation |
| **CI/CD** | Jenkins | 7-Stage Declarative Pipeline (`Jenkinsfile`) |
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

### 4. Automated Code Quality & Health Checks
- `/health` endpoint returning JSON status (`UP`), timestamp, and database status for Jenkins deployment verification.
- Integrated **JaCoCo** measuring bytecode-level execution metrics across lines, branches, instructions, and methods.

---

## 📁 Project Architecture & Structure

```
student-feedback-portal/
├── .gitignore                               # Git ignored files & patterns
├── .mvn/                                    # Maven wrapper configuration
│   └── wrapper/
│       ├── maven-wrapper.jar
│       └── maven-wrapper.properties
├── Jenkinsfile                              # 7-Stage Declarative CI/CD Pipeline
├── mvnw                                     # Linux/macOS Maven wrapper script
├── mvnw.cmd                                 # Windows Maven wrapper script
├── pom.xml                                  # Maven dependencies, plugins & JaCoCo config
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
            ├── FeedbackApplicationTests.java # Context load and application startup test
            ├── FeedbackControllerTest.java  # REST API integration & validation tests
            ├── HealthControllerTest.java    # /health endpoint test
            ├── model/
            │   └── FeedbackModelTest.java   # Entity lifecycle & domain model tests
            └── service/
                └── FeedbackServiceTest.java # Isolated service layer tests with Mockito
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
[INFO] Running com.example.feedback.service.FeedbackServiceTest
[INFO] Tests run: 6, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.example.feedback.HealthControllerTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.example.feedback.model.FeedbackModelTest
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.example.feedback.FeedbackControllerTest
[INFO] Tests run: 10, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.example.feedback.FeedbackApplicationTests
[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
```

Surefire XML test reports are generated in `target/surefire-reports/`.

---

## 📊 JaCoCo Code Coverage

### What is JaCoCo?
**JaCoCo (Java Code Coverage)** is an open-source code coverage library for Java. It instruments compiled Java bytecode on the fly using a Java agent (`prepare-agent`), tracks which instructions and decision branches are executed during test runs, and writes the execution data to a binary file (`target/jacoco.exec`). It then translates this data into visual HTML, machine-readable XML, and CSV reports.

### Coverage Metric Types Explained

| Metric | Definition | Significance |
| :--- | :--- | :--- |
| **Line Coverage** | Measures the percentage of executable source code lines that were executed by at least one test. | Highlights which physical lines of code were completely untouched by test suites. |
| **Branch Coverage** | Measures the percentage of conditional branches evaluated (e.g. `if`, `else`, `switch`, ternary expressions `?:`). Each decision has at least two branches (true/false). | Critical for finding untested edge cases or error branches even when the enclosing line was reached. |
| **Instruction Coverage** | The smallest unit measured by JaCoCo. Measures the percentage of individual Java bytecode instructions executed. | Independent of source code formatting, line breaks, or multiple statements on a single line. |
| **Method Coverage** | Measures the percentage of declared non-abstract methods that were entered during test execution. | Provides a high-level view of how many functions or endpoints have at least one test covering them. |

### Executing Coverage Locally

To run all tests and generate the JaCoCo report in one step:
```bash
./mvnw clean verify
```

Alternatively, if tests were already run via `./mvnw test`, you can generate the report directly:
```bash
./mvnw jacoco:report
```

### Where to Find the Generated Reports
- **HTML Report (Visual Dashboard)**:
  ```text
  target/site/jacoco/index.html
  ```
  Open this file in any web browser to view color-coded coverage metrics per package, class, method, and source line (green = covered, yellow = partially covered branch, red = missed).
- **Binary Execution Data**:
  ```text
  target/jacoco.exec
  ```
- **XML Report (for CI tools & SonarQube)**:
  ```text
  target/site/jacoco/jacoco.xml
  ```
- **CSV Report (for spreadsheets & data processing)**:
  ```text
  target/site/jacoco/jacoco.csv
  ```

### How to View Coverage in Jenkins
1. **JaCoCo Coverage Trend Graph**:
   After each build, the Jenkins JaCoCo Plugin generates an interactive coverage trend graph on the job overview page showing progression across builds.
2. **JaCoCo Coverage Report Page**:
   Click **Coverage Report** (or **JaCoCo Coverage**) in the left sidebar of the specific build page to explore package-level and class-level coverage breakdowns.
3. **Archived HTML Artifact**:
   Under the build's **Build Artifacts** section, navigate to `target/site/jacoco/index.html` to inspect the full interactive report directly.

---

## 📦 Packaging the Application

To build the standalone executable JAR file:

```bash
./mvnw clean package -DskipTests
```

The resulting JAR file is located at:
```text
target/student-feedback-portal-1.0.0.jar
```

To run this packaged JAR directly on port 8081:
```bash
java -jar target/student-feedback-portal-1.0.0.jar --server.port=8081
```

---

## ⚙️ Jenkins CI/CD Pipeline Setup

The project includes a 7-stage declarative pipeline in `Jenkinsfile`.

### Pipeline Stages Overview

```text
+----------+     +-------+     +------+     +------------------+     +---------+     +---------+     +--------+
| Checkout | --> | Build | --> | Test | --> | JaCoCo Coverage  | --> | Package | --> | Archive | --> | Deploy |
+----------+     +-------+     +------+     +------------------+     +---------+     +---------+     +--------+
```

1. **Stage 1: Checkout**: Pulls latest code from GitHub.
2. **Stage 2: Build**: Compiles Java classes with `./mvnw clean compile`.
3. **Stage 3: Test**: Executes JUnit 5 tests via `./mvnw test` and publishes XML test reports.
4. **Stage 4: JaCoCo Code Coverage**:
   - Generates HTML, XML, and CSV reports via `./mvnw jacoco:report`.
   - Publishes metrics to Jenkins with the `jacoco(...)` step (`target/jacoco.exec`, `target/classes`, `src/main/java`).
   - Archives `target/site/jacoco/**` as Jenkins artifacts.
5. **Stage 5: Package**: Packages executable Spring Boot JAR (`./mvnw package -DskipTests`).
6. **Stage 6: Archive**: Archives `target/*.jar` artifact for download.
7. **Stage 7: Deploy**:
   - Stops previous application instance on port `8081`.
   - Starts application in background with `nohup java -jar` (`BUILD_ID=dontKillMe`).
   - Polls `http://localhost:8081/health` using `curl` until confirmed healthy.

---

### Step-by-Step Instructions to Create the Jenkins Pipeline Job

#### Step 1: Push Source Code to GitHub
Ensure all project code is pushed to your GitHub repository:
```bash
git add .
git commit -m "feat: integrate JaCoCo code coverage and enhanced test suite"
git push -u origin main
```

#### Step 2: Ensure Jenkins JaCoCo Plugin is Installed
1. In Jenkins, go to **Manage Jenkins** > **Plugins** > **Available Plugins**.
2. Search for **JaCoCo plugin** (`jacoco`).
3. Click **Install**, and restart Jenkins if prompted.

#### Step 3: Create a New Pipeline Job
1. From the Jenkins Dashboard, click **New Item** in the left sidebar.
2. Enter an item name: `student-feedback-pipeline`.
3. Select **Pipeline** as the project type and click **OK**.

#### Step 4: Configure Pipeline from SCM
1. In the job configuration page, scroll down to the **Pipeline** section.
2. Change **Definition** to **Pipeline script from SCM**.
3. Under **SCM**, select **Git**.
4. In **Repository URL**, enter:
   ```text
   https://github.com/Neha874-ctrl/student-feedback-portal.git
   ```
5. In **Branch Specifier**, ensure it is set to `*/main`.
6. Under **Script Path**, confirm `Jenkinsfile`.
7. Click **Save**.

#### Step 5: Trigger Build and Monitor Deployment
1. Click **Build Now** on the left menu.
2. Click the active build number (e.g. `#1`) > **Console Output** to monitor:
   - Source checkout
   - Maven build & JUnit 5 tests
   - JaCoCo coverage analysis & artifact archiving
   - JAR packaging and archival
   - Background launch on port `8081`
   - Automated `curl` health check loop
3. Once completed with **SUCCESS**, access the deployed portal at:
   ```text
   http://localhost:8081
   ```
4. Click **Coverage Report** in the build's sidebar to explore coverage statistics.

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
  "comments": "The automated Jenkins CI/CD pipeline and JaCoCo coverage integration was very clear and insightful!"
}
```

### Sample Health Check Response (`/health`):
```json
{
  "status": "UP",
  "application": "Student Feedback Portal",
  "timestamp": "2026-11-15T18:00:00",
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
