import ENV from "../config/env";
import AppDataSource from "../database";
import { User } from "../models/user.module";
import { StatusCodes } from "http-status-codes";
import asyncWrapper from "../middlewares/acyncWrapper";
import BadRequestError from "../errors/bad-request.error";
import { CookieOptions } from "express";



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

    res.status(StatusCodes.CREATED).cookie("jwt", refreshToken, optionCookie).json({ user, token });


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


    res.status(StatusCodes.OK).cookie("jwt", refreshToken, optionCookie).json({ user, token });
})


const Logout = asyncWrapper(async (req, res) => {
    const refreshToken: string | undefined = req.cookies.jwt;

    if (!refreshToken)
        res.status(StatusCodes.OK).json({ message: "Logout Success" });

    await userRepositiry.update({ refreshToken }, { refreshToken: "" });


    res.clearCookie("jwt", optionCookie);

    return res.status(StatusCodes.OK).json({ message: "Logout Success" });
})



const RefreshToken = asyncWrapper(async (req, res) => {

})

export default {
    Signup,
    Login,
    Logout,
    RefreshToken,
}