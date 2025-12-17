import "reflect-metadata" ; 
import express from "express" ; 
import ENV from "./config/env";
import AppDataSource from "./database";
import authRouter from "./routers/auth.router" ; 
import errorHandlerMiddleware from "./middlewares/errorHnadler.middleware" ; 
import notFoundHandlerMiddleware from "./middlewares/notFoundHandler.middleware";
const app  = express() ; 

app.use(express.json()) ; 
//app.use(express.urlencoded()) ; 


//api endpoints 
app.use("/api/v1/auth" , authRouter) ;  
app.use(errorHandlerMiddleware) ; 
app.use(notFoundHandlerMiddleware) ; 

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