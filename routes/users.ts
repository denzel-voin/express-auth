import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import {register} from "../controllers/user/register";
import {login} from "../controllers/user/login";
import {getProfile} from "../controllers/user/getProfile";

const usersRouter = Router();

usersRouter.post("/register", register);

usersRouter.post("/login", login);

usersRouter.get('/profile', authMiddleware, getProfile);

export default usersRouter;
