import express from "express" ; 
import ENV from "./config/env";


const app  = express() ; 



app.listen(ENV.PORT , ()=> {console.log(`Server is running in http://localhost:${ENV.PORT}`)}) ; 