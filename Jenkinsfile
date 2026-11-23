pipeline {
    agent any

    // Check GitHub every 2 minutes; build only when there is a new commit.
    // (GitHub webhooks cannot reach localhost, so polling is used.)
    triggers {
        pollSCM('H/2 * * * *')
    }

    options {
        disableConcurrentBuilds()                       // one build at a time
        timeout(time: 30, unit: 'MINUTES')              // kill a hung build
        buildDiscarder(logRotator(numToKeepStr: '10'))  // keep last 10 builds only
    }

    environment {
        BACKEND_DIR  = 'Spring_Boot_Balaji_FInance\\sri-balaji-finance'
        FRONTEND_DIR = 'FIN_FRENTEND\\Frentned_main'
        OUT_DIR      = 'C:\\Adi\\2026\\FIN_HYD_PROJECT_V1\\Singile-125'
        JAR_NAME     = 'sri-balaji-finance-0.0.1-SNAPSHOT.jar'
    }

    stages {

        // ---------- CHECKLIST 1: before build ----------
        stage('Pre-Build Checklist') {
            steps {
                bat '''
                echo ===== [1] Tools =====
                java -version || exit /b 1
                call mvn -v || exit /b 1
                call node -v || exit /b 1
                call npm -v || exit /b 1
                echo ===== [2] Project files =====
                if not exist "%BACKEND_DIR%\\pom.xml" ( echo MISSING: pom.xml & exit /b 1 )
                if not exist "%FRONTEND_DIR%\\package.json" ( echo MISSING: package.json & exit /b 1 )
                if not exist "%FRONTEND_DIR%\\package-lock.json" ( echo MISSING: package-lock.json & exit /b 1 )
                echo ===== [3] Output folder =====
                if not exist "%OUT_DIR%" mkdir "%OUT_DIR%"
                '''
                // [4] App must be stopped, otherwise the jar is locked and copy fails
                powershell '''
                $jar = Join-Path $env:OUT_DIR $env:JAR_NAME
                if (Test-Path $jar) {
                    try { $f = [IO.File]::Open($jar, 'Open', 'ReadWrite', 'None'); $f.Close() }
                    catch { Write-Host "FAIL: $jar is in use. Run stop.bat in Singile-125 and build again."; exit 1 }
                }
                Write-Host "===== Checklist OK ====="
                '''
            }
        }

        // ---------- FAST: backend + frontend build at the same time ----------
        stage('Build') {
            parallel {

                stage('Backend Build') {
                    steps {
                        dir("${env.BACKEND_DIR}") {
                            // -B batch mode, -T 1C = one thread per CPU core
                            bat 'mvn -B -T 1C clean package -DskipTests'
                        }
                    }
                }

                stage('Frontend Build') {
                    steps {
                        dir("${env.FRONTEND_DIR}") {
                            // Reinstall node_modules only when package-lock.json changed
                            powershell '''
                            $hash   = (Get-FileHash package-lock.json).Hash
                            $marker = 'node_modules\\.lock-hash'
                            if ((Test-Path $marker) -and ((Get-Content $marker -Raw).Trim() -eq $hash)) {
                                Write-Host 'package-lock.json unchanged - skipping npm ci (fast)'
                            } else {
                                npm ci --prefer-offline --no-audit --no-fund
                                if ($LASTEXITCODE -ne 0) { exit 1 }
                                Set-Content $marker $hash
                            }
                            '''
                            bat 'npm run build'
                        }
                    }
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
                copy /Y "%BACKEND_DIR%\\target\\%JAR_NAME%" "%OUT_DIR%\\" || exit /b 1
                if exist "%OUT_DIR%\\dist" rmdir /S /Q "%OUT_DIR%\\dist"
                xcopy /E /I /Y /Q "%FRONTEND_DIR%\\dist" "%OUT_DIR%\\dist" || exit /b 1
                '''
            }
        }

        // ---------- CHECKLIST 2: after build ----------
        stage('Post-Build Checklist') {
            steps {
                bat '''
                echo ===== Verify output in %OUT_DIR% =====
                if not exist "%OUT_DIR%\\%JAR_NAME%" ( echo FAIL: jar not copied & exit /b 1 )
                if not exist "%OUT_DIR%\\dist\\index.html" ( echo FAIL: dist\\index.html not copied & exit /b 1 )
                dir "%OUT_DIR%\\%JAR_NAME%"
                echo ===== All checks passed =====
                '''
            }
        }
    }

    post {
        success {
            echo "Finance Application Build Successful! Output: ${env.OUT_DIR}"
        }

        failure {
            echo 'Finance Application Build Failed! Open the failed stage log above.'
        }
    }
}
