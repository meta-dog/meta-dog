export const config = () => ({
  app: {
    name: process.env.APP_NAME,
    port: process?.env?.PORT ? process.env.PORT : 3000,
  },
  database: {
    name: process.env.DATABASE_NAME,
    type: process.env.DATABASE_TYPE,
    database: process.env.DATABASE_DB,
    synchronize: true,
    dropSchema: true,
    logging: true,
    entities: ['dist/entities/*.js'],
    migrations: ['dist/migration/**/*.js'],
    subscribers: ['dist/subscriber/**/*.js'],
  },
});
