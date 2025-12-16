import path from "node:path";
import dotenv from "dotenv" ; 


dotenv.config({path : path.resolve(__dirname , "../../.env")}) ; 


const ENV = {
    PORT : process.env.PORT , 
    DB_PORT : process.env.DB_PORT, 
    DB_USERNAME : process.env.DB_USERNAME , 
    DB_PASSWORD : process.env.DB_PASSWORD, 
    DB_NAME : process.env. DB_NAME , 
    NODE_ENV : process.env.NODE_ENV , 
} 


export default ENV ; 