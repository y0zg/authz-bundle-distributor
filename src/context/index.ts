import * as env from 'env-var';
import logger from './logger';

const jwtPublicKey = env
    .get('JWT_PUBLIC_KEY')
    .required()
    .asString()
    .replace(/\\n/g, '\n');

export const applicationContext = () => ({
    jwtPublicKey,
    logger,
});

export type ApplicationContext = ReturnType<typeof applicationContext>;
