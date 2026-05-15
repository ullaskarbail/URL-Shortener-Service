pipeline {
    agent any

    environment {
        PATH = "/opt/homebrew/bin:/usr/local/bin:$PATH"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test || true'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t url-shortener-app .'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                docker stop url-shortener-container || true
                docker rm url-shortener-container || true

                docker run -d \
                  --name url-shortener-container \
                  -p 3000:3000 \
                  url-shortener-app
                '''
            }
        }
    }
}
