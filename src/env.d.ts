declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string
    DB_HOST: string
    DB_USER: string
    DB_PASSWORD: string
    DB_DBNAME: string
    DB_URL: string
    REDIS_URL: string
    REDIS_HOST: string
    REDIS_PASSWORD: string
    REDIS_PORT: string
    SESSION_SECRET: string
    CORS_ORIGIN: string
  }
}
