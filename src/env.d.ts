declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string
    DB_HOST: string
    DB_USER: string
    DB_PASSWORD: string
    DB_DBNAME: string
    REDIS_HOST: string
    REDIS_PASSWORD: string
    SESSION_SECRET: string
    CORS_ORIGIN: string
  }
}
