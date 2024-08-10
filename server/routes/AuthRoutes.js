import { Router } from "express";
import { login, signup } from "../controllers/AuthController.js";

const authRoutes = Router();

authRoutes.post("/sign-up",signup)
authRoutes.post("/login",login)

export default authRoutes;