declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string
      DB_HOST: string
      DB_USER: string
      DB_PASSWORD: string
      DB_NAME: string
      DB_URL: string
      REDIS_URL: string
      REDIS_HOST: string
      REDIS_PORT: string
      SESSION_SECRET: string
      ADMIN_EMAIL: string
      ADMIN_PASS: string
    }
  }
}

export {}
