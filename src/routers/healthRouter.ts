import * as env from 'env-var';
import * as express from 'express';

const router = express.Router();

router
    .route('/')
    .get((_, res) =>
        res.status(200).send({
            status: 'ok',
            service_name: 'authz-bundle-distributor',
            git_commit_sha: env.get('IMAGE_GIT_COMMIT_SHA').asString(),
            image_version: env.get('IMAGE_VERSION').asString(),
            image_build_timestamp: env.get('IMAGE_BUILD_TIMESTAMP').asString(),
            image_deploy_timestamp: env.get('IMAGE_DEPLOY_TIMESTAMP').asString(),
        }),
    )
    .head((_, res) => res.status(200).send());

export default router;
