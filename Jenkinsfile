pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "url-shortener-app"
        CONTAINER_NAME = "url-shortener-container"
        PORT = "3000"
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout code from the Git repository
                echo "Checking out code from version control..."
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo "Installing npm dependencies..."
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                // Run automated unit tests using Jest
                echo "Running unit tests..."
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                // Build Docker image if tests pass
                echo "Building Docker image..."
                sh "docker build -t ${DOCKER_IMAGE} ."
            }
        }

        stage('Deploy') {
            steps {
                echo "Deploying new container..."
                // Stop and remove existing container if it exists
                sh "docker stop ${CONTAINER_NAME} || true"
                sh "docker rm ${CONTAINER_NAME} || true"
                
                // Run the new container
                sh "docker run -d -p ${PORT}:3000 --name ${CONTAINER_NAME} ${DOCKER_IMAGE}"
                
                echo "Deployment successful! App running on port ${PORT}"
            }
        }
    }
}
