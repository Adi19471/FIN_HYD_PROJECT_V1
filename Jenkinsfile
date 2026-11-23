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

        stage('Copy to Singile-125') {
            steps {
                bat '''
                if not exist "C:\\Adi\\2026\\FIN_HYD_PROJECT_V1\\Singile-125" mkdir "C:\\Adi\\2026\\FIN_HYD_PROJECT_V1\\Singile-125"
                copy /Y Spring_Boot_Balaji_FInance\\sri-balaji-finance\\target\\*.jar "C:\\Adi\\2026\\FIN_HYD_PROJECT_V1\\Singile-125\\"
                if exist "C:\\Adi\\2026\\FIN_HYD_PROJECT_V1\\Singile-125\\dist" rmdir /S /Q "C:\\Adi\\2026\\FIN_HYD_PROJECT_V1\\Singile-125\\dist"
                xcopy /E /I /Y FIN_FRENTEND\\Frentned_main\\dist "C:\\Adi\\2026\\FIN_HYD_PROJECT_V1\\Singile-125\\dist"
                '''
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
