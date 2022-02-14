import { Router } from "express";
import { CreateUserController } from "./useCase/CreateUserController";

const router = Router();

const createUser = new CreateUserController

router.post('/users', createUser.handle)

export { router }