import { useEffect, useRef, useState } from 'react'
import { getErrorMessage } from '../../../utils/errors'
import { getWarranties } from '../services/warrantyService'
import type { WarrantyPage, WarrantyQuery } from '../types/warranties.types'

type UseWarrantiesOptions = WarrantyQuery & { onPageOutOfRange?: (page: number) => void }

const useWarranties = ({
  page = 1,
  limit = 8,
  scope = 'all',
  status = 'all',
  search = '',
  onPageOutOfRange
}: UseWarrantiesOptions = {}) => {
  const [data, setData] = useState<WarrantyPage>({
    items: [],
    pagination: { page, limit, total: 0, total_pages: 0 },
    summary: { all: 0, active: 0, expired: 0 }
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshVersion, setRefreshVersion] = useState(0)
  const requestGeneration = useRef({ value: 0 })

  useEffect(() => {
    const tracker = requestGeneration.current
    const generation = ++tracker.value

    const loadWarranties = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await getWarranties({ page, limit, scope, status, search })
        if (generation === tracker.value) {
          const lastPage = Math.max(1, result.pagination.total_pages)
          if (page > lastPage) onPageOutOfRange?.(lastPage)
          setData(result)
        }
      } catch (error: unknown) {
        if (generation === tracker.value) setError(getErrorMessage(error))
      } finally {
        if (generation === tracker.value) setLoading(false)
      }
    }

    loadWarranties()

    return () => {
      tracker.value++
    }
  }, [limit, page, scope, search, status, refreshVersion, onPageOutOfRange])

  // Reload through the effect so a completed mutation uses the current filter,
  // rather than the filter captured when the mutation started.
  const refreshWarranties = () => setRefreshVersion(version => version + 1)

  return {
    warranties: data.items,
    pagination: data.pagination,
    summary: data.summary,
    loading,
    error,
    refreshWarranties
  }
}

export default useWarranties
