import { Router } from 'express'
import { get, create, update, remove } from './warranties.controller.js'
import { checkToken } from '../../middlewares/auth.middleware.js'
import { authorize } from '../../middlewares/role.middleware.js'

const warrantyRouter = Router()

warrantyRouter.get('/', checkToken, authorize('user','admin'), get)

warrantyRouter.post('/', checkToken, authorize('user','admin'), create)
warrantyRouter.put('/:id', checkToken, authorize('user','admin'), update)
warrantyRouter.delete('/:id', checkToken, authorize('user', 'admin'), remove)

export {
  warrantyRouter
}
