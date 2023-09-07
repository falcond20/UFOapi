import { config } from 'dotenv';
config();

export const DBUser = process.env.DBuser;
export const DBpassword = process.env.DBpassword;
export const port = process.env.PORT;
export const host = process.env.AppHost;
