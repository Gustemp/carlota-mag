import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"
import { api } from "@/api/client"
import TopNav from "@/components/layout/TopNav"
import Footer from "@/components/layout/Footer"

function formatDate(d) {
  if (!d) return ""
  return new Date(d).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}

function IssueCard({ mag, big = false }) {
  return (
    <Link
      to={mag.pdf_url ? `/reader?id=${mag.id}` : "#"}
      className="group block"
    >
      <div className={`relative overflow-hidden bg-neutral-100 ${big ? "aspect-[3/4]" : "aspect-[3/4]"}`}>
        {mag.cover_image ? (
          <img
            src={mag.cover_image}
            alt={mag.title}
            className="w-full h-full object-cover transition-transform duration-[800ms] group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-editorial italic text-4xl text-neutral-400">
            {mag.edition || mag.title}
          </div>
        )}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 text-[10px] tracking-[0.25em] uppercase">
          {mag.edition || "Issue"}
        </span>
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className={`font-editorial font-bold ${big ? "text-2xl md:text-3xl" : "text-lg"} leading-tight group-hover:italic transition-all`}>
            {mag.title}
          </h3>
          <p className="mt-1 text-[11px] tracking-[0.2em] uppercase text-neutral-500">
            {formatDate(mag.publish_date)}
          </p>
        </div>
        <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0 mt-1" />
      </div>
    </Link>
  )
}

export default function Magazines() {
  const { data: magazines = [], isLoading } = useQuery({
    queryKey: ['magazines', 'published'],
    queryFn: () => api.magazines.list(true),
  })

  const [latest, ...rest] = magazines

  return (
    <div className="min-h-screen bg-white text-black">
      <TopNav />

      {/* Masthead */}
      <section className="border-b border-black/10">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-12 md:py-20">
          <p className="text-[11px] tracking-[0.3em] uppercase text-red-600 mb-4">The Archive</p>
          <h1 className="font-editorial font-black text-6xl md:text-9xl leading-[0.85] italic">
            Magazines
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-neutral-600">
            Todas as edições da Carlota, de volta a 2018. Navega pela história da revista,
            uma capa de cada vez.
          </p>
        </div>
      </section>

      {/* Latest issue spotlight */}
      {latest && (
        <section className="border-b border-black/10">
          <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-12 md:py-20 grid md:grid-cols-12 gap-8 md:gap-12 items-center">
            <div className="md:col-span-6">
              <Link to={latest.pdf_url ? `/reader?id=${latest.id}` : "#"} className="block group">
                <div className="aspect-[3/4] overflow-hidden bg-neutral-100 max-w-lg shadow-2xl">
                  {latest.cover_image && (
                    <img
                      src={latest.cover_image}
                      alt={latest.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                    />
                  )}
                </div>
              </Link>
            </div>
            <div className="md:col-span-6">
              <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-red-600 mb-4">
                Current Issue
              </span>
              <h2 className="font-editorial font-black text-4xl md:text-6xl lg:text-7xl leading-[0.95] italic">
                {latest.title}
              </h2>
              {latest.edition && (
                <p className="mt-3 text-2xl font-editorial italic text-neutral-600">— {latest.edition}</p>
              )}
              {latest.description && (
                <p className="mt-6 text-lg text-neutral-700 leading-relaxed max-w-prose">
                  {latest.description}
                </p>
              )}
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to={latest.pdf_url ? `/reader?id=${latest.id}` : "#"}
                  className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 text-[11px] tracking-[0.25em] uppercase hover:bg-red-600 transition-colors"
                >
                  Read now <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Archive grid */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="flex items-baseline justify-between mb-10 border-b border-black/10 pb-4">
          <h2 className="font-editorial italic text-3xl md:text-4xl font-bold">All Issues</h2>
          <span className="text-[11px] tracking-[0.25em] uppercase text-neutral-500">
            {magazines.length} edições
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-neutral-100 animate-pulse" />
            ))}
          </div>
        ) : rest.length === 0 ? (
          <p className="text-neutral-500 py-20 text-center">Em breve, mais edições.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10">
            {rest.map((mag) => (
              <IssueCard key={mag.id} mag={mag} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}
