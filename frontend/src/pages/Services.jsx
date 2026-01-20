import { useRef } from "react"
import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Megaphone, BookOpen, Palette, Camera, Users, Award } from "lucide-react"
import { api } from "@/api/client"
import SideMenu from "@/components/layout/SideMenu"

const placeholderServices = [
  {
    id: "1",
    title: "Assessoria em Relações Públicas",
    slug: "assessoria-relacoes-publicas",
    description: "Desenvolvemos estratégias de comunicação personalizadas para posicionar sua marca no mercado. Nossa equipe especializada cuida de toda a gestão de imagem, relacionamento com a mídia e criação de narrativas que conectam sua marca ao público-alvo.",
    icon: "Megaphone",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    order: 1,
  },
  {
    id: "2",
    title: "Patrocínio na Magazine",
    slug: "patrocinio-magazine",
    description: "Associe sua marca à Carlota Magazine e alcance um público sofisticado e engajado. Oferecemos diferentes formatos de parceria, desde anúncios tradicionais até conteúdos editoriais exclusivos e eventos especiais.",
    icon: "BookOpen",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80",
    order: 2,
  },
  {
    id: "3",
    title: "Direção de Arte",
    slug: "direcao-arte",
    description: "Criamos conceitos visuais únicos para campanhas, editoriais e projetos especiais. Nossa direção de arte combina estética refinada com storytelling visual impactante.",
    icon: "Palette",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
    order: 3,
  },
  {
    id: "4",
    title: "Produção Fotográfica",
    slug: "producao-fotografica",
    description: "Produzimos ensaios fotográficos de alta qualidade para marcas, artistas e projetos editoriais. Do conceito à pós-produção, cuidamos de cada detalhe.",
    icon: "Camera",
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80",
    order: 4,
  },
  {
    id: "5",
    title: "Gestão de Eventos",
    slug: "gestao-eventos",
    description: "Organizamos eventos exclusivos que criam experiências memoráveis. De lançamentos a exposições, transformamos conceitos em momentos únicos.",
    icon: "Users",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    order: 5,
  },
  {
    id: "6",
    title: "Consultoria de Marca",
    slug: "consultoria-marca",
    description: "Ajudamos marcas a definir sua identidade, posicionamento e estratégia de comunicação. Um trabalho profundo de branding que gera resultados duradouros.",
    icon: "Award",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
    order: 6,
  },
]

const iconMap = {
  Megaphone,
  BookOpen,
  Palette,
  Camera,
  Users,
  Award,
}

function HeroSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section ref={ref} className="relative h-[70vh] flex items-center justify-center overflow-hidden">
      <motion.div 
        style={{ y }}
        className="absolute inset-0"
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-black/60" />
      </motion.div>

      <motion.div 
        style={{ opacity }}
        className="relative z-10 text-center px-6"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white/60 text-xs tracking-[0.3em] uppercase mb-4"
        >
          Carlota Magazine
        </motion.p>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-extralight tracking-wide text-white mb-6"
        >
          Services
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-20 h-px bg-white/40 mx-auto mb-6"
        />
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-white/70 text-sm md:text-base tracking-wide max-w-md mx-auto"
        >
          Soluções criativas para elevar sua marca
        </motion.p>
      </motion.div>
    </section>
  )
}

function ServiceCard({ service, index }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const isEven = index % 2 === 0
  const IconComponent = iconMap[service.icon] || Megaphone

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="py-20 md:py-32 border-b border-neutral-100 last:border-b-0"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className={`grid md:grid-cols-2 gap-12 md:gap-20 items-center ${isEven ? '' : 'md:flex-row-reverse'}`}>
          {/* Image */}
          <div className={`relative aspect-[4/3] overflow-hidden ${isEven ? '' : 'md:order-2'}`}>
            <motion.img
              style={{ y }}
              src={service.image}
              alt={service.title}
              className="w-full h-[130%] object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-all duration-500" />
          </div>

          {/* Content */}
          <div className={`${isEven ? '' : 'md:order-1'}`}>
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-8">
              <IconComponent className="w-7 h-7 text-white" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-extralight tracking-wide text-black mb-6">
              {service.title}
            </h2>
            
            <div className="w-12 h-px bg-black/20 mb-6" />
            
            <p className="text-neutral-600 text-lg leading-relaxed mb-8">
              {service.description}
            </p>

            <Link
              to="/contact"
              className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white text-xs tracking-[0.2em] uppercase hover:bg-neutral-800 transition-all duration-300 group"
            >
              Solicitar Orçamento
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function CTASection() {
  return (
    <section className="bg-black py-20 md:py-32">
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-extralight tracking-wide text-white mb-6">
            Vamos criar algo extraordinário juntos?
          </h2>
          
          <p className="text-white/60 text-lg mb-10 max-w-2xl mx-auto">
            Entre em contato para discutir como podemos ajudar a elevar sua marca ao próximo nível.
          </p>

          <Link
            to="/contact"
            className="inline-flex items-center gap-3 px-10 py-5 border border-white/30 text-white text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-500 group"
          >
            Fale Conosco
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default function Services() {
  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services', 'active'],
    queryFn: () => api.services.list(true),
  })

  const displayServices = services.length > 0 ? services : placeholderServices

  return (
    <div className="min-h-screen bg-white">
      <SideMenu />
      <HeroSection />

      {/* Services List */}
      <section>
        {displayServices.map((service, index) => (
          <ServiceCard key={service.id} service={service} index={index} />
        ))}
      </section>

      <CTASection />

      {/* Footer */}
      <footer className="border-t border-neutral-100 py-12 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs tracking-[0.2em] text-neutral-400 uppercase">
            © {new Date().getFullYear()} Carlota Mag
          </p>
          <Link 
            to="/"
            className="text-xs tracking-[0.2em] text-neutral-400 hover:text-black transition-colors uppercase"
          >
            Home
          </Link>
        </div>
      </footer>
    </div>
  )
}
