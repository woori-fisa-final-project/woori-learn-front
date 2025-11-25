pipeline {
    agent any

    environment {
        AWS_HOST = "43.200.2.107"
        DOCKER_IMAGE = "bae1234/woori-learn-front:latest"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Frontend') {
            agent {
                docker {
                    image 'node:20'
                    args '-u root:root'
                }
            }
            steps {
                sh """
                npm install
                npm run build
                """
            }
        }

        stage('Docker Build') {
            steps {
                sh "docker build -t ${DOCKER_IMAGE} ."
            }
        }

        stage('Docker Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-cred',
                                                 usernameVariable: 'DOCKERHUB_USR',
                                                 passwordVariable: 'DOCKERHUB_PSW')]) {
                    sh """
                    echo "${DOCKERHUB_PSW}" | docker login -u "${DOCKERHUB_USR}" --password-stdin
                    docker push ${DOCKER_IMAGE}
                    """
                }
            }
        }

        stage('Deploy to AWS') {
            steps {
                sshagent(['aws-ssh-key']) {
                    sh """
ssh -o StrictHostKeyChecking=no ubuntu@${AWS_HOST} << 'EOF'
docker pull ${DOCKER_IMAGE}
docker rm -f woori_frontend || true
docker run -d --name woori_frontend -p 3000:3000 \
    -e NEXT_PUBLIC_API_BASE_URL="http://43.200.2.107:8080" \
    ${DOCKER_IMAGE}
EOF
                    """
                }
            }
        }
    }
}

