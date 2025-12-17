import ENV from "../config/env";
import AppDataSource from "../database";
import { User } from "../models/user.module";
import { StatusCodes } from "http-status-codes";
import asyncWrapper from "../middlewares/acyncWrapper";
import BadRequestError from "../errors/bad-request.error";



const userRepositiry = AppDataSource.getRepository(User) ; 


const Signup = asyncWrapper(async(req , res)=> {
    const {name , email , password} = req.body ;
    
    if (!name || !email || !password) 
        throw new BadRequestError("All filed is required") ; 

    /*  -> Enity make validation not need this now 
        // check if emailis valid: regex 
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) 
            throw new BadRequestError("Invailed Email Format") ; 

        if (password.length < 6) 
            throw new BadRequestError("Password is very short") ; 

    */
    const isEmailFounded = await userRepositiry.findOneBy({email : email}) ; 

    if (isEmailFounded) 
        throw new BadRequestError("Email is already exit") ; 


    const user = userRepositiry.create({name , email , password}) ;

    
    const token = user.createAccessToken() ; 
    const refreshToken = user.createRefreshToken() ; 
    user.refreshToken = refreshToken ; 

    await userRepositiry.save(user) ; 

    res.status(StatusCodes.CREATED).cookie( "jwt", refreshToken , {
        maxAge: 7 * 24 * 60 * 60 * 1000, 
        httpOnly: true, 
        sameSite: "strict", 
        secure: ENV.NODE_ENV === "development" ? false : true,
    }).json({user , token}) ; 

    

}) ;




export default {
    Signup , 
}