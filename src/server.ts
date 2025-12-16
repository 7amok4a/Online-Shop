import "reflect-metadata" ; 
import express from "express" ; 
import ENV from "./config/env";
import AppDataSource from "./database";


const app  = express() ; 



const start = async()=> {
    try {
        await AppDataSource.initialize() ; 
        console.log("Database is connected") ; 
        app.listen(ENV.PORT , ()=> {console.log(`Server is running in http://localhost:${ENV.PORT}`)}) ; 
    }catch(err) {
        console.log(err) ; 
    }

}

start() ; 