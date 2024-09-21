import fp from 'fastify-plugin';
import { z, ZodError } from 'zod';
import { HttpError } from './http-error';

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

export const ErrorResponseSchema = z.object({
    message: z.string(),
    name: z.string(),
    code: z.optional(z.string())
});

export type BadRequestResponse = z.infer<typeof ErrorResponseSchema>;
export const BadRequestResponseSchema = z.array(
    z.object({
        code: z.string(),
        expected: z.string(),
        received: z.string(),
        path: z.array(z.string()),
        message: z.string()
    })
);

export const ErrorsHandlerFastifyPlugin = fp((fastify, _, done) => {
    fastify.setErrorHandler(async (error, _, reply) => {
        if (error.name === 'HttpError' || error instanceof HttpError) {
            const httpError = error as HttpError;
            return reply.code(httpError.statusCode).send({
                message: httpError.message,
                code: httpError.code,
                ...(httpError.payload ? httpError.payload : {})
            });
        } else if (error.name === ZodError.name) {
            return reply
                .code(error.statusCode ?? 400)
                .header('content-type', 'application/json')
                .send(error.message);
        }

        return reply.code(500).send({
            message: error.message,
            name: error.name
        });
    });

    done();
});
