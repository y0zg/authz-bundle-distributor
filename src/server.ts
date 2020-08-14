import * as env from 'env-var';
import * as process from 'process';
import { ServiceShutdownManager } from './utils/serviceShutdownManager';

const port = env
    .get('PORT')
    .required()
    .asPortNumber();

export default (app, context) => {
    const server = app.listen(port, () => context.logger.info(`Server running at port ${port} on PID: ${process.pid}`));
    const managedServer = new ServiceShutdownManager(server);
    managedServer.handleShutdownSignal('SIGTERM');
};
