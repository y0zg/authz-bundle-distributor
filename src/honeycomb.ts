import * as env from 'env-var';
import * as beeline from 'honeycomb-beeline';
import logger from './context/logger';

if (!process.env.SUPPRESS_LOGS) {
    logger.info('Starting honeycomb');
}

beeline({
    writeKey: env.get('HONEYCOMB_WRITE_KEY').asString(),
    dataset: env.get('HONEYCOMB_DATASET').asString(),
    serviceName: 'authz-bundle-distributor',
    impl: env
        .get('HONEYCOMB_ENABLED')
        .default('false')
        .asBool()
        ? undefined
        : 'mock',
    express: {
        userContext: () => false, // We do this separately in order to override key
    },
    samplerHook: eventData => {
        if ('request.path' in eventData && eventData['request.path'].includes('health')) {
            return { shouldSample: false, newSampleRate: 0 };
        }
        return { shouldSample: true, newSampleRate: 1 };
    },
    presendHook: event => {
        const imageVersion = env.get('IMAGE_VERSION').asString();
        const commitSha = env.get('IMAGE_GIT_COMMIT_SHA').asString();
        if (imageVersion && commitSha) {
            event.add({
                'build.version': imageVersion,
                'build.commit_sha': commitSha,
            });
        }
    },
});
