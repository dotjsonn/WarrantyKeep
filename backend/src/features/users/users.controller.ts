import type { Request, Response } from "express"

import { getUsers, removeUser } from "./users.service.js"

const get = async(req: Request, res: Response) => {
  try {
    const users = await getUsers()
    res.status(200).json(users)
  } catch(error: unknown) {
    console.error('Users lookup failed', error)
    return res.status(500).json({ error: 'Users lookup failed' })
  }
}

const remove  = async(req: Request, res: Response) => {
  try {
    const id = req.params.id
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid user_id'})
    }
    await removeUser(id)
    res.status(204).end()
  } catch(error: unknown) {
    console.error('User deletion failed', error)
    return res.status(500).json({ error: 'User deletion failed' })
  }
}


export { 
  get,
  remove
}