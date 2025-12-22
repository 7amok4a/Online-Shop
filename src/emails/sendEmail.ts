import ENV from "../config/env";
import nodemailer from "nodemailer" ; 
import { createResetPasswordTemplate } from "./emailTemplates";


const sendEmail = async (email : string , name : string  , url : string )=> {
    const transport = nodemailer.createTransport({
        service : "gamil" , 
        auth : {
            user  :  ENV.Sender_Mail, 
            pass :  ENV.App_pass , 
        }
    })


    const mailOptions = {
        from : ENV.Sender_Mail , 
        to : email , 
        subject : "Reset Password"  , 
        html : createResetPasswordTemplate(name , url)  , 
    }


    transport.sendMail(mailOptions , (err , success) => {
        if(err)
            console.log(err) ; 
        else 
            console.log(success.response) ; 
    })
}



export default sendEmail ; 