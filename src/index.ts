import getServer from './app';

const server = await getServer();

server.listen({ port: Number(process.env.PORT || 3000), host: '0.0.0.0' }, (err) => {
    if (err) {
        server.log.error(err);
        process.exit(1);
    }
});
