pipeline {
    agent any

    environment {
        AWS_HOST = "43.202.43.243"
        DOCKER_IMAGE = "bae1234/woori-learn-front:latest"
        API_BASE = "http://43.202.43.243:8080"
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
                docker build \
                  --build-arg NEXT_PUBLIC_API_BASE_URL=${API_BASE} \
                  -t ${DOCKER_IMAGE} .
                """
            }
        }

        stage('Docker Push') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-cred',
                    usernameVariable: 'DOCKERHUB_USR',
                    passwordVariable: 'DOCKERHUB_PSW'
                )]) {
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
ssh -o StrictHostKeyChecking=no ubuntu@${AWS_HOST} << EOF
docker pull ${DOCKER_IMAGE}
docker rm -f woori_frontend || true
docker run -d --name woori_frontend -p 3000:3000 ${DOCKER_IMAGE}
EOF
                    """
                }
            }
        }
    }
}

