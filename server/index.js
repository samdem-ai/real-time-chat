import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import contactRoutes from "./routes/ContactRoutes.js";
import setupSocket from "./socket.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const databaseURL = process.env.DATABASE_URL;

app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use("/uploads/profiles",express.static("uploads/profiles"))

app.use(cookieParser());
app.use(express.json());


app.use("/api/auth",authRoutes)
app.use("/api/contacts",contactRoutes)

const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

setupSocket(server)

mongoose
  .connect(databaseURL)
  .then(() => console.log("Connected to DB yay!"))
  .catch((e) => console.log(e.message));
