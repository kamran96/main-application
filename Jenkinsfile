def COLOR_MAP = [
    'SUCCESS': 'good', 
    'FAILURE': 'danger',
]
properties([pipelineTriggers([githubPush()])])
pipeline {
  agent any  
   environment {
    //put your environment variables
    doError = '0'
    DOCKER_REPO = "registry.digitalocean.com/invyce-images/users-service:${JOB_NAME}"
    ENV= """${sh(
  		returnStdout: true,
  		script: 'declare -n ENV=${GIT_BRANCH}_env ; echo "$ENV"'
    ).trim()}"""
  }
    options {
        buildDiscarder(logRotator(numToKeepStr: '20')) 
  } 
  stages {
    stage ('Build and Test') {
      steps {
        sh '''
        docker build \
        -t ${DOCKER_REPO}:${BUILD_NUMBER} .
        #put your Test cases
        echo 'Starting test cases'
      '''    
    }
  }
    stage ('Artefact') {
      steps {
        sh '''
        
        '''
        }
    }   
  stage ('Deploy') {
    steps {
      sh '''
       
        '''
      }
    }
  stage('Cleanup') {
    steps{
      sh "docker rmi ${DOCKER_REPO}:${BUILD_NUMBER}"
    }
  }
  stage('Success') {
    // when doError is equal to 0, just print a simple message
    when {
        expression { doError == '0' }
    }
    steps {
        echo "Success :)"
    }
  }
}