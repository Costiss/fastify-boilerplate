import fs from 'fs';
import path from 'path';
import getServer from '../src/app';

const server = await getServer();
await server.ready();

const schema = JSON.stringify(server.swagger());

fs.writeFileSync(path.join(__dirname, 'openapi.json'), schema, { flag: 'w+' });

await server.close();

console.log('OpenAPI Spec generated successfully');
process.exit(0);
