pipeline {
    agent any

    environment {
        DOCKERHUB = credentials('dockerhub-cred')
        AWS_HOST = "43.200.2.107"
        DOCKER_IMAGE = "bae1234/woori-learn-front:latest"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Docker Build') {
            steps {
                sh """
                docker build -t ${DOCKER_IMAGE} .
                """
            }
        }

        stage('Docker Push') {
            steps {
                sh """
                echo "${DOCKERHUB_PSW}" | docker login -u "${DOCKERHUB_USR}" --password-stdin
                docker push ${DOCKER_IMAGE}
                """
            }
        }

        stage('Deploy to AWS') {
            steps {
                sshagent(['aws-ssh-key']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ubuntu@${AWS_HOST} '
                        docker pull ${DOCKER_IMAGE} &&
                        docker rm -f woori_frontend || true &&
                        docker run -d --name woori_frontend -p 3000:3000 ${DOCKER_IMAGE}
                    '
                    """
                }
            }
        }
    }
}

