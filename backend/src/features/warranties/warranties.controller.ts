import type { Request, Response } from 'express'
import { getWarranties, createWarranty, updateWarranty, removeWarranty } from './warranties.service.js'
import { validateWarrantyInput } from './warranties.validation.js'

const get = async (req: Request, res: Response) => {
  const user = req.user

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const warranty = await getWarranties({
      role: user.role,
      id: user.user_id
    })
    res.status(200).json(warranty)
  }catch (error: unknown) {
    console.error('Warranty lookup failed', error)
    return res.status(500).json({ error: 'Warranty lookup failed' })
  }
}

const create = async (req: Request, res: Response) => {
  const data = validateWarrantyInput(req.body)
  if (!data) {
    return res.status(400).json({ error: 'Invalid warranty input' })
  }
  
  const user = req.user

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
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
      return res.status(400).json({ error: 'Warranty creation failed' })
    }

    return res.status(201).json(warranty)
  } catch (error: unknown) {
    console.error('Warranty creation failed', error)
    return res.status(500).json({ error: 'Warranty creation failed' })
  }
}


const update = async (req: Request, res: Response) => {
  const data = validateWarrantyInput(req.body)
  if (!data) {
    return res.status(400).json({ error: 'Invalid warranty input' })
  }
  
  const user = req.user

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const warranty_id = req.params.id
  if (typeof warranty_id !== 'string' || !/^[1-9]\d*$/.test(warranty_id)) {
    return res.status(400).json({ error: 'Invalid warranty ID' })
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
      return res.status(400).json({ error: 'Warranty update failed' })
    }

    return res.status(201).json(warranty)
  } catch (error: unknown) {
    console.error('Warranty update failed', error)
    return res.status(500).json({ error: 'Warranty update failed' })
  }
}

const remove = async (req: Request, res: Response) => {
  const user = req.user

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const warranty_id = req.params.id
  if (typeof warranty_id !== 'string' || !/^[1-9]\d*$/.test(warranty_id)) {
    return res.status(400).json({ error: 'Invalid warranty ID' })
  }

  try {
    await removeWarranty(warranty_id)
    return res.status(204).end()
  } catch (error: unknown) {
    console.error('Warranty Delete failed', error)
    return res.status(500).json({ error: 'Warranty Delete failed' })
  }
}


export { 
  get,
  create,
  update,
  remove
}