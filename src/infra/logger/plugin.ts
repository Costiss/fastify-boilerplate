import fp from 'fastify-plugin';

export const LoggerFastifyPlugin = fp((fastify, _, done) => {
    fastify.addHook('onResponse', (request, response, done) => {
        const userAgent = request.headers['user-agent'];
        const elapsed = response.elapsedTime || 0;
        const fullpath = `${request.protocol}://${request.headers.host || request.hostname}${request.originalUrl}`;
        request.log.info(
            {
                httpRequest: {
                    latency: `${(elapsed / 1000).toFixed(2)}s`,
                    requestMethod: request.method,
                    requestUrl: fullpath,
                    status: response.statusCode,
                    userAgent
                },
                path: request.originalUrl
            },
            fullpath
        );

        done();
    });
    done();
});
