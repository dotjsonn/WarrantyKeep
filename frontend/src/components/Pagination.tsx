type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const getPageNumbers = (page: number, totalPages: number) => {
  if (totalPages <= 5) return Array.from({ length: totalPages }, (_, index) => index + 1)
  const start = Math.min(Math.max(page - 2, 1), totalPages - 4)
  return Array.from({ length: 5 }, (_, index) => start + index)
}

const Pagination = ({ page, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null

  return (
    <nav className="flex min-w-0 items-center justify-between gap-2 border-t-[1.5px] border-line px-4 py-3.5 sm:flex-wrap sm:justify-end" aria-label="Pagination">
      <button
        className="inline-flex h-11 min-w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border-[1.5px] border-line bg-transparent px-3 font-medium disabled:cursor-default disabled:opacity-40"
        type="button"
        aria-label="Previous page"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        <span className="hidden sm:inline">Previous</span><span className="text-[22px] sm:hidden" aria-hidden="true">‹</span>
      </button>
      <span className="min-w-0 text-center text-sm text-muted sm:hidden">Page {page} of {totalPages}</span>
      {getPageNumbers(page, totalPages).map(pageNumber => (
        <button
          key={pageNumber}
          className="hidden h-11 min-w-11 cursor-pointer rounded-lg border-[1.5px] border-line bg-transparent px-3 font-medium aria-[current=page]:border-brand aria-[current=page]:bg-brand aria-[current=page]:text-white sm:inline-block"
          type="button"
          aria-label={`Page ${pageNumber}`}
          aria-current={pageNumber === page ? 'page' : undefined}
          onClick={() => onPageChange(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}
      <button
        className="inline-flex h-11 min-w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border-[1.5px] border-line bg-transparent px-3 font-medium disabled:cursor-default disabled:opacity-40"
        type="button"
        aria-label="Next page"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <span className="hidden sm:inline">Next</span><span className="text-[22px] sm:hidden" aria-hidden="true">›</span>
      </button>
    </nav>
  )
}

export default Pagination
