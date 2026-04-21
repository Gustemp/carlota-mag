import { useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, ArrowUpRight, Twitter, Facebook, Link as LinkIcon } from "lucide-react"
import { api } from "@/api/client"
import TopNav from "@/components/layout/TopNav"
import Footer from "@/components/layout/Footer"

function formatDate(d) {
  if (!d) return ""
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  }).toUpperCase()
}

function readingTime(text) {
  if (!text) return "2 min read"
  const words = text.trim().split(/\s+/).length
  const minutes = Math.max(1, Math.round(words / 220))
  return `${minutes} min read`
}

/** Render content with paragraph breaks. HTML/markdown later. */
function ArticleBody({ content }) {
  if (!content) {
    return (
      <p className="text-neutral-500 italic">
        Este artigo ainda não tem conteúdo publicado.
      </p>
    )
  }
  const paragraphs = content.split(/\n\s*\n/).filter((p) => p.trim())
  return (
    <div className="space-y-6 text-lg leading-[1.7] text-neutral-800">
      {paragraphs.map((p, i) => (
        <p key={i} className={i === 0 ? "first-letter:font-editorial first-letter:italic first-letter:font-black first-letter:text-7xl first-letter:float-left first-letter:leading-[0.85] first-letter:mr-3 first-letter:mt-1" : ""}>
          {p}
        </p>
      ))}
    </div>
  )
}

function RelatedArticles({ current, all }) {
  const related = all
    .filter((a) => a.slug !== current.slug && a.is_published)
    .filter((a) => a.category === current.category || !current.category)
    .slice(0, 3)

  if (related.length === 0) return null

  return (
    <section className="border-t border-black/10 bg-neutral-50">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-16 md:py-24">
        <h2 className="font-editorial italic font-black text-3xl md:text-5xl leading-[0.9] mb-10">
          Continua a ler
        </h2>
        <div className="grid md:grid-cols-3 gap-8 md:gap-10">
          {related.map((a) => (
            <Link key={a.id} to={`/news/${a.slug}`} className="group block">
              <div className="aspect-[4/5] overflow-hidden bg-neutral-100 mb-4">
                {a.cover_image && (
                  <img
                    src={a.cover_image}
                    alt={a.title}
                    className="w-full h-full object-cover transition-transform duration-[800ms] group-hover:scale-[1.04]"
                  />
                )}
              </div>
              {a.category && (
                <p className="text-[10px] tracking-[0.25em] uppercase text-red-600 mb-2">
                  {a.category}
                </p>
              )}
              <h3 className="font-editorial font-bold text-xl leading-tight group-hover:italic transition-all">
                {a.title}
              </h3>
              {a.author && (
                <p className="mt-2 text-[10px] tracking-[0.2em] uppercase text-neutral-500">
                  {a.author}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function ShareBar({ article }) {
  const url = typeof window !== "undefined" ? window.location.href : ""
  const text = encodeURIComponent(`${article.title} — Carlota`)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
    } catch {}
  }

  return (
    <div className="flex items-center gap-3 py-6 border-y border-black/10">
      <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 mr-2">Partilhar</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 flex items-center justify-center border border-black/20 hover:border-black hover:bg-black hover:text-white transition-colors"
        aria-label="Twitter"
      >
        <Twitter className="w-4 h-4" />
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 flex items-center justify-center border border-black/20 hover:border-black hover:bg-black hover:text-white transition-colors"
        aria-label="Facebook"
      >
        <Facebook className="w-4 h-4" />
      </a>
      <button
        onClick={copy}
        className="w-9 h-9 flex items-center justify-center border border-black/20 hover:border-black hover:bg-black hover:text-white transition-colors"
        aria-label="Copiar link"
      >
        <LinkIcon className="w-4 h-4" />
      </button>
    </div>
  )
}

export default function Article() {
  const { slug } = useParams()
  const navigate = useNavigate()

  const { data: article, isLoading, isError } = useQuery({
    queryKey: ["article", slug],
    queryFn: () => api.articles.get(slug),
    retry: false,
  })

  const { data: allArticles = [] } = useQuery({
    queryKey: ["articles", "published"],
    queryFn: () => api.articles.list(true),
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white text-black">
        <TopNav />
        <div className="max-w-[900px] mx-auto px-4 md:px-8 py-20 md:py-32">
          <div className="h-4 w-24 bg-neutral-100 animate-pulse mb-8" />
          <div className="h-16 w-full bg-neutral-100 animate-pulse mb-4" />
          <div className="h-16 w-3/4 bg-neutral-100 animate-pulse mb-12" />
          <div className="aspect-[16/10] bg-neutral-100 animate-pulse mb-12" />
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-4 bg-neutral-100 animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (isError || !article) {
    return (
      <div className="min-h-screen bg-white text-black flex flex-col">
        <TopNav />
        <div className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="text-center max-w-lg">
            <p className="text-[11px] tracking-[0.3em] uppercase text-red-600 mb-4">Erro 404</p>
            <h1 className="font-editorial italic font-black text-5xl md:text-7xl leading-[0.9] mb-6">
              Artigo não<br />encontrado.
            </h1>
            <p className="text-neutral-600 mb-10">
              O link está partido ou o artigo foi removido.
            </p>
            <Link
              to="/news"
              className="inline-flex items-center gap-2 bg-black text-white px-7 py-4 text-[11px] tracking-[0.25em] uppercase hover:bg-red-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Ver todos os artigos
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <TopNav />

      {/* Back link */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-neutral-500 hover:text-red-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
      </div>

      {/* Headline block */}
      <header className="max-w-[1100px] mx-auto px-4 md:px-8 pt-10 md:pt-16 pb-10">
        {article.category && (
          <p className="text-[11px] tracking-[0.3em] uppercase text-red-600 mb-6">
            {article.category}
          </p>
        )}
        <h1 className="font-editorial font-black italic text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight">
          {article.title}
        </h1>
        {article.excerpt && (
          <p className="mt-8 text-xl md:text-2xl font-editorial italic text-neutral-700 leading-[1.35] max-w-3xl">
            {article.excerpt}
          </p>
        )}
        <div className="mt-10 flex flex-wrap items-center gap-4 text-[11px] tracking-[0.2em] uppercase text-neutral-500">
          {article.author && <span>By {article.author}</span>}
          {article.author && article.publish_date && <span className="opacity-40">·</span>}
          {article.publish_date && <span>{formatDate(article.publish_date)}</span>}
          <span className="opacity-40">·</span>
          <span>{readingTime(article.content)}</span>
        </div>
      </header>

      {/* Cover image */}
      {article.cover_image && (
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 mb-12 md:mb-16">
          <div className="aspect-[16/10] overflow-hidden bg-neutral-100">
            <img
              src={article.cover_image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Body */}
      <article className="max-w-[720px] mx-auto px-4 md:px-8 pb-16 md:pb-24">
        <ArticleBody content={article.content} />
        <div className="mt-14">
          <ShareBar article={article} />
        </div>
        {article.author && (
          <div className="mt-10 p-6 bg-neutral-50 flex items-start gap-5">
            <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center font-editorial italic font-black text-xl shrink-0">
              {article.author.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 mb-1">Escrito por</p>
              <p className="font-editorial italic font-bold text-2xl mb-2">{article.author}</p>
              <Link to={`/news?cat=${encodeURIComponent(article.category || "")}`} className="text-[11px] tracking-[0.2em] uppercase border-b border-black pb-0.5 hover:text-red-600 hover:border-red-600">
                Mais desta secção <ArrowUpRight className="inline w-3 h-3" />
              </Link>
            </div>
          </div>
        )}
      </article>

      <RelatedArticles current={article} all={allArticles} />

      <Footer />
    </div>
  )
}
