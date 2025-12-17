import { Request, Response } from "express";

const notFoundHandlerMiddleware = (req : Request , res : Response)=> {
    res.status(404).send('404 not found router') ; 
} 

export default notFoundHandlerMiddleware ; 