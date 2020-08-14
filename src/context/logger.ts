import * as env from 'env-var';
import * as winston from 'winston';

const { combine, timestamp, label, printf } = winston.format;

const level = env
    .get('LOG_LEVEL')
    .required()
    .asString();

const myFormat = printf(info => {
    return `${info.timestamp} [${info.level}]: ${info.message}`;
});

export default winston.createLogger({
    format: combine(label({ label: level }), timestamp(), myFormat),
    transports: [new winston.transports.Console({ level })],
});
