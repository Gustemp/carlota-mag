import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"
import { api } from "@/api/client"
import TopNav from "@/components/layout/TopNav"
import Footer from "@/components/layout/Footer"

const fallbackArticles = [
  {
    id: "f1",
    title: "It's About Tyla",
    slug: "about-tyla",
    excerpt: "From Johannesburg to the Coachella stage — an afternoon with the voice of a new era.",
    cover_image: "https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=1600&q=80",
    category: "Cover Story",
    author: "Nicolaia Rips",
    publish_date: "2026-04-20",
  },
  {
    id: "f2",
    title: "Ugly Ducklings to Swans",
    slug: "ugly-ducklings",
    excerpt: "A cast of cool people revisit the awkward eras that quietly shaped them.",
    cover_image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=80",
    category: "Beauty",
    author: "Carlota Staff",
    publish_date: "2026-04-19",
  },
  {
    id: "f3",
    title: "Dress-Up! With Dr. Karen Doherty",
    slug: "dress-up-doherty",
    excerpt: "The London fashion girls' aesthetic practitioner of choice.",
    cover_image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=1200&q=80",
    category: "Beauty",
    author: "Nellie Eden",
    publish_date: "2026-04-18",
  },
  {
    id: "f4",
    title: "Miss Claire Sullivan, nice to meet you",
    slug: "claire-sullivan",
    excerpt: "Pop's favorite custom couturier walks us through designing a Coachella look.",
    cover_image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80",
    category: "Fashion",
    author: "Nicolaia Rips",
    publish_date: "2026-04-17",
  },
  {
    id: "f5",
    title: "Desert Dress-Up! With Slayyyter",
    slug: "desert-slayyyter",
    excerpt: "The gritty pop girl on rage, optimization and wearing exactly what she wants.",
    cover_image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&q=80",
    category: "Culture",
    author: "Flora Medina",
    publish_date: "2026-04-16",
  },
  {
    id: "f6",
    title: "Straight-Ups! Barcelona",
    slug: "straight-ups-barcelona",
    excerpt: "080 Barcelona Fashion Week brought youthful energy to the runway.",
    cover_image: "https://images.unsplash.com/photo-1492288991661-058aa541ff43?w=1200&q=80",
    category: "Fashion",
    author: "Flora Medina",
    publish_date: "2026-04-15",
  },
  {
    id: "f7",
    title: "Gucci makes silk feel new again",
    slug: "gucci-silk",
    excerpt: "From archival scarves to Flora prints reborn — The Art of Silk.",
    cover_image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
    category: "Fashion",
    author: "Ch'lita",
    publish_date: "2026-04-14",
  },
  {
    id: "f8",
    title: "Adéla just dropped 'KGB'",
    slug: "adela-kgb",
    excerpt: "A sharp new single, a revisit of her i-D story.",
    cover_image: "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=1200&q=80",
    category: "Music",
    author: "Pedro Almeida",
    publish_date: "2026-04-13",
  },
]

const latestNewsFeed = [
  { tag: "Now", body: "Girlfriend energy. Lourdes Leon doing Ottolinger the only way that makes sense — worn-in, a little wrecked, and not trying too hard. Shot by Erika Kamano in London." },
  { tag: "Yesterday", body: "080 Barcelona Fashion Week brought a burst of youthful energy to the runway. Vibrant colors, playful silhouettes, and Victor von Schwarz's bride." },
  { tag: "APRIL 17, 2026", body: "Adéla just dropped her new track 'KGB.' Check out the video here then revisit her Carlota story." },
  { tag: "APRIL 17, 2026", body: "Gucci makes silk feel new again. From archival scarves handpicked by Demna to Flora prints reborn." },
  { tag: "APRIL 16, 2026", body: "Super Yaya just dropped the cutest new sneakers in collaboration with Puma. Fronted by Alek Wek." },
  { tag: "APRIL 15, 2026", body: "Issue 24 cover reveal — Tyla for The Lore Issue. On newsstands May 5." },
]

const diaries = [
  { id: "d1", title: "Is Gen Z Fucking?", excerpt: "A generation raised in post-9/11 digital fearmongering comes of age." , image: "https://images.unsplash.com/photo-1502767089025-6572583495f1?w=800&q=80", author: "Nicolaia Rips" },
  { id: "d2", title: "The Anthropological Dater", excerpt: "It was my 250th first date. Mike and I went to a tea-themed speakeasy.", image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80", author: "Staff Writer" },
  { id: "d3", title: "Obsessed with Gains", excerpt: "We sat together in front of the corner store. Then we started walking.", image: "https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=800&q=80", author: "Staff Writer" },
  { id: "d4", title: "Willing to Fly", excerpt: "We met at a Williamsburg tech-bro birthday bash. The kind of party.", image: "https://images.unsplash.com/photo-1519638831568-d9897f54ed69?w=800&q=80", author: "Staff Writer" },
  { id: "d5", title: "Likes Sauvignon Blanc, Dislikes Fisting", excerpt: "I matched with this guy on Hinge. Honestly he was so cute.", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80", author: "Staff Writer" },
  { id: "d6", title: "Living in a John Green Book", excerpt: "It was over autumn break and we met on a camping trip.", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80", author: "Staff Writer" },
]

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()
}

/**
 * Editorial hero — vertical portrait left, sticky info right.
 * Modeled on i-D.co's homepage-header.
 */
function Hero({ article }) {
  return (
    <section className="border-b border-black/10">
      <div className="grid md:grid-cols-12">
        {/* Media (left, huge vertical) */}
        <Link
          to={`/news/${article.slug}`}
          className="md:col-span-7 lg:col-span-8 relative group overflow-hidden bg-neutral-100"
          style={{ aspectRatio: "4/5" }}
        >
          <img
            src={article.cover_image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]"
          />
        </Link>

        {/* Info (right, sticky) */}
        <div className="md:col-span-5 lg:col-span-4 md:border-l border-black/10 flex">
          <div className="md:sticky md:top-[72px] self-start p-6 md:p-10 lg:p-14 w-full">
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-editorial italic font-black text-xl mb-8">
              C
            </div>
            <p className="text-[11px] tracking-[0.3em] uppercase text-red-600 mb-5">
              {article.category}
            </p>
            <Link to={`/news/${article.slug}`}>
              <h1 className="font-editorial font-black italic text-4xl md:text-5xl lg:text-6xl leading-[0.95] tracking-tight hover:text-red-600 transition-colors">
                {article.title}
              </h1>
            </Link>
            <p className="mt-6 text-base md:text-lg text-neutral-700 leading-relaxed">
              {article.excerpt}
            </p>
            <div className="mt-8 flex items-center gap-3 text-[11px] tracking-[0.2em] uppercase text-neutral-500">
              <span>By {article.author}</span>
              <span className="opacity-40">·</span>
              <span>{formatDate(article.publish_date)}</span>
            </div>
            <Link
              to={`/news/${article.slug}`}
              className="mt-10 inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase border-b border-black pb-1 hover:text-red-600 hover:border-red-600 transition-colors"
            >
              Read the story <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function ArticleCard({ article, size = "md" }) {
  const titleCls = {
    lg: "text-2xl md:text-3xl leading-[1.05]",
    md: "text-lg md:text-xl leading-tight",
  }[size]
  return (
    <Link to={`/news/${article.slug}`} className="group block">
      <div className="relative overflow-hidden bg-neutral-100 aspect-[4/5] mb-3">
        <img
          src={article.cover_image}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-[800ms] group-hover:scale-[1.04]"
        />
      </div>
      <p className="text-[10px] tracking-[0.25em] uppercase text-red-600 mb-2">{article.category}</p>
      <h3 className={`font-editorial font-bold ${titleCls} group-hover:italic transition-all`}>
        {article.title}
      </h3>
      <p className="mt-2 text-[11px] tracking-[0.2em] uppercase text-neutral-500">
        {article.author}
      </p>
    </Link>
  )
}

function ArticlesAndLatest({ articles }) {
  return (
    <section className="border-b border-black/10" id="latest">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-12 md:py-16 grid md:grid-cols-12 gap-10 md:gap-12">
        {/* Articles (8 cols) */}
        <div className="md:col-span-8">
          <h2 className="font-editorial italic font-bold text-3xl md:text-4xl mb-8">Articles</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {articles.slice(0, 6).map((a) => (
              <ArticleCard key={a.id} article={a} size="md" />
            ))}
          </div>
        </div>

        {/* Latest News (4 cols) */}
        <aside className="md:col-span-4 md:border-l border-black/10 md:pl-8">
          <h2 className="font-editorial italic font-bold text-3xl md:text-4xl mb-8">Latest News</h2>
          <ul className="divide-y divide-black/10">
            {latestNewsFeed.map((n, i) => (
              <li key={i} className="py-5 first:pt-0">
                <p className="text-[10px] tracking-[0.25em] uppercase text-red-600 mb-2">{n.tag}</p>
                <p className="text-[15px] leading-snug text-neutral-800">{n.body}</p>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  )
}

function DiariesSection() {
  return (
    <section className="border-b border-black/10 bg-neutral-50">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-14 md:py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[11px] tracking-[0.3em] uppercase text-red-600 mb-3">A Carlota Series</p>
            <h2 className="font-editorial font-black italic text-4xl md:text-6xl leading-[0.9]">
              The Diaries
            </h2>
          </div>
          <Link to="/news" className="hidden md:inline text-[11px] tracking-[0.25em] uppercase border-b border-black pb-1 hover:text-red-600 hover:border-red-600">
            See all →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 md:gap-6">
          {diaries.map((d) => (
            <Link to={`/news/${d.id}`} key={d.id} className="group block">
              <div className="aspect-[3/4] overflow-hidden bg-neutral-100 mb-3">
                <img src={d.image} alt={d.title} className="w-full h-full object-cover transition-transform duration-[800ms] group-hover:scale-[1.05]" />
              </div>
              <h3 className="font-editorial font-bold text-base leading-tight group-hover:italic transition-all">
                {d.title}
              </h3>
              <p className="mt-1.5 text-[10px] tracking-[0.2em] uppercase text-neutral-500">
                {d.author}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function IssueSpotlight({ magazine }) {
  const img = magazine?.cover_image || "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=1200&q=80"
  const title = magazine?.title || "Issue 24"
  const edition = magazine?.edition || "The Lore Issue"
  return (
    <section className="bg-black text-white border-b border-white/10">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-16 md:py-24 grid md:grid-cols-12 gap-10 md:gap-16 items-center">
        <div className="md:col-span-6 lg:col-span-5">
          <p className="text-[11px] tracking-[0.3em] uppercase text-red-500 mb-5">On Newsstands Now</p>
          <h2 className="font-editorial font-black italic text-5xl md:text-7xl lg:text-8xl leading-[0.9]">
            {title}:<br />{edition}
          </h2>
          <p className="mt-8 text-lg opacity-70 max-w-md leading-relaxed">
            Histórias, retratos e editoriais que definem esta estação.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/magazines"
              className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 text-[11px] tracking-[0.25em] uppercase hover:bg-red-600 hover:text-white transition-colors"
            >
              Read the issue <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 border border-white/30 px-6 py-3 text-[11px] tracking-[0.25em] uppercase hover:bg-white hover:text-black transition-colors"
            >
              Subscribe
            </Link>
          </div>
        </div>
        <div className="md:col-span-6 lg:col-span-7">
          <div className="aspect-[3/4] overflow-hidden max-w-md md:ml-auto shadow-2xl">
            <img src={img} alt={title} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  )
}

function StraightUps({ articles }) {
  return (
    <section className="border-b border-black/10">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-14 md:py-20">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-editorial font-black italic text-4xl md:text-6xl leading-[0.9]">
            Straight-Ups!
          </h2>
          <span className="hidden md:inline text-[11px] tracking-[0.25em] uppercase text-neutral-500">
            Street style · Portraits
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {articles.slice(0, 4).map((a) => (
            <Link key={a.id} to={`/news/${a.slug}`} className="group block">
              <div className="aspect-[3/4] overflow-hidden bg-neutral-100 mb-3">
                <img src={a.cover_image} alt={a.title} className="w-full h-full object-cover transition-transform duration-[800ms] group-hover:scale-[1.04]" />
              </div>
              <h3 className="font-editorial font-bold text-sm md:text-base leading-tight group-hover:italic">
                {a.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function StudioTeaser() {
  return (
    <section className="bg-neutral-100 border-b border-black/10">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-16 md:py-24 grid md:grid-cols-12 gap-10 items-center">
        <div className="md:col-span-8">
          <p className="text-[11px] tracking-[0.3em] uppercase text-red-600 mb-4">Carlota Studio</p>
          <h2 className="font-editorial font-black italic text-4xl md:text-6xl leading-[0.95]">
            Construímos marcas com alma editorial.
          </h2>
          <p className="mt-6 text-lg text-neutral-700 max-w-2xl">
            Relações públicas, direção de arte, patrocínios e produção fotográfica — a mesma
            sensibilidade que define a revista, ao serviço da tua marca.
          </p>
        </div>
        <div className="md:col-span-4 flex md:justify-end">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 bg-black text-white px-7 py-4 text-[11px] tracking-[0.25em] uppercase hover:bg-red-600 transition-colors"
          >
            Explore services <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function Landing() {
  const { data: apiArticles = [] } = useQuery({
    queryKey: ['articles', 'published'],
    queryFn: () => api.articles.list(true),
  })
  const { data: magazines = [] } = useQuery({
    queryKey: ['magazines', 'published'],
    queryFn: () => api.magazines.list(true),
  })

  const articles = apiArticles.length >= 4 ? apiArticles : fallbackArticles
  const [hero, ...rest] = articles
  const latestMag = magazines[0]

  return (
    <div className="min-h-screen bg-white text-black">
      <TopNav />
      <Hero article={hero} />
      <ArticlesAndLatest articles={rest} />
      <DiariesSection />
      <IssueSpotlight magazine={latestMag} />
      <StraightUps articles={rest} />
      <StudioTeaser />
      <Footer />
    </div>
  )
}
