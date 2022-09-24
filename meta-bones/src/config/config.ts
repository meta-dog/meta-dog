interface Config {
  app: { port: number | string };
  database: {
    dbName?: string;
    type?: string;
    uri?: string;
  };
}

export const config = (): Config => ({
  app: { port: process?.env?.PORT ? process.env.PORT : 5000 },
  database: {
    dbName: process.env.DATABASE_NAME,
    type: process.env.DATABASE_TYPE,
    uri: process.env.DATABASE_URL,
  },
});
