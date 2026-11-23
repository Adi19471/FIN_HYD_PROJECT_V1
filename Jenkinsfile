pipeline {
    agent any

    // Check GitHub every 2 minutes; build only when there is a new commit.
    // (GitHub webhooks cannot reach localhost, so polling is used.)
    triggers {
        pollSCM('H/2 * * * *')
    }

    stages {

        stage('Backend Build') {
            steps {
                dir('Spring_Boot_Balaji_FInance/sri-balaji-finance') {
                    bat 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir('FIN_FRENTEND/Frentned_main') {
                    bat 'npm ci'
                    bat 'npm run build'
                }
            }
        }

        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts:
                    'Spring_Boot_Balaji_FInance/sri-balaji-finance/target/*.jar, FIN_FRENTEND/Frentned_main/dist/**',
                    fingerprint: true
            }
        }
    }

    post {
        success {
            echo 'Finance Application Build Successful!'
        }

        failure {
            echo 'Finance Application Build Failed!'
        }
    }
}
