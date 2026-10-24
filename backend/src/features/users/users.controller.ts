import type { Request, Response } from "express"

import { getUsers, removeUser } from "./users.service.js"

const get = async(_req: Request, res: Response) => {
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
    if (typeof id !== 'string' || !/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({ error: 'Missing or invalid user_id'})
    }
    const removed = await removeUser(id)
    if (!removed) {
      return res.status(404).json({ error: 'User not found' })
    }
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