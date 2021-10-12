declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string
    DB_URL: string
    REDIS_URL: string
    REDIS_HOST: string
    REDIS_PORT: string
    SESSION_SECRET: string
    CORS_ORIGIN: string
  }
}
