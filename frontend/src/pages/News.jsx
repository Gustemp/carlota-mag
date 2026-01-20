import { useRef } from "react"
import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Calendar, User } from "lucide-react"
import { api } from "@/api/client"
import SideMenu from "@/components/layout/SideMenu"

const placeholderArticles = [
  {
    id: "1",
    title: "A Nova Era do Design Sustentável",
    slug: "nova-era-design-sustentavel",
    excerpt: "Como a indústria da moda está se reinventando para um futuro mais consciente e responsável.",
    cover_image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80",
    category: "Sustentabilidade",
    author: "Maria Santos",
    publish_date: "2026-01-15",
    is_featured: true,
  },
  {
    id: "2",
    title: "Tendências de Arte Contemporânea para 2026",
    slug: "tendencias-arte-contemporanea-2026",
    excerpt: "Exploramos as principais exposições e movimentos artísticos que definirão o próximo ano.",
    cover_image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&q=80",
    category: "Arte",
    author: "João Silva",
    publish_date: "2026-01-10",
    is_featured: true,
  },
  {
    id: "3",
    title: "Entrevista Exclusiva: O Futuro da Fotografia",
    slug: "entrevista-futuro-fotografia",
    excerpt: "Conversamos com os principais fotógrafos sobre como a tecnologia está transformando a arte visual.",
    cover_image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80",
    category: "Fotografia",
    author: "Ana Costa",
    publish_date: "2026-01-05",
    is_featured: false,
  },
  {
    id: "4",
    title: "Arquitetura Minimalista em Lisboa",
    slug: "arquitetura-minimalista-lisboa",
    excerpt: "Um tour pelos edifícios mais impressionantes da capital portuguesa.",
    cover_image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80",
    category: "Arquitetura",
    author: "Pedro Almeida",
    publish_date: "2026-01-01",
    is_featured: false,
  },
  {
    id: "5",
    title: "O Renascimento do Vinil",
    slug: "renascimento-vinil",
    excerpt: "Por que os discos de vinil estão conquistando uma nova geração de amantes da música.",
    cover_image: "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=800&q=80",
    category: "Música",
    author: "Sofia Martins",
    publish_date: "2025-12-28",
    is_featured: false,
  },
  {
    id: "6",
    title: "Gastronomia de Autor: Novos Sabores",
    slug: "gastronomia-autor-novos-sabores",
    excerpt: "Os chefs que estão redefinindo a cozinha contemporânea com ingredientes locais.",
    cover_image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    category: "Gastronomia",
    author: "Carlos Ferreira",
    publish_date: "2025-12-20",
    is_featured: false,
  },
]

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
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920&q=80')] bg-cover bg-center" />
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
          News
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
          Últimas notícias sobre arte, cultura e lifestyle
        </motion.p>
      </motion.div>
    </section>
  )
}

function FeaturedArticle({ article, index }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100])

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      viewport={{ once: true }}
      className="group relative"
    >
      <Link to={`/news/${article.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden mb-6">
          <motion.img
            style={{ y }}
            src={article.cover_image}
            alt={article.title}
            className="w-full h-[120%] object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-all duration-500" />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-white text-black text-xs tracking-[0.1em] uppercase">
              {article.category}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-xs text-neutral-400 mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(article.publish_date).toLocaleDateString('pt-PT', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </span>
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {article.author}
          </span>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-light text-black mb-3 group-hover:text-neutral-600 transition-colors">
          {article.title}
        </h2>
        
        <p className="text-neutral-500 leading-relaxed mb-4">
          {article.excerpt}
        </p>
        
        <span className="inline-flex items-center gap-2 text-xs tracking-[0.1em] uppercase text-black group-hover:gap-3 transition-all">
          Ler mais
          <ArrowRight className="w-4 h-4" />
        </span>
      </Link>
    </motion.article>
  )
}

function ArticleCard({ article, index }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [50, -50])

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group"
    >
      <Link to={`/news/${article.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden mb-4">
          <motion.img
            style={{ y }}
            src={article.cover_image}
            alt={article.title}
            className="w-full h-[120%] object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-300" />
        </div>
        
        <span className="text-xs tracking-[0.1em] uppercase text-neutral-400 mb-2 block">
          {article.category}
        </span>
        
        <h3 className="text-lg font-light text-black mb-2 group-hover:text-neutral-600 transition-colors line-clamp-2">
          {article.title}
        </h3>
        
        <p className="text-sm text-neutral-500 line-clamp-2">
          {article.excerpt}
        </p>
      </Link>
    </motion.article>
  )
}

export default function News() {
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['articles', 'published'],
    queryFn: () => api.articles.list(true),
  })

  const displayArticles = articles.length > 0 ? articles : placeholderArticles
  const featuredArticles = displayArticles.filter(a => a.is_featured).slice(0, 2)
  const regularArticles = displayArticles.filter(a => !a.is_featured)

  return (
    <div className="min-h-screen bg-white">
      <SideMenu />
      <HeroSection />

      {/* Featured Articles */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-xs tracking-[0.3em] text-neutral-400 uppercase mb-3">
            Destaques
          </p>
          <h2 className="text-3xl md:text-4xl font-extralight tracking-wide text-black">
            Em Evidência
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {featuredArticles.map((article, index) => (
            <FeaturedArticle key={article.id} article={article} index={index} />
          ))}
        </div>
      </section>

      {/* All Articles */}
      <section className="bg-neutral-50 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <p className="text-xs tracking-[0.3em] text-neutral-400 uppercase mb-3">
              Arquivo
            </p>
            <h2 className="text-3xl md:text-4xl font-extralight tracking-wide text-black">
              Todas as Notícias
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {regularArticles.map((article, index) => (
              <ArticleCard key={article.id} article={article} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-100 py-12 px-6 md:px-12">
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
