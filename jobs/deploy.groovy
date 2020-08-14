environments = [
        qa: [
                prefix: 'qa-',
                k8sNode: '$K8S_QA',
                runSmokeTests: 'false'
        ],
        staging: [
                'prefix': 'staging-',
                'k8sNode': '$K8S_STAGING',
                'runSmokeTests': 'false',
        ],
        production: [
                'prefix': '',
                'k8sNode': '$K8S_NGSS_PROD',
                'runSmokeTests': 'true',
        ]
]

environments.each { envName, envParams ->
    pipelineJob("NGSS_authz-bundle-distributor_Deploy-${envName}") {
        parameters {
            stringParam('GIT_VERSION', 'latest')
            stringParam('IMAGE_TAG_OVERRIDE')

            wHideParameterDefinition {
                name('GIT_REPO')
                defaultValue('https://github.com/TwigWorld/authz-bundle-distributor.git')
                description('')
            }

            wHideParameterDefinition {
                name('DEPLOYMENT_NAME')
                defaultValue("${envParams.prefix}authz-bundle-distributor")
                description('')
            }

            wHideParameterDefinition {
                name('ENVIRONMENT')
                defaultValue(envName)
                description('')
            }

            wHideParameterDefinition {
                name('NAMESPACE')
                defaultValue(envName)
                description('')
            }

            wHideParameterDefinition {
                name('K8S_NODE')
                defaultValue(envParams.k8sNode)
                description('')
            }
            wHideParameterDefinition {
                name('FAMILY')
                defaultValue('NGSS')
                description('')
            }
            wHideParameterDefinition {
                name('PREFIX_VERSION')
                defaultValue('2')
                description('')
            }
            wHideParameterDefinition {
                name('VALUE_FILE')
                defaultValue("values.${envName}.yaml")
                description('')
            }
            wHideParameterDefinition {
                name('RUN_SMOKE_TESTS')
                defaultValue(envParams.runSmokeTests)
                description('')
            }
            wHideParameterDefinition {
                name('HELM_EXTRA_ARGS')
                defaultValue('')
                description('')
            }
            wHideParameterDefinition {
                name('SHORT_CIRCUIT_IMAGE_DETECTION')
                defaultValue('')
                description('')
            }
        }

        definition {
            cpsScm {
                lightweight(true)
                scm {
                    git {
                        remote {
                            url('git@github.com:TwigWorld/docker-pipeline.git')
                            credentials('ed184412-3e42-4177-8368-6cc1ed902fcb')
                        }
                        branches('master')
                        scriptPath('Jenkinsfile.deploy')

                    }
                }
            }
        }
    }
}

