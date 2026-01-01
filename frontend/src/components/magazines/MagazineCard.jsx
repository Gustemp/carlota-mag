import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"

export default function MagazineCard({ magazine, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative"
    >
      <Link to={`/reader?id=${magazine.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
          {magazine.cover_image ? (
            <img
              src={magazine.cover_image}
              alt={magazine.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-black">
              <span className="text-white text-2xl font-light tracking-[0.3em]">
                CARLOTA
              </span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1 }}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center">
                <ArrowUpRight className="w-6 h-6 text-white" />
              </div>
            </motion.div>
          </div>
        </div>
        
        <div className="mt-6 space-y-2">
          <p className="text-xs tracking-[0.2em] text-neutral-500 uppercase">
            {magazine.edition || "Edição Especial"}
          </p>
          <h3 className="text-lg font-light tracking-wide text-black">
            {magazine.title}
          </h3>
          {magazine.publish_date && (
            <p className="text-sm text-neutral-400">
              {new Date(magazine.publish_date).toLocaleDateString('pt-BR', {
                month: 'long',
                year: 'numeric'
              })}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
