pipeline {
    agent any

    environment {
        AWS_HOST = "52.79.70.229"
        DOCKER_IMAGE = "bae1234/woori-learn-front:latest"
        API_BASE = "http://52.79.70.229:8080"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build & Deploy on AWS') {
            steps {
                sshagent(['aws-ssh-key']) {
                    withCredentials([
                        usernamePassword(
                            credentialsId: 'dockerhub-cred',
                            usernameVariable: 'DOCKERHUB_USR',
                            passwordVariable: 'DOCKERHUB_PSW'
                        )
                    ]) {

                        sh '''
ssh -o StrictHostKeyChecking=no ubuntu@${AWS_HOST} << 'EOF'

# -----------------------------------------
# 1) 프로젝트 디렉토리 준비
# -----------------------------------------
if [ ! -d "woori-learn-front" ]; then
    git clone https://github.com/woori-fisa-final-project/woori-learn-front.git
fi

cd woori-learn-front
git pull origin aws-test

# -----------------------------------------
# 2) Docker Build (AWS에서 실행)
# -----------------------------------------
docker build \
  --build-arg NEXT_PUBLIC_API_BASE_URL=${API_BASE} \
  -t ${DOCKER_IMAGE} .

# -----------------------------------------
# 3) Docker Hub Login & Push
# -----------------------------------------
echo "${DOCKERHUB_PSW}" | docker login -u "${DOCKERHUB_USR}" --password-stdin
docker push ${DOCKER_IMAGE}

# -----------------------------------------
# 4) 기존 컨테이너 종료 후 프론트 재실행
# -----------------------------------------
docker rm -f woori_frontend || true

docker run -d --name woori_frontend -p 3000:3000 ${DOCKER_IMAGE}

# -----------------------------------------
# 5) Docker 이미지 정리 (dangling, 불필요 레이어 삭제)
# -----------------------------------------
docker image prune -f
docker system prune -f

EOF
'''
                    }
                }
            }
        }
    }
}

