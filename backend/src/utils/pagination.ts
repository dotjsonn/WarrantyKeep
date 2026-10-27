import type { Request } from 'express'
import { controlCharactersGlobalPattern, unsignedIntegerPattern } from './validationPatterns.js'

type Pagination = {
  page: number;
  limit: number;
  offset: number;
}

const firstQueryValue = (value: Request['query'][string]): string | undefined => {
  const candidate = Array.isArray(value) ? value[0] : value
  return typeof candidate === 'string' ? candidate : undefined
}

const parsePositiveInteger = (value: string | undefined, fallback: number) => {
  if (!value || !unsignedIntegerPattern.test(value)) return fallback
  const parsed = Number(value)
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback
}

const getPagination = (req: Request, defaultLimit = 8): Pagination => {
  const requestedPage = parsePositiveInteger(firstQueryValue(req.query.page), 1)
  const requestedLimit = parsePositiveInteger(firstQueryValue(req.query.limit), defaultLimit)
  const limit = Math.min(requestedLimit, 50)
  const page = Math.min(requestedPage, Math.floor(Number.MAX_SAFE_INTEGER / limit))

  return { page, limit, offset: (page - 1) * limit }
}

const getQueryString = (req: Request, key: string) => {
  return (firstQueryValue(req.query[key]) ?? '').replace(controlCharactersGlobalPattern, '').trim()
}

export { getPagination, getQueryString }
export type { Pagination }
