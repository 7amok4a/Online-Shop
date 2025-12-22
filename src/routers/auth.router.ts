import express from "express";
import { UserType } from "../utils/enums";
import upload from "../middlewares/uploadFile.middleware";
import authController from "../controllers/user.controller";
import { authMiddleware, authorizedRoles } from "../middlewares/authentication.middleware";



const router = express.Router();


// auth router 
router.post("/signup", authController.Signup);
router.post("/login", authController.Login);
router.post("/logout", authController.Logout);
router.get("/refresh", authController.RefreshToken);

// user router 
router.get("/me", authMiddleware, authController.getUserProfile);
router.put("/me/update", authMiddleware, upload.single('profileImage'), authController.updateUserProfile);
router.get("/check", authMiddleware, (req, res) => res.status(200).json(req["user"])); // refersh page 

// // password router 
router.post("/password/forget", authController.forgetPassword);
router.put("/password/reset/:token", authController.resetPassword);
router.put("/password/update", authMiddleware, authController.updatePassword);




// admin 
router.get("/admin/users", authMiddleware, authorizedRoles(UserType.ADMIN), authController.getAllUsers);
router.get("/admin/user/:id", authMiddleware, authorizedRoles(UserType.ADMIN), authController.getUserDetails);
router.put("/admin/user/:id", authMiddleware, authorizedRoles(UserType.ADMIN), authController.updateUser);
router.delete("/admin/user/:id" , authMiddleware , authorizedRoles(UserType.ADMIN) , authController.deleteUser);

export default router; 