import { config } from 'dotenv';
config();

export const DBUser = process.env.DBuser;
export const masterKey = process.env.API_KEY;
export const port = process.env.PORT;
export const host = process.env.AppHost;
