import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { api } from "@/api/client"
import MagazineGrid from "@/components/magazines/MagazineGrid"

export default function Home() {
  const { data: magazines = [], isLoading } = useQuery({
    queryKey: ['magazines', 'published'],
    queryFn: () => api.magazines.list(true),
  })

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="relative h-[60vh] md:h-[70vh] bg-black flex items-center justify-center overflow-hidden">
        {/* Background Images Grid */}
        <div className="absolute inset-0 grid grid-cols-4 md:grid-cols-6 gap-2 p-4 opacity-10">
          {magazines.slice(0, 12).map((mag, i) => (
            mag.cover_image && (
              <motion.div
                key={mag.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="relative aspect-[3/4] rounded-sm overflow-hidden"
              >
                <img
                  src={mag.cover_image}
                  alt=""
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
              </motion.div>
            )
          ))}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center z-10 px-4"
        >
          <img 
            src="/logo-white.jpeg" 
            alt="Carlota" 
            className="h-16 md:h-24 lg:h-32 mx-auto mb-6"
          />
          <div className="w-24 h-px bg-white/30 mx-auto mb-6" />
          <p className="text-white/60 text-sm md:text-base tracking-[0.3em] uppercase font-light">
            Magazine
          </p>
        </motion.div>
      </header>

      {/* Magazine Grid Section */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-16"
        >
          <p className="text-xs tracking-[0.3em] text-neutral-400 uppercase mb-3">
            Arquivo
          </p>
          <h2 className="text-3xl md:text-4xl font-extralight tracking-wide text-black">
            Edições
          </h2>
        </motion.div>

        <MagazineGrid magazines={magazines} isLoading={isLoading} />
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-100 py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs tracking-[0.2em] text-neutral-400 uppercase">
            © {new Date().getFullYear()} Carlota Mag
          </p>
          <Link 
            to="/admin"
            className="text-xs tracking-[0.2em] text-neutral-400 hover:text-black transition-colors uppercase"
          >
            Admin
          </Link>
        </div>
      </footer>
    </div>
  )
}
