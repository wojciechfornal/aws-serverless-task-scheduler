import { start } from './server.ts';

import packageJSON from './../package.json' with { type: 'json' };

const PROJECT_NAME: string = 'AWS Serverless Task Scheduler';

console.log(`${PROJECT_NAME} ${packageJSON.version}`);

start();