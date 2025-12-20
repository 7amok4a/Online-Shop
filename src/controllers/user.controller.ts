import fs from "fs";
import path from "node:path";
import ENV from "../config/env";
import jwt from "jsonwebtoken";
import { CookieOptions } from "express";
import AppDataSource from "../database";
import { User } from "../models/user.module";
import { StatusCodes } from "http-status-codes";
import { AuthPayload, SafeUser } from "../utils/types";
import BadRequestError from "../errors/bad-request.error";
import unAuthenticatedError from "../errors/unAuth.error";
import asyncWrapper from "../middlewares/acyncWrapper.middleware";
import { validateOrReject } from "class-validator";


const userRepositiry = AppDataSource.getRepository(User);

const optionCookie: CookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: ENV.NODE_ENV === "development" ? false : true,
};

const Signup = asyncWrapper(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
        throw new BadRequestError("All filed is required");


    // check if emailis valid: regex 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
        throw new BadRequestError("Invailed Email Format");

    if (password.length < 6)
        throw new BadRequestError("Password is very short");


    const isEmailFounded = await userRepositiry.findOneBy({ email: email });

    if (isEmailFounded)
        throw new BadRequestError("Email is already exit");


    const user = userRepositiry.create({ name, email, password });


    const token = user.createAccessToken();
    const refreshToken = user.createRefreshToken();
    user.refreshToken = refreshToken;

    await userRepositiry.save(user);

    const safeUser: SafeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };

    console.log(refreshToken);

    return res.status(StatusCodes.CREATED).
        cookie("jwt", refreshToken, optionCookie).json({ user: safeUser, token });


});


const Login = asyncWrapper(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        throw new BadRequestError("All Fileds are required");

    const user = await userRepositiry.findOneBy({ email: email });

    if (!user)
        throw new BadRequestError("Email not exit");


    const isMatch = await user.comparePassword(password);

    if (!isMatch)
        throw new BadRequestError("Password is not correct");

    const refreshToken = user.createRefreshToken();
    const token = user.createAccessToken();

    const update = await userRepositiry.update(user.id, { refreshToken: refreshToken });
    console.log(update);


    const safeUser: SafeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };

    console.log(refreshToken);
    console.log(token);

    return res.status(StatusCodes.OK).cookie("jwt", refreshToken, optionCookie).json({ user: safeUser, token });
})


const Logout = asyncWrapper(async (req, res) => {
    const refreshToken: string | undefined = req.cookies?.jwt;

    if (!refreshToken)
        return res.status(StatusCodes.OK).json({ message: "Logout Success" });

    await userRepositiry.update({ refreshToken }, { refreshToken: "" });


    res.clearCookie("jwt", optionCookie);

    return res.status(StatusCodes.OK).json({ message: "Logout Success" });
})



const RefreshToken = asyncWrapper(async (req, res) => {
    const refreshTokens: string | undefined = req.cookies?.jwt;

    if (!refreshTokens)
        throw new unAuthenticatedError("You are not logged in. Please log in to get access");

    const payload = jwt.verify(refreshTokens, ENV.JWT_SECRET_REFRESH) as AuthPayload;

    if (!payload)
        throw new unAuthenticatedError("You are not logged in. Please log in to get access");

    console.log(payload);
    const user = await userRepositiry.findOneBy({ id: payload.id });

    if (!user)
        throw new unAuthenticatedError("User not found");

    const token = user.createAccessToken();

    const safeUser: SafeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };


    return res.status(StatusCodes.OK).json({ user: safeUser, token });
})


const getUserProfile = asyncWrapper(async (req, res) => {

    const user = await userRepositiry.findOneBy({ id: req["user"].id }) as User;


    const safeUser: SafeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };

    res.status(StatusCodes.OK).json({ user: safeUser });
})

const updateUserProfile = asyncWrapper(async (req, res) => {

    if (!req.file) {
        throw new BadRequestError("Profile Image is Required");
    }

    if (req["user"].profileImage) {
        const oldImage = path.join(process.cwd(), req["user"].profileImage);
        if (fs.existsSync(oldImage))
            fs.unlinkSync(oldImage);
    }

    const filename = req.file.filename;
    console.log(filename);


    const imageUrl = `images/${filename}`;


    const newData = {
        name: req.body.name,
        email: req.body.email,
        profileImage: imageUrl,
    }

    const userId = req["user"].id;

    const user = await userRepositiry.findOneBy({ id: userId }) as User;

    user.name = newData.name ?? user.name;
    user.email = newData.email ?? user.email;
    user.profileImage = newData.profileImage;

    await validateOrReject(user);

    await userRepositiry.save(user);

    const safeUser: SafeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };


    res.status(StatusCodes.OK).json(safeUser);
})



const getAllUsers = asyncWrapper(async (req, res) => {
    const users = await userRepositiry.find();

    res.status(StatusCodes.OK).json(users);
})


const getUserDetails = asyncWrapper(async (req, res) => {
    const id = +req.params.id;
    const user = await userRepositiry.findOneBy({ id: id });

    if (!user)
        throw new BadRequestError("User is not found");

    res.status(StatusCodes.OK).json(user);
})



const updateUser = asyncWrapper(async (req, res) => {
    const id = +req.params.id;
    const newData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await userRepositiry.findOneBy({ id: id }) as User;

    user.name = newData.name ?? user.name;
    user.email = newData.email ?? user.email;
    user.role = newData.role;

    await validateOrReject(user);

    await userRepositiry.save(user);

    res.status(StatusCodes.OK).json(user);

})

const deleteUser = asyncWrapper(async (req, res) => {
    const id = +req.params.id;
    const user = await userRepositiry.findOneBy({ id: id });

    if (!user)
        throw new BadRequestError("User is not found");

    if (req["user"].profileImage) {
        const userImage = path.join(process.cwd(), req["user"].profileImage);
        if (fs.existsSync(userImage))
            fs.unlinkSync(userImage);
    }

    await userRepositiry.remove(user);

    res.status(StatusCodes.OK).json({ messasge: "Deleted is Success" });
})

export default {
    Signup,
    Login,
    Logout,
    RefreshToken,
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    getUserDetails,
    updateUser,
    deleteUser,
}