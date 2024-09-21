export function getEnv(name: string) {
    return process.env[name] ?? '';
}

export function isProd() {
    return getEnv('NODE_ENV') === 'production';
}

export function isTest() {
    return getEnv('NODE_ENV') === 'test';
}
