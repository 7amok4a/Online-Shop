import path from "node:path";
import dotenv from "dotenv";


dotenv.config({ path: path.resolve(__dirname, "../../.env") });
interface ENVConfig {
    PORT: number;
    DB_PORT: number;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    NODE_ENV: string;
    JWT_SECRET_REFRESH: string;
    JWT_SECRET_ACCESS: string;
    RESERSH_JWT_EXPIRES_TIME: string;
    ACCESS_JWT_EXPIRES_TIME: string;
}

const ENV: ENVConfig = {
    PORT: +process.env.PORT!,
    DB_PORT: +process.env.DB_PORT!,
    DB_USERNAME: process.env.DB_USERNAME!,
    DB_PASSWORD: process.env.DB_PASSWORD!,
    DB_NAME: process.env.DB_NAME!,
    NODE_ENV: process.env.NODE_ENV!,
    JWT_SECRET_REFRESH: process.env.JWT_SECRET_REFRESH!,
    JWT_SECRET_ACCESS: process.env.JWT_SECRET_ACCESS!,
    RESERSH_JWT_EXPIRES_TIME: process.env.RESERSH_JWT_EXPIRES_TIME!,
    ACCESS_JWT_EXPIRES_TIME: process.env.ACCESS_JWT_EXPIRES_TIME!,
}


export default ENV; 