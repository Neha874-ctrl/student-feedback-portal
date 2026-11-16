
pipeline {
    agent any

    options {
        disableConcurrentBuilds()
        timestamps()
    }

    environment {
        APP_PORT = '8081'
        HEALTH_ENDPOINT = 'http://localhost:8081/health'
        JAR_PATH = 'target/student-feedback-portal-1.0.0.jar'
    }

    stages {

        // STAGE 1: CHECKOUT
        stage('Checkout') {
            steps {
                echo 'Fetching latest code from GitHub'
                checkout scm
            }
        }

        // STAGE 2: BUILD, TEST AND PACKAGE
        stage('Build, Test & Package') {
            steps {
                echo 'Starting Maven clean verify'

                sh '''
                    chmod +x ./mvnw
                    ./mvnw clean verify
                '''
            }

            post {
                always {
                    echo 'Publishing JUnit test results'

                    junit(
                        allowEmptyResults: true,
                        testResults: '**/target/surefire-reports/*.xml'
                    )
                }
            }
        }

        // STAGE 3: JACOCO COVERAGE
        stage('JaCoCo Code Coverage') {
            steps {
                echo 'Generating JaCoCo HTML report'

                sh './mvnw jacoco:report'

                jacoco(
                    execPattern: '**/target/jacoco.exec',
                    classPattern: '**/target/classes',
                    sourcePattern: '**/src/main/java'
                )

                archiveArtifacts(
                    artifacts: 'target/site/jacoco/**',
                    fingerprint: true,
                    allowEmptyArchive: true
                )
            }
        }

        // STAGE 4: ARCHIVE JAR
        stage('Archive') {
            steps {
                echo 'Archiving application JAR'

                archiveArtifacts(
                    artifacts: 'target/*.jar',
                    fingerprint: true
                )
            }
        }

        // STAGE 5: DEPLOY
        stage('Deploy') {
            steps {
                echo "Deploying Student Feedback Portal on port ${APP_PORT}"

                sh '''
                    set -e

                    echo "Checking for previous application..."

                    PID=$(lsof -ti :${APP_PORT} 2>/dev/null || true)

                    if [ -n "$PID" ]; then
                        echo "Stopping previous application: $PID"

                        kill -15 $PID || true
                        sleep 3

                        if kill -0 $PID 2>/dev/null; then
                            echo "Force stopping previous application"
                            kill -9 $PID || true
                            sleep 2
                        fi
                    else
                        echo "No previous application found"
                    fi

                    echo "Starting new application..."

                    BUILD_ID=dontKillMe \
                    JENKINS_NODE_COOKIE=dontKillMe \
                    nohup java -jar ${JAR_PATH} \
                    --server.port=${APP_PORT} \
                    > app.log 2>&1 &

                    echo "Waiting for health check..."

                    READY=0

                    for i in $(seq 1 30); do

                        if curl -s -f ${HEALTH_ENDPOINT} > /dev/null 2>&1; then

                            echo "Application is UP!"

                            curl -s ${HEALTH_ENDPOINT}

                            READY=1
                            break
                        fi

                        echo "Attempt $i/30"
                        sleep 2
                    done

                    if [ "$READY" -ne 1 ]; then

                        echo "Deployment failed!"
                        echo "Application logs:"
                        cat app.log

                        exit 1
                    fi
                '''
            }
        }
    }

    // POST BUILD ACTIONS
    post {

        success {
            echo '''
            ==========================================
            PIPELINE SUCCESS
            Student Feedback Portal deployed!
            ==========================================
            '''

            echo "Application URL: http://localhost:${APP_PORT}"
        }

        failure {
            echo '''
            ==========================================
            PIPELINE FAILED
            Check Jenkins Console Output
            ==========================================
            '''
        }

        always {
            echo 'Jenkins pipeline execution completed.'
        }
    }
}
