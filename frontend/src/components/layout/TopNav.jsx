import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Search, ArrowUpRight } from "lucide-react"

const links = [
  { path: "/", label: "Latest", external: false },
  { path: "/magazines", label: "Magazines", external: false },
  { path: "/services", label: "Services", external: false },
  { path: "/contact", label: "Subscribe", external: false, arrow: true },
]

/**
 * Logo mark — simple C monogram inspired by i-D's distinctive glyph.
 * 3 quick clicks = admin backdoor (same UX as before).
 */
function LogoMark({ onClick, light = false }) {
  return (
    <button
      onClick={onClick}
      aria-label="Carlota — home"
      className="flex items-center gap-2 select-none"
    >
      <span
        className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center font-editorial italic font-black text-xl md:text-2xl leading-none ${
          light ? "bg-white text-black" : "bg-black text-white"
        }`}
      >
        C
      </span>
      <span
        className={`font-editorial italic font-black text-2xl md:text-3xl leading-none tracking-tight hidden sm:inline ${
          light ? "text-white" : "text-black"
        }`}
      >
        carlota<span className="text-red-600">.</span>
      </span>
    </button>
  )
}

export default function TopNav({ variant = "light" }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [clicks, setClicks] = useState(0)
  const navigate = useNavigate()
  const timer = useRef(null)

  useEffect(() => {
    if (clicks >= 3) {
      setClicks(0)
      navigate("/admin")
      return
    }
    if (clicks > 0) {
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setClicks(0), 700)
    }
    return () => clearTimeout(timer.current)
  }, [clicks, navigate])

  const onLogo = (e) => {
    e.preventDefault()
    const next = clicks + 1
    setClicks(next)
    if (next < 3) navigate("/")
  }

  const isDark = variant === "dark"
  const bg = isDark ? "bg-black text-white border-white/10" : "bg-white text-black border-black/10"

  return (
    <header className={`sticky top-0 z-50 ${bg} border-b`}>
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-[72px] gap-6">
          {/* Logo (left) */}
          <LogoMark onClick={onLogo} light={isDark} />

          {/* Desktop nav (right) */}
          <nav className="hidden md:flex items-center gap-7">
            {links.map((l) => (
              <Link
                key={l.path}
                to={l.path}
                className="group text-[13px] tracking-tight font-medium hover:text-red-600 transition-colors flex items-center gap-1"
              >
                {l.label}
                {l.arrow && <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />}
              </Link>
            ))}
            <button
              onClick={() => setSearchOpen((s) => !s)}
              className="text-[13px] tracking-tight font-medium hover:text-red-600 flex items-center gap-1.5"
              aria-label="Search"
            >
              <Search className="w-4 h-4" /> Search
            </button>
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden w-10 h-10 -mr-2 flex items-center justify-center"
            aria-label="Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Inline search */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="py-4 border-t border-current/10">
                <input
                  autoFocus
                  type="text"
                  placeholder="Search articles, issues, people…"
                  className="w-full bg-transparent text-2xl md:text-4xl font-editorial italic outline-none placeholder:opacity-30"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[60]"
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              className="fixed top-0 right-0 h-full w-80 bg-white text-black z-[70] flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-black/10">
                <span className="font-editorial italic font-black text-2xl leading-none">
                  carlota<span className="text-red-600">.</span>
                </span>
                <button onClick={() => setMobileOpen(false)} className="w-10 h-10 flex items-center justify-center">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 py-6 px-6 overflow-y-auto">
                <ul className="space-y-1">
                  {[
                    { path: "/", label: "Latest" },
                    { path: "/news", label: "News" },
                    { path: "/magazines", label: "Magazines" },
                    { path: "/services", label: "Services" },
                    { path: "/contact", label: "Contact" },
                  ].map((l) => (
                    <li key={l.path}>
                      <Link
                        to={l.path}
                        onClick={() => setMobileOpen(false)}
                        className="block py-3 text-3xl font-editorial italic font-bold"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 border-t border-black/10 text-[11px] tracking-[0.2em] uppercase opacity-60">
                © {new Date().getFullYear()} Carlota
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
