import './honeycomb';
import * as newrelic from 'newrelic';
import * as Sentry from '@sentry/node';
import * as env from 'env-var';
import * as express from 'express';
import * as morgan from 'morgan';
import {
    addUserInfoToHoneycombContext,
    fallbackErrorHandler,
    statusErrorHandler,
} from '@twigeducation/express-middleware-lib';
import { requireAuthentication, authenticationErrorHandler } from '@twigeducation/express-authentication-middleware';
import { ApplicationContext } from './context';
import healthRouter from './routers/healthRouter';
import notFoundRouter from './routers/notFoundRouter';
import routers from './routers';

export default (context: ApplicationContext) => {
    const app = express();
    app.locals.context = context;
    app.locals.sentry = Sentry;

    app.use(express.json({ limit: '500kb' }));
    app.use('/health', healthRouter);
    if (!process.env.SUPPRESS_LOGS) {
        app.use(
            morgan(
                env
                    .get('LOG_FORMAT_MORGAN')
                    .required()
                    .asString(),
                {},
            ),
        );
    }

    if (env.get('NEW_RELIC_ENABLED').asBool()) {
        app.locals.newrelic = newrelic;
    }

    if (env.get('SENTRY_ENABLED').asBool()) {
        Sentry.init({
            debug:
                env
                    .get('LOG_LEVEL')
                    .default('')
                    .asString()
                    .toLowerCase() === 'debug',
            dsn: env.get('SENTRY_DSN').asString(),
            environment: env.get('SENTRY_ENVIRONMENT').asString(),
        });
        app.use(Sentry.Handlers.requestHandler() as express.RequestHandler);
    }

    app.use(requireAuthentication({ publicKey: context.jwtPublicKey }));
    if (env.get('HONEYCOMB_ENABLED').asBool()) {
        app.use(addUserInfoToHoneycombContext);
    }
    routers.forEach(router => {
        app.use(router);
    });
    app.use(authenticationErrorHandler);
    app.use(statusErrorHandler);
    env.get('SENTRY_ENABLED').asBool() && app.use(Sentry.Handlers.errorHandler());
    app.use(fallbackErrorHandler);
    app.use('*', notFoundRouter);

    return app;
};
