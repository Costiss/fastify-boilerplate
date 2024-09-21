export class HttpError extends Error {
    constructor(
        readonly statusCode: number,
        readonly message: string,
        readonly code?: string,
        readonly payload?: unknown
    ) {
        super(message);
        this.name = 'HttpError';
    }
}
