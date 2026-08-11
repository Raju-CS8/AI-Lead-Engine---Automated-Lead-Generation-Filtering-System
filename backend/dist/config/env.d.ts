interface EnvConfig {
    NODE_ENV: string;
    PORT: number;
    ALLOWED_ORIGINS: string[];
    RATE_LIMIT_WINDOW_MS: number;
    RATE_LIMIT_MAX_REQUESTS: number;
    CACHE_TTL_SECONDS: number;
    OVERPASS_TIMEOUT_MS: number;
    JWT_SECRET: string;
}
export declare const env: EnvConfig;
export {};
