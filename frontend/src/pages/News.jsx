import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Link, useSearchParams } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"
import { api } from "@/api/client"
import TopNav from "@/components/layout/TopNav"
import Footer from "@/components/layout/Footer"

const placeholder = [
  { id: "1", title: "A Nova Era do Design Sustentável", slug: "nova-era-design-sustentavel", excerpt: "Como a indústria da moda está se reinventando para um futuro mais consciente.", cover_image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1200&q=80", category: "Fashion", author: "Maria Santos", publish_date: "2026-01-15", is_featured: true },
  { id: "2", title: "Tendências de Arte Contemporânea", slug: "tendencias-arte", excerpt: "Exposições e movimentos que definirão o próximo ano.", cover_image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=1200&q=80", category: "Art", author: "João Silva", publish_date: "2026-01-10", is_featured: true },
  { id: "3", title: "O Futuro da Fotografia", slug: "futuro-fotografia", excerpt: "Como a tecnologia está transformando a arte visual.", cover_image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200&q=80", category: "Culture", author: "Ana Costa", publish_date: "2026-01-05" },
  { id: "4", title: "Arquitetura Minimalista em Lisboa", slug: "arquitetura-lisboa", excerpt: "Um tour pelos edifícios mais impressionantes da capital.", cover_image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&q=80", category: "Culture", author: "Pedro Almeida", publish_date: "2026-01-01" },
  { id: "5", title: "O Renascimento do Vinil", slug: "renascimento-vinil", excerpt: "Por que os discos estão conquistando uma nova geração.", cover_image: "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=1200&q=80", category: "Music", author: "Sofia Martins", publish_date: "2025-12-28" },
  { id: "6", title: "Gastronomia de Autor", slug: "gastronomia-autor", excerpt: "Chefs redefinindo a cozinha contemporânea com ingredientes locais.", cover_image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80", category: "Culture", author: "Carlos Ferreira", publish_date: "2025-12-20" },
  { id: "7", title: "Beauty files: the gloss is back", slug: "gloss-is-back", excerpt: "Por que o brilho exagerado é o mood da estação.", cover_image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=80", category: "Beauty", author: "Ana Costa", publish_date: "2026-01-18" },
  { id: "8", title: "Street style: Barcelona", slug: "street-barcelona", excerpt: "Raw, real e muito bem vestido.", cover_image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80", category: "Fashion", author: "Flora Medina", publish_date: "2026-01-16" },
]

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()
}

function Card({ article, size = "md" }) {
  const titleCls = {
    hero: "text-4xl md:text-6xl lg:text-7xl leading-[0.95]",
    lg: "text-2xl md:text-3xl leading-[1.05]",
    md: "text-xl leading-tight",
  }[size]
  return (
    <Link to={`/news/${article.slug}`} className="group block">
      <div className={`relative overflow-hidden bg-neutral-100 mb-4 ${size === "hero" ? "aspect-[16/10]" : "aspect-[4/5]"}`}>
        {article.cover_image && (
          <img
            src={article.cover_image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]"
          />
        )}
        <span className="absolute top-3 left-3 bg-white text-black text-[10px] tracking-[0.25em] uppercase px-2 py-1">
          {article.category}
        </span>
      </div>
      <h3 className={`font-editorial font-bold ${titleCls} group-hover:italic transition-all`}>
        {article.title}
      </h3>
      {size !== "md" && article.excerpt && (
        <p className="mt-3 text-neutral-600 line-clamp-2 max-w-prose">{article.excerpt}</p>
      )}
      <div className="mt-3 flex items-center gap-3 text-[10px] tracking-[0.2em] uppercase text-neutral-500">
        <span>{article.author}</span>
        <span className="opacity-40">·</span>
        <span>{formatDate(article.publish_date)}</span>
      </div>
    </Link>
  )
}

export default function News() {
  const { data: apiArticles = [] } = useQuery({
    queryKey: ['articles', 'published'],
    queryFn: () => api.articles.list(true),
  })
  const [params] = useSearchParams()
  const catFromUrl = params.get('cat') || ""
  const [filter, setFilter] = useState(catFromUrl)

  const all = apiArticles.length > 0 ? apiArticles : placeholder
  const categories = useMemo(() => {
    const set = new Set(all.map((a) => a.category).filter(Boolean))
    return ["All", ...Array.from(set)]
  }, [all])

  const filtered = useMemo(() => {
    if (!filter || filter === "All") return all
    return all.filter((a) => (a.category || "").toLowerCase() === filter.toLowerCase())
  }, [all, filter])

  const [hero, ...rest] = filtered
  const top = rest.slice(0, 2)
  const grid = rest.slice(2)

  return (
    <div className="min-h-screen bg-white text-black">
      <TopNav />

      {/* Masthead */}
      <section className="border-b border-black/10">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-12 md:py-16">
          <p className="text-[11px] tracking-[0.3em] uppercase text-red-600 mb-4">Dispatches</p>
          <h1 className="font-editorial font-black text-6xl md:text-9xl leading-[0.85] italic">News</h1>
        </div>
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 pb-6 flex gap-2 flex-wrap">
          {categories.map((c) => {
            const active = (filter || "All") === c
            return (
              <button
                key={c}
                onClick={() => setFilter(c === "All" ? "" : c)}
                className={`px-4 py-2 text-[10px] tracking-[0.25em] uppercase border transition-colors ${
                  active ? "bg-black text-white border-black" : "border-black/20 hover:border-black"
                }`}
              >
                {c}
              </button>
            )
          })}
        </div>
      </section>

      {hero && (
        <section className="max-w-[1600px] mx-auto px-4 md:px-8 py-10 md:py-14 border-b border-black/10">
          <Card article={hero} size="hero" />
        </section>
      )}

      {top.length > 0 && (
        <section className="max-w-[1600px] mx-auto px-4 md:px-8 py-12 md:py-16 border-b border-black/10">
          <div className="grid md:grid-cols-2 gap-10 md:gap-14">
            {top.map((a) => <Card key={a.id} article={a} size="lg" />)}
          </div>
        </section>
      )}

      <section className="max-w-[1600px] mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="flex items-baseline justify-between mb-8 border-b border-black/10 pb-4">
          <h2 className="font-editorial italic text-2xl md:text-3xl font-bold">More stories</h2>
        </div>
        {grid.length === 0 ? (
          <p className="text-neutral-500 py-10">Sem mais artigos nesta categoria.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
            {grid.map((a) => <Card key={a.id} article={a} size="md" />)}
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}
