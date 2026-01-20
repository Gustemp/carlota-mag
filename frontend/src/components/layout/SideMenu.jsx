import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"

const menuItems = [
  { path: "/magazines", label: "Magazines" },
  { path: "/news", label: "News" },
  { path: "/services", label: "Services" },
  { path: "/contact", label: "Contact" },
]

export default function SideMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [logoClicks, setLogoClicks] = useState(0)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (logoClicks >= 3) {
      navigate("/admin")
      setLogoClicks(0)
    }
    
    const timer = setTimeout(() => setLogoClicks(0), 2000)
    return () => clearTimeout(timer)
  }, [logoClicks, navigate])

  const handleLogoClick = (e) => {
    e.preventDefault()
    setLogoClicks(prev => prev + 1)
    if (logoClicks < 2) {
      navigate("/")
    }
  }

  return (
    <>
      {/* Menu Button - Fixed */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 left-6 z-50 w-12 h-12 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 group"
        aria-label="Abrir menu"
      >
        <Menu className="w-5 h-5 text-neutral-800 group-hover:scale-110 transition-transform" />
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Side Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-0 left-0 h-full w-80 bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-100">
              <button
                onClick={handleLogoClick}
                className="cursor-pointer"
              >
                <img 
                  src="/logo-black.png" 
                  alt="Carlota" 
                  className="h-8 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'block'
                  }}
                />
                <span className="hidden text-xl font-light tracking-[0.2em] text-black uppercase">
                  Carlota
                </span>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
                aria-label="Fechar menu"
              >
                <X className="w-5 h-5 text-neutral-600" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 py-8 px-6">
              <ul className="space-y-1">
                {menuItems.map((item, index) => {
                  const isActive = location.pathname === item.path
                  return (
                    <motion.li
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`block py-4 px-4 text-sm tracking-[0.15em] uppercase transition-all duration-300 rounded-lg ${
                          isActive
                            ? "bg-black text-white"
                            : "text-neutral-600 hover:bg-neutral-50 hover:text-black"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </motion.li>
                  )
                })}
              </ul>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-neutral-100">
              <p className="text-xs tracking-[0.15em] text-neutral-400 uppercase">
                © {new Date().getFullYear()} Carlota Mag
              </p>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}
