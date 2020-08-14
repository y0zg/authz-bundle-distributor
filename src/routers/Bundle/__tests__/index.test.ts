import { initialiseTokenGenerator, secondsAgo } from '@twigeducation/test-jwt-generator';
import * as router from 'supertest';
import { Mock } from 'ts-mockery';
import application from '../../../application';
import { ApplicationContext } from '../../../context';

const { tokenGenerator: token, publicKey: jwtPublicKey } = initialiseTokenGenerator();

describe('bundle', () => {
    let app;
    let context: ApplicationContext;

    beforeEach(() => {
        context = Mock.of<ApplicationContext>({
            jwtPublicKey,
        });

        app = router(application(context));
    });

    describe('retrieve', () => {
        const validToken = token({});
        const invalidToken = token({ exp: secondsAgo(10) });

        it('returns a 200 on successful response', async () => {
            const response = await app.get(`/bundle/id`).set('Authorization', `Bearer ${validToken}`);
            expect(response.status).toEqual(200);
        });

        it('returns a 401 on invalid token', async () => {
            const response = await app.get(`/bundle/id`).set('Authorization', `Bearer ${invalidToken}`);
            expect(response.status).toEqual(401);
        });
    });

    describe('retrieveList', () => {
        const validToken = token({});
        const invalidToken = token({ exp: secondsAgo(10) });

        it('returns a 200 on successful response', async () => {
            const response = await app.get(`/bundle`).set('Authorization', `Bearer ${validToken}`);
            expect(response.status).toEqual(200);
        });

        it('returns a 401 on invalid token', async () => {
            const response = await app.get(`/bundle`).set('Authorization', `Bearer ${invalidToken}`);
            expect(response.status).toEqual(401);
        });
    });

    describe('create', () => {
        const validToken = token({});
        const invalidToken = token({ exp: secondsAgo(10) });

        it('returns a 201 on successful response', async () => {
            const response = await app.post(`/bundle`).set('Authorization', `Bearer ${validToken}`);
            expect(response.status).toEqual(201);
        });

        it('returns a 401 on invalid token', async () => {
            const response = await app.post(`/bundle`).set('Authorization', `Bearer ${invalidToken}`);
            expect(response.status).toEqual(401);
        });
    });

    describe('update', () => {
        const validToken = token({});
        const invalidToken = token({ exp: secondsAgo(10) });

        it('returns a 200 on successful response', async () => {
            const response = await app.put(`/bundle/id`).set('Authorization', `Bearer ${validToken}`);
            expect(response.status).toEqual(200);
        });

        it('returns a 401 on invalid token', async () => {
            const response = await app.put(`/bundle/id`).set('Authorization', `Bearer ${invalidToken}`);
            expect(response.status).toEqual(401);
        });
    });

    describe('destroy', () => {
        const validToken = token({});
        const invalidToken = token({ exp: secondsAgo(10) });

        it('returns a 200 on successful response', async () => {
            const response = await app.delete(`/bundle/id`).set('Authorization', `Bearer ${validToken}`);
            expect(response.status).toEqual(200);
        });

        it('returns a 401 on invalid token', async () => {
            const response = await app.delete(`/bundle/id`).set('Authorization', `Bearer ${invalidToken}`);
            expect(response.status).toEqual(401);
        });
    });
});
