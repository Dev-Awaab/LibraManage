import "dotenv/config";
import { NODE_ENV } from "../types/enums";

export interface Config {
  port: number;
  nodeEnv: NODE_ENV;
  databaseName: string;
  databasePassword: string;
  databaseHost: string;
  databaseUser: string;
  databaseSchema: string;
}

export const getConfig = (): Config => {
  const required: string[] = [
    "NODE_ENV",
    "DATABASE_NAME",
    "DATABASE_HOST",
    "DATABASE_PASSWORD",
    "DATABASE_USER",
  ];

  if (!process.env.CI) {
    // Do not require this check in CI
    required.forEach((variable) => {
      if (!process.env[variable]) throw new Error(`${variable} env not set`);
    });
  }

  return {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: (process.env.NODE_ENV as NODE_ENV) || NODE_ENV.DEVELOPMENT,
    databaseName: process.env.DATABASE_NAME!,
    databaseHost: process.env.DATABASE_HOST!,
    databaseUser: process.env.DATABASE_USER!,
    databasePassword: process.env.DATABASE_PASSWORD!,
    databaseSchema: process.env.DATABASE_SCHEMA!,

  };
};
