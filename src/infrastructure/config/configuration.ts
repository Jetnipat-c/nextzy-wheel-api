export interface Configuration {
  app: {
    nodeEnv: string;
    port: number;
  };
}

export const configuration = (): Configuration => ({
  app: {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT) || 3000,
  },
});
