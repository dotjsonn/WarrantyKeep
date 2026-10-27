import { Link } from 'react-router'
import logo from '../assets/logo.png'

const Brand = () => (
  <Link
    to="/dashboard"
    aria-label="WarrantyKeep dashboard"
    title="WarrantyKeep"
    className="inline-flex min-w-0 max-w-full items-center gap-2 font-heading text-xl leading-none font-extrabold tracking-[-0.02em] text-inherit no-underline sm:gap-2.5 sm:text-[22px]"
  >
    <span className="relative inline-block h-9 w-12 shrink-0 overflow-hidden rounded-md bg-[#f3ead0] sm:w-14" aria-hidden="true">
      <img
        src={logo}
        alt=""
        width="1254"
        height="1254"
        className="absolute top-1/2 left-1/2 w-16 max-w-none -translate-x-1/2 -translate-y-1/2"
        decoding="async"
      />
    </span>
    <span className="min-w-0 wrap-anywhere">WarrantyKeep</span>
  </Link>
)

export default Brand
