stage('Build, Test & Package') {
    steps {
        echo 'Running Maven lifecycle...'
        sh '''
            chmod +x ./mvnw
            ./mvnw clean verify
        '''
    }
    post {
        always {
            junit allowEmptyResults: true,
                  testResults: '**/target/surefire-reports/*.xml'
        }
    }
}