import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getContactsForDmList, searchContacts } from "../controllers/ContactController.js";



const contactRoutes = Router()


contactRoutes.post("/search",verifyToken,searchContacts)
contactRoutes.get("/get-contacts-for-dm",verifyToken,getContactsForDmList)



export default contactRoutes