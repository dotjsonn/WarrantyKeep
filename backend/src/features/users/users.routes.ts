import { Router } from "express";
import { get, remove } from "./users.controller.js";
import { checkToken } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
const usersRouter = Router()

usersRouter.get('/', checkToken, authorize('admin'), get)
usersRouter.delete('/:id', checkToken, authorize('admin'), remove)

export {
  usersRouter
}