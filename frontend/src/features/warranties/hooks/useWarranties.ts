import { useEffect, useState } from 'react'
import { getErrorMessage } from '../../../utils/errors'
import { getWarranties } from '../services/warrantyService'
import type { Warranty } from '../types/warranties.types'

const useWarranties = () => {
  const [warranties, setWarranties] = useState<Warranty[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    const loadWarranties = async () => {
      try {
        const data = await getWarranties()
        if (!ignore) setWarranties(data)
      } catch (error: unknown) {
        if (!ignore) setError(getErrorMessage(error))
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadWarranties()

    return () => {
      ignore = true
    }
  }, [])

  const refreshWarranties = async () => {
    const data = await getWarranties()
    setWarranties(data)
  }

  return { warranties, loading, error, refreshWarranties }
}

export default useWarranties
