import express from "express" ; 
import authController from "../controllers/user.controller" ; 

const router = express.Router() ; 


// auth router 
router.post("/signup" , authController.Signup) ; 
// router.post("/login") ; 
// router.post("/logout") ; 
// router.get("/refresh") ; 


// // password router 
// router.post("/password/forget") ; 
// router.put("/password/reset/:token") ; 
// router.put("/password/update") ; 


// // user router 
// router.get("/me") ; 
// router.put("/me/update") ; 

// // admin 
// router.get("/admin/users") ; 
// router.get("/admin/user/:id") ; 
// router.put("/admin/user/:id") ; 
// router.delete("/admin/user/:id") ; 

export default router ; 