import { Router } from "express";
import {
  renderSignUpForm,
  signup,
  renderSigninForm,
  signin,
  renderOtpForm,
  logout,
  otp,
} from "../controllers/auth.controllers.js";

const router = Router();

// Routes
router.get("/auth/signup", renderSignUpForm);

router.post("/auth/signup", signup);

router.get("/auth/signin", renderSigninForm);

router.post("/auth/signin", signin);

router.get("/auth/otp", renderOtpForm);

router.post("/auth/otp", otp);

router.get("/auth/logout", logout);

export default router;
