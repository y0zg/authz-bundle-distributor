import * as Joi from '@hapi/joi';
import { validateBody } from '@twigeducation/joi-request-validation';
import { Router } from 'express';
import { create } from './create';
import { destroy } from './destroy';
import { retrieve } from './retrieve';
import { retrieveList } from './retrieveList';
import { update } from './update';

const paramsSchema = Joi.object({
    // Put JSON schema here
});

const defaultRouter = Router();

defaultRouter
    .route('/bundle/:id')
    .get(retrieve)
    .put(validateBody(paramsSchema), update)
    .delete(destroy);

defaultRouter
    .route('/bundle')
    .get(retrieveList)
    .post(validateBody(paramsSchema), create);

export default defaultRouter;
