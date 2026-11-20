pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                sh './mvnw clean package'
            }
        }

        stage('Staging Deployment') {
            steps {
                sh '''
                mkdir -p /opt/cicd/staging
                cp target/*.jar /opt/cicd/staging/
                '''
            }
        }

        stage('Production Approval') {
            steps {
                input message: 'Approve production deployment?'
            }
        }

        stage('Production Deployment') {
            steps {
                sh '''
                mkdir -p /opt/cicd/production
                cp target/*.jar /opt/cicd/production/
                '''
            }
        }
    }
}