@Library('SeaTrial')
import com.twig_world.seatrial.Utils

String gitCommitAuthor

pipeline {
    agent none

    environment {

        String family = 'NGSS'
        String application = new Utils().getRepoName()
        
        String slaveCredsId = 'jenkins-aws-credentials' 
        String gitCredsId = 'jenkins-github-https' 
        
        String registryHost = '817276302724.dkr.ecr.eu-west-1.amazonaws.com' 
        String repositoryName = "${family}/${application}".toLowerCase() 
        String imageName = "${registryHost}/${repositoryName}"
        
        String imageTag = new Utils().getImageTag() 

    }

    stages {
        stage('Create Deploy Jobs') {
            agent { label 'master' }
            when { branch 'master' } 
            steps {
                jobDsl targets: 'jobs/deploy.groovy',
                removedJobAction: 'DELETE'
            }
        }

        stage('Build Docker Image') {
            agent { label 'docker' }
            steps {
                composeBuild (
                    registryHost: registryHost,
                    repoName: repositoryName,
                    imageTag: imageTag,
                    commands: ['make build'],
                )
            }
        }

        stage('Test') {
            parallel {
                stage('Container Vulnerability Scan') {
                    agent { label 'docker' }
                    steps {
                        clairScan(
                                registryHost: registryHost,
                                repoName: repositoryName,
                                imageTag: imageTag,
                        )
                    }
                }

                stage('Run Unit Tests') {
                    agent { label 'docker' }
                    steps {
                        script {
                            withEnv(["DOCKER_TAG=:${imageTag}"]) {
                                sh 'make test'
                            }
                        }
                    }
                    post {
                        always {
                            junit 'reports/**/*.xml'
                        }
                    }
                }

                stage('Run Linter') {
                    agent { label 'docker' }
                    steps {
                        script {
                            withEnv(["DOCKER_TAG=:${imageTag}"]) {
                                sh 'make lint'
                            }
                        }
                    }
                }

                stage('Test Image Starts') {
                    agent { label 'docker' }
                    steps {
                        composeRun (
                            imageTag: imageTag,
                            service: application,
                        )
                    }
                }

                stage('Test deployment code') {
                    agent { label env.K8S_CI }
                    environment {
                        prefix = "/${family}/${application}/ci"
                    }
                    steps {
                        script {
                            utils = new Utils()
                            accessKey = utils.getSsmParameter(slaveCredsId, prefix, 'AWS_ACCESS_KEY_ID').Value
                            secretKey = utils.getSsmParameter(slaveCredsId, prefix, 'AWS_SECRET_ACCESS_KEY').Value
                            helm (
                                imageRepositoryName: repositoryName,
                                slaveAwsCreds: slaveCredsId,
                                imageTag: imageTag,
                                namespace: 'ci',
                                valuesFile: 'values.yaml',
                                awsAccessKey: accessKey,
                                awsSecretKey: secretKey,
                                autodelete: true
                            )
                        }
                    }
                }
            }
        }

        stage('Publish') {
            agent { label 'docker' }
            steps {
                script {
                    utils.publishImageTags(imageName, imageTag)
                    utils.publishGitTag(gitCredsId)
                }
            }
        }
        
        stage('Deploy to QA') {
            agent { label 'master' }
            steps {
                script {
                    if ( env.BRANCH_NAME == 'master' ) {
                        build (
                            job: "${family}_${application}_Deploy-qa",
                            parameters: [
                                [$class: 'StringParameterValue', name: 'GIT_VERSION', value: env.GIT_COMMIT]
                            ]
                        )
                    } else {
                        org.jenkinsci.plugins.pipeline.modeldefinition.Utils.markStageSkippedForConditional(STAGE_NAME)
                    }
                }
            }
        }
    }

    post {
        failure {
            script {
                if ( env.BRANCH_NAME == 'master' ) {
                    slackSend channel: '#tech_issues',
                    color: 'danger',
                    message: "${currentBuild.fullDisplayName}\nBuild failure on master branch\n${gitCommitAuthor}"
                } 
            }
        }
    }
}
