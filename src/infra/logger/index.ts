import pino from 'pino';
import { trace } from '@opentelemetry/api';
import { isProd, isTest } from 'src/utils/env.utils';

export const Logger = pino({
    level: 'debug',
    enabled: isTest() ? false : true,
    ...(isProd()
        ? {}
        : {
              transport: {
                  target: 'pino-pretty',
                  options: {
                      colorize: true
                  }
              }
          }),
    mixin() {
        const currentSpan = trace.getActiveSpan();
        const traceId = currentSpan?.spanContext().traceId;

        if (!traceId) return {};

        const spanId = currentSpan.spanContext().spanId;
        return {
            traceID: traceId,
            spanID: spanId
        };
    }
});
