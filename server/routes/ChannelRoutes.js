import Router from "express";
import {
  createChannel,
  getChannelMessages,
  getUserChannels,
} from "../controllers/ChannelController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const channelRoutes = Router();

channelRoutes.post("/create-channel", verifyToken, createChannel);
channelRoutes.get("/get-user-channels", verifyToken, getUserChannels);
channelRoutes.get("/get-channel-messages", verifyToken, getChannelMessages);

export default channelRoutes;
