import application from './application';
import { applicationContext } from './context';
import server from './server';

const context = applicationContext();
const app = application(context);
server(app, context);
