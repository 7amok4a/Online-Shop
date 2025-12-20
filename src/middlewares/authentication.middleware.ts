import jwt from "jsonwebtoken";
import ENV from "../config/env";
import AppDataSource from "../database";
import { UserType } from "../utils/enums";
import { User } from "../models/user.module";
import { StatusCodes } from "http-status-codes";
import CustomAPIError from "../errors/custom.error";
import { AuthPayload, SafeUser } from "../utils/types";
import unAuthenticatedError from "../errors/unAuth.error";
import { NextFunction, Request, Response } from "express";




const userRepositiry = AppDataSource.getRepository(User);


const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer '))
        throw new unAuthenticatedError("Authentication is not vailed middleware");

    const token = authHeader.split(' ')[1];

    try {

        const payload = jwt.verify(token, ENV.JWT_SECRET_ACCESS) as AuthPayload;
        const user = await userRepositiry.findOneBy({ id: payload.id }) as SafeUser;
        req["user"] = user;

        next();

    } catch (err) {
        throw new unAuthenticatedError("Authentication is not vailed middleware");
    }

}

const authorizedRoles = (...roles: UserType[]) => {
    return (req: Request, res: Response, next: NextFunction) => {

        if (!roles.includes(req["user"].role)) {
            return next(new CustomAPIError("You are not allowed to access this resource", StatusCodes.FORBIDDEN));
        }

        next();
    }
}

export {
    authMiddleware, authorizedRoles
}; 