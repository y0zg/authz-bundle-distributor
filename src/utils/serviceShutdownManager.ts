import * as moebius from '@moebius/http-graceful-shutdown';
import logger from '../context/logger';

class ServiceShutdownManager {
    private moebiusShutdownManager: moebius.GracefulShutdownManager;

    public constructor(server) {
        this.moebiusShutdownManager = this.initialise(server);
    }

    private initialise(server): moebius.GracefulShutdownManager {
        const shutdownManager = new moebius.GracefulShutdownManager(server);
        return shutdownManager;
    }

    public handleShutdownSignals(signals: [NodeJS.Signals]) {
        signals.forEach(signal => this.handleShutdownSignal(signal));
    }

    public handleShutdownSignal(signal: NodeJS.Signals) {
        logger.verbose(`Setup service process ${process.pid} to handle signal ${signal}`);
        process.on(signal, () => {
            logger.info(`Received ${signal}, handling shutdown.`);
            this.moebiusShutdownManager.terminate(() => {
                logger.info('Service terminated.');
            });
        });
    }
}

export { ServiceShutdownManager };
