import { Router }from "express";
import { UserController } from "../controller/UserController";

const userController = new UserController();

export const userRouter = Router();

userRouter.post("/create", userController.createUser);
userRouter.post('/friend/', userController.makeFriends);
userRouter.delete('/friend/:id', userController.unFriend)
userRouter.get('/feed/:id', userController.getFeedByFriends)
