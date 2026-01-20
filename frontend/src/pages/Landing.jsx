import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, BookOpen, Newspaper, Briefcase, Mail } from "lucide-react"
import SideMenu from "@/components/layout/SideMenu"

const sections = [
  {
    id: "magazines",
    title: "Magazines",
    subtitle: "Arquivo Digital",
    description: "Explore nossa coleção exclusiva de edições da Carlota Magazine. Arte, cultura e lifestyle em cada página.",
    icon: BookOpen,
    link: "/magazines",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=1200&q=80",
  },
  {
    id: "news",
    title: "News",
    subtitle: "Últimas Notícias",
    description: "Fique por dentro das tendências, eventos e novidades do mundo da moda, arte e cultura.",
    icon: Newspaper,
    link: "/news",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80",
  },
  {
    id: "services",
    title: "Services",
    subtitle: "Nossos Serviços",
    description: "Assessoria em Relações Públicas, Patrocínio na Magazine e soluções personalizadas para sua marca.",
    icon: Briefcase,
    link: "/services",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
  },
  {
    id: "contact",
    title: "Contact",
    subtitle: "Fale Conosco",
    description: "Entre em contato para parcerias, colaborações ou qualquer informação adicional.",
    icon: Mail,
    link: "/contact",
    image: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1200&q=80",
  },
]

function HeroSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100])

  return (
    <section ref={ref} className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <motion.div 
        style={{ scale }}
        className="absolute inset-0 bg-black"
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80')] bg-cover bg-center opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />
      </motion.div>

      {/* Content */}
      <motion.div 
        style={{ opacity, y }}
        className="relative z-10 text-center px-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <img 
            src="/logo-white.jpeg" 
            alt="Carlota" 
            className="h-20 md:h-32 lg:h-40 mx-auto mb-8 object-contain"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'block'
            }}
          />
          <h1 className="hidden text-5xl md:text-7xl lg:text-8xl font-extralight tracking-[0.3em] text-white uppercase mb-8">
            Carlota
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="w-20 h-px bg-white/40 mx-auto mb-8"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-white/70 text-sm md:text-base tracking-[0.3em] uppercase font-light mb-12"
        >
          Magazine & Lifestyle
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <Link
            to="/magazines"
            className="inline-flex items-center gap-3 px-8 py-4 border border-white/30 text-white text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-500"
          >
            Explorar
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border border-white/30 rounded-full flex items-start justify-center p-2"
        >
          <motion.div className="w-1 h-2 bg-white/60 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}

function SectionCard({ section, index }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  const isEven = index % 2 === 0

  return (
    <motion.section
      ref={ref}
      style={{ opacity }}
      className="min-h-screen flex items-center py-20 md:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className={`grid md:grid-cols-2 gap-12 md:gap-20 items-center ${isEven ? '' : 'md:flex-row-reverse'}`}>
          {/* Image */}
          <motion.div
            style={{ y: isEven ? y : undefined }}
            className={`relative aspect-[4/5] overflow-hidden ${isEven ? '' : 'md:order-2'}`}
          >
            <img
              src={section.image}
              alt={section.title}
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-all duration-500" />
          </motion.div>

          {/* Content */}
          <div className={`${isEven ? '' : 'md:order-1'}`}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <p className="text-xs tracking-[0.3em] text-neutral-400 uppercase mb-4">
                {section.subtitle}
              </p>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extralight tracking-wide text-black mb-6">
                {section.title}
              </h2>
              
              <div className="w-16 h-px bg-black/20 mb-8" />
              
              <p className="text-neutral-600 text-lg font-light leading-relaxed mb-10 max-w-md">
                {section.description}
              </p>

              <Link
                to={section.link}
                className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white text-xs tracking-[0.2em] uppercase hover:bg-neutral-800 transition-all duration-300 group"
              >
                Descobrir
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

function FooterSection() {
  return (
    <footer className="bg-black text-white py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-3 gap-12 mb-16">
          {/* Logo & Description */}
          <div>
            <img 
              src="/logo-white.jpeg" 
              alt="Carlota" 
              className="h-12 mb-6 object-contain"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'block'
              }}
            />
            <h3 className="hidden text-2xl font-light tracking-[0.2em] uppercase mb-6">Carlota</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Uma publicação dedicada à arte, cultura e lifestyle contemporâneo.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase mb-6">Navegação</h4>
            <ul className="space-y-3">
              {sections.map(section => (
                <li key={section.id}>
                  <Link 
                    to={section.link}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {section.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase mb-6">Contato</h4>
            <ul className="space-y-3 text-white/60 text-sm">
              <li>contato@carlotamag.com</li>
              <li>Lisboa, Portugal</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs tracking-[0.15em] text-white/40 uppercase">
            © {new Date().getFullYear()} Carlota Magazine. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default function Landing() {
  return (
    <div className="bg-white">
      <SideMenu />
      <HeroSection />
      {sections.map((section, index) => (
        <SectionCard key={section.id} section={section} index={index} />
      ))}
      <FooterSection />
    </div>
  )
}
