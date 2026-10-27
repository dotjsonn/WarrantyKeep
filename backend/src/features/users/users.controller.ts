import type { Request, Response } from "express"

import { getUsers, removeUser } from "./users.service.js"
import { isValidId } from '../../utils/validationPatterns.js'
import { getPagination, getQueryString } from '../../utils/pagination.js'
import { logServerError } from '../../utils/logger.js'

const get = async(req: Request, res: Response) => {
  try {
    const users = await getUsers({
      ...getPagination(req),
      search: getQueryString(req, 'search').slice(0, 100)
    })
    res.status(200).json(users)
  } catch(error: unknown) {
    logServerError('Users lookup failed', error)
    return res.status(500).json({ error: 'Unable to load users right now. Please try again later.' })
  }
}

const remove  = async(req: Request, res: Response) => {
  try {
    const id = req.params.id
    if (!isValidId(id)) {
      return res.status(400).json({ error: 'Please provide a valid user ID.' })
    }
    const removed = await removeUser(id)
    if (!removed) {
      return res.status(404).json({ error: 'This user could not be found or has already been deleted.' })
    }
    res.status(204).end()
  } catch(error: unknown) {
    logServerError('User deletion failed', error)
    return res.status(500).json({ error: 'Unable to delete the user right now. Please try again later.' })
  }
}


export { 
  get,
  remove
}
