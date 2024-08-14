import { Router } from "express";
import { getMessages } from "../controllers/MessagesController.js";
import { verifyToken} from "../middlewares/AuthMiddleware.js";

const MessagesRoutes = Router();

MessagesRoutes.get("/get-messages", verifyToken, getMessages);

export default MessagesRoutes;
