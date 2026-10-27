import { Router } from 'express'
import { get } from './dashboard.controller.js'
import { checkToken } from '../../middlewares/auth.middleware.js'
import { authorize } from '../../middlewares/role.middleware.js'

const dashboardRouter = Router()

dashboardRouter.get('/', checkToken, authorize('user', 'admin'), get)

export { dashboardRouter }
