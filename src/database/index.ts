import ENV from "../config/env";
import { DataSource } from "typeorm";

const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: +ENV.DB_PORT!,
    username: ENV.DB_USERNAME,
    password: ENV.DB_PASSWORD,
    database: ENV.DB_NAME,
    entities: [
        ENV.NODE_ENV === "development"
        ? "src/models/*.ts"
        : "dist/models/*.js"
    ],
    synchronize: true,
    logging: false,
})


export default AppDataSource ; 