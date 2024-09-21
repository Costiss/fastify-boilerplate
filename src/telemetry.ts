import * as opentelemetry from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { Resource } from '@opentelemetry/resources';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);

// TRACE EXPORTER
const traceExporter = new OTLPTraceExporter({ url: '' });
const spanProcessor = new BatchSpanProcessor(traceExporter);

//METRICS EXPORTER
const metricsExporter = new OTLPMetricExporter({ url: '' });
const metricsReader = new PeriodicExportingMetricReader({
    exporter: metricsExporter,
    exportIntervalMillis: 1000
});

const otelsdk = new opentelemetry.NodeSDK({
    resource: new Resource({ ['service.name']: 'service-name' }),
    serviceName: 'service-name',
    metricReader: metricsReader,
    spanProcessors: [spanProcessor],
    instrumentations: [getNodeAutoInstrumentations()],
    traceExporter
});
otelsdk.start();

process.on('SIGTERM', () => {
    otelsdk
        .shutdown()
        .then(() => {
            console.log('Tracing terminated');
        })
        .catch((error: unknown) => {
            console.log('Error terminating tracing', error);
        })
        .finally(() => process.exit(0));
});
