pipeline {
    agent any

    environment {
        APP_PORT = '8081'
        HEALTH_ENDPOINT = "http://localhost:${APP_PORT}/health"
        JAR_PATH = "target/student-feedback-portal-1.0.0.jar"
    }

    stages {
        stage('Checkout') {
            steps {
                echo '====================================================='
                echo ' Stage 1: Checkout Source Code from GitHub'
                echo '====================================================='
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo '====================================================='
                echo ' Stage 2: Compile Java Source using Maven Wrapper'
                echo '====================================================='
                sh 'chmod +x ./mvnw'
                sh './mvnw clean compile'
            }
        }

        stage('Test') {
            steps {
                echo '====================================================='
                echo ' Stage 3: Execute JUnit 5 Automated Tests'
                echo '====================================================='
                sh './mvnw test'
            }
            post {
                always {
                    echo 'Publishing JUnit Test Reports...'
                    junit allowEmptyResults: true, testResults: '**/target/surefire-reports/*.xml'
                }
            }
        }

        stage('JaCoCo Code Coverage') {
            steps {
                echo '====================================================='
                echo ' Stage 4: Generate & Publish JaCoCo Code Coverage'
                echo '====================================================='
                // Generate JaCoCo HTML, XML, and CSV reports from target/jacoco.exec
                sh './mvnw jacoco:report'

                // Publish code coverage metrics via Jenkins JaCoCo plugin
                // Configured with Ant glob patterns, build-over-build delta, and health thresholds
                jacoco(
                    execPattern: '**/target/jacoco.exec',
                    classPattern: '**/target/classes',
                    sourcePattern: '**/src/main/java',
                    inclusionPattern: '**/*.class',
                    exclusionPattern: '**/*Test*.class',
                    buildOverBuild: true,
                    maximumLineCoverage: '80',
                    minimumLineCoverage: '50',
                    maximumBranchCoverage: '80',
                    minimumBranchCoverage: '50',
                    maximumInstructionCoverage: '80',
                    minimumInstructionCoverage: '50',
                    maximumMethodCoverage: '80',
                    minimumMethodCoverage: '50',
                    maximumClassCoverage: '80',
                    minimumClassCoverage: '50'
                )

                // Archive the generated JaCoCo report folder as Jenkins build artifacts
                archiveArtifacts artifacts: 'target/site/jacoco/**', fingerprint: true, allowEmptyArchive: true
            }
        }

        stage('Package') {
            steps {
                echo '====================================================='
                echo ' Stage 5: Package Executable Spring Boot JAR'
                echo '====================================================='
                sh './mvnw package -DskipTests'
            }
        }

        stage('Archive') {
            steps {
                echo '====================================================='
                echo ' Stage 6: Archive Build Artifacts in Jenkins'
                echo '====================================================='
                archiveArtifacts artifacts: 'target/*.jar', fingerprint: true
            }
        }

        stage('Deploy') {
            steps {
                echo '====================================================='
                echo " Stage 7: Deploy Application Locally on Port ${APP_PORT}"
                echo '====================================================='
                sh '''
                    set -e
                    echo "Checking for existing instance running on port ${APP_PORT}..."

                    # Gracefully stop previous instance if running
                    PID=$(lsof -ti :${APP_PORT} 2>/dev/null || fuser ${APP_PORT}/tcp 2>/dev/null || true)
                    if [ -n "$PID" ]; then
                        echo "Found existing instance (PID: $PID). Stopping process..."
                        kill -15 $PID || true
                        sleep 3
                        # Force kill if still running
                        if kill -0 $PID 2>/dev/null; then
                            echo "Process $PID still active. Forcing termination..."
                            kill -9 $PID || true
                            sleep 2
                        fi
                        echo "Previous instance stopped successfully."
                    else
                        echo "No previous instance running on port ${APP_PORT}."
                    fi

                    # Start new instance in background with nohup
                    echo "Starting application with nohup on port ${APP_PORT}..."
                    BUILD_ID=dontKillMe JENKINS_NODE_COOKIE=dontKillMe nohup java -jar ${JAR_PATH} --server.port=${APP_PORT} > app.log 2>&1 &

                    # Health check loop
                    echo "Awaiting application startup at ${HEALTH_ENDPOINT}..."
                    READY=0
                    for i in $(seq 1 30); do
                        echo "Attempt $i/30: Checking health..."
                        if curl -s -f ${HEALTH_ENDPOINT} > /dev/null 2>&1; then
                            echo ""
                            echo ">> Health check PASSED! Application is UP and healthy on port ${APP_PORT}."
                            curl -s ${HEALTH_ENDPOINT}
                            echo ""
                            READY=1
                            break
                        fi
                        sleep 2
                    done

                    if [ $READY -ne 1 ]; then
                        echo ">> Health check FAILED after 60 seconds! Application log output:"
                        cat app.log
                        exit 1
                    fi
                '''
            }
        }
    }

    post {
        success {
            echo '====================================================='
            echo ' Pipeline Status: SUCCESS'
            echo " Student Feedback Portal is live at: http://localhost:${APP_PORT}"
            echo '====================================================='
        }
        failure {
            echo '====================================================='
            echo ' Pipeline Status: FAILURE - Check stage logs above'
            echo '====================================================='
        }
        always {
            echo 'Pipeline execution cycle concluded.'
        }
    }
}
