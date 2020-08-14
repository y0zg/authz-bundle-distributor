import * as request from 'supertest';
import { mocked } from 'ts-jest/utils';
import logger from '../../context/logger';
import application from '../../application';

jest.mock('../../context/logger');

describe('GET /health', () => {
    let app;

    const context: any = {
        logger: mocked(logger),
        jwtPublicKey: 'a-public-key',
    };

    beforeAll(() => {
        process.env.IMAGE_GIT_COMMIT_SHA = 'git-sha';
        process.env.IMAGE_VERSION = 'image-version';
        process.env.IMAGE_BUILD_TIMESTAMP = 'image-timestamp';
        process.env.IMAGE_DEPLOY_TIMESTAMP = 'deploy-timestamp';
        app = request(application(context));
    });

    afterAll(() => {
        process.env.IMAGE_GIT_COMMIT_SHA = undefined;
        process.env.IMAGE_VERSION = undefined;
        process.env.IMAGE_BUILD_TIMESTAMP = undefined;
        process.env.IMAGE_DEPLOY_TIMESTAMP = undefined;
    });

    it('returns a 200 status code', async () => {
        const response = await app.get('/health');
        expect(response.statusCode).toBe(200);
    });

    it('contains `status` key', async () => {
        const response = await app.get('/health');
        const body = JSON.parse(response.text);
        expect(body).toHaveProperty('status');
    });
    it('contains `git_commit_sha` key', async () => {
        const response = await app.get('/health');
        const body = JSON.parse(response.text);
        expect(body).toHaveProperty('git_commit_sha');
    });
    it('contains `image_build_timestamp` key', async () => {
        const response = await app.get('/health');
        const body = JSON.parse(response.text);
        expect(body).toHaveProperty('image_build_timestamp');
    });
    it('contains `image_deploy_timestamp` key', async () => {
        const response = await app.get('/health');
        const body = JSON.parse(response.text);
        expect(body).toHaveProperty('image_deploy_timestamp');
    });
    it('contains `image_version` key', async () => {
        const response = await app.get('/health');
        const body = JSON.parse(response.text);
        expect(body).toHaveProperty('image_version');
    });
});
