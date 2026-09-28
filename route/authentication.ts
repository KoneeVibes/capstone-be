import express from "express";
import authorization from "../middleware/authorization.ts";
import signInUser from "../controller/authentication/signin.ts";
import signUpUser from "../controller/authentication/signup.ts";
import forgotPassword from "../controller/authentication/forgotPassword.ts";
import { signOutUser } from "../controller/authentication/signout.ts";
import verifyOTP from "../controller/authentication/verifyOTP.ts";

const router = express.Router();

router.post("/signup", signUpUser);
router.post("/signin", signInUser);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/signout", authorization, signOutUser);

export default router;
