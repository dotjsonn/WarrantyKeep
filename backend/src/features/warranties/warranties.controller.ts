import type { Request, Response } from 'express'
import { getWarranties, createWarranty, updateWarranty, removeWarranty } from './warranties.service.js'
import { validateWarrantyInput } from './warranties.validation.js'
import { isValidId } from '../../utils/validationPatterns.js'
import { getPagination, getQueryString } from '../../utils/pagination.js'
import { logServerError } from '../../utils/logger.js'

const get = async (req: Request, res: Response) => {
  const user = req.user

  if (!user) {
    return res.status(401).json({ error: 'Please log in to continue.' })
  }

  try {
    const pagination = getPagination(req)
    const requestedScope = getQueryString(req, 'scope')
    const requestedStatus = getQueryString(req, 'status')
    const scope = ['all', 'own', 'others'].includes(requestedScope) ? requestedScope : 'all'
    const status = ['active', 'expired'].includes(requestedStatus) ? requestedStatus : 'all'
    const search = getQueryString(req, 'search').slice(0, 100)

    const warranty = await getWarranties({
      role: user.role,
      id: user.user_id,
      scope,
      status,
      search,
      ...pagination
    })
    res.status(200).json(warranty)
  }catch (error: unknown) {
    logServerError('Warranty lookup failed', error)
    return res.status(500).json({ error: 'Unable to load warranties right now. Please try again later.' })
  }
}

const create = async (req: Request, res: Response) => {
  const validation = validateWarrantyInput(req.body)
  if (!validation.data) {
    return res.status(400).json({ error: validation.error })
  }
  const data = validation.data
  
  const user = req.user

  if (!user) {
    return res.status(401).json({ error: 'Please log in to continue.' })
  }

  try {
    const warranty = await createWarranty({
      user_id: user.user_id,
      name: data.name,
      purchase_date: data.purchase_date,
      warranty_months: data.warranty_months,
      receipt_url: data.receipt_url
    })

    if (!warranty) {
      return res.status(500).json({ error: 'Unable to create the warranty right now. Please try again later.' })
    }

    return res.status(201).json(warranty)
  } catch (error: unknown) {
    logServerError('Warranty creation failed', error)
    return res.status(500).json({ error: 'Unable to create the warranty right now. Please try again later.' })
  }
}


const update = async (req: Request, res: Response) => {
  const validation = validateWarrantyInput(req.body)
  if (!validation.data) {
    return res.status(400).json({ error: validation.error })
  }
  const data = validation.data
  
  const user = req.user

  if (!user) {
    return res.status(401).json({ error: 'Please log in to continue.' })
  }
  const warranty_id = req.params.id
  if (!isValidId(warranty_id)) {
    return res.status(400).json({ error: 'Please provide a valid warranty ID.' })
  }

  try {
    const warranty = await updateWarranty({
      warranty_id,
      user_id: user.user_id,
      name: data.name,
      purchase_date: data.purchase_date,
      warranty_months: data.warranty_months,
      receipt_url: data.receipt_url
    })

    if (!warranty) {
      return res.status(404).json({ error: 'This warranty could not be found or is not available for you to edit.' })
    }

    return res.status(200).json(warranty)
  } catch (error: unknown) {
    logServerError('Warranty update failed', error)
    return res.status(500).json({ error: 'Unable to update the warranty right now. Please try again later.' })
  }
}

const remove = async (req: Request, res: Response) => {
  const user = req.user

  if (!user) {
    return res.status(401).json({ error: 'Please log in to continue.' })
  }
  const warranty_id = req.params.id
  if (!isValidId(warranty_id)) {
    return res.status(400).json({ error: 'Please provide a valid warranty ID.' })
  }

  try {
    const removed = await removeWarranty({
      warranty_id,
      user_id: user.user_id,
      role: user.role
    })
    if (!removed) {
      return res.status(404).json({ error: 'This warranty could not be found or has already been deleted.' })
    }
    return res.status(204).end()
  } catch (error: unknown) {
    logServerError('Warranty deletion failed', error)
    return res.status(500).json({ error: 'Unable to delete the warranty right now. Please try again later.' })
  }
}


export { 
  get,
  create,
  update,
  remove
}
