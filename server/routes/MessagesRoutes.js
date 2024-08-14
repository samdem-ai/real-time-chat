import { Router } from "express";
import multer from "multer";
import { getMessages, uploadFile } from "../controllers/MessagesController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const MessagesRoutes = Router();
const upload = multer({
  dest: "uploads/files/",
  limits: {
    fileSize: 10000000,
  },
  fileFilter(req, file, cb) {
    cb(undefined, true);
  },
});

MessagesRoutes.get("/get-messages", verifyToken, getMessages);
MessagesRoutes.post(
  "/upload-file",
  verifyToken,
  upload.single("file"),
  uploadFile
);

export default MessagesRoutes;
