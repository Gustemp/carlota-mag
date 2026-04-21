import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { ArrowUpRight, Megaphone, BookOpen, Palette, Camera, Users, Award } from "lucide-react"
import { api } from "@/api/client"
import TopNav from "@/components/layout/TopNav"
import Footer from "@/components/layout/Footer"

const placeholder = [
  { id: "1", title: "Assessoria em Relações Públicas", description: "Estratégias de comunicação personalizadas para posicionar a tua marca. Gestão de imagem, relações com a imprensa e narrativa editorial.", icon: "Megaphone", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80" },
  { id: "2", title: "Patrocínio na Magazine", description: "Anúncios, conteúdos patrocinados e eventos exclusivos na Carlota — do print ao digital.", icon: "BookOpen", image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=1200&q=80" },
  { id: "3", title: "Direção de Arte", description: "Conceitos visuais únicos para campanhas, editoriais e projetos especiais.", icon: "Palette", image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80" },
  { id: "4", title: "Produção Fotográfica", description: "Ensaios e campanhas chave-na-mão. Do casting à pós-produção.", icon: "Camera", image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1200&q=80" },
  { id: "5", title: "Gestão de Eventos", description: "Lançamentos, exposições e festas com identidade editorial.", icon: "Users", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80" },
  { id: "6", title: "Consultoria de Marca", description: "Trabalho profundo de branding que gera resultados duradouros.", icon: "Award", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80" },
]

const iconMap = { Megaphone, BookOpen, Palette, Camera, Users, Award }

function ServiceRow({ service, index }) {
  const Icon = iconMap[service.icon] || Megaphone
  const reverse = index % 2 === 1
  return (
    <article className="border-b border-black/10">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-16 md:py-24 grid md:grid-cols-12 gap-8 md:gap-12 items-center">
        <div className={`md:col-span-6 ${reverse ? "md:order-2" : ""}`}>
          <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
            {service.image && (
              <img src={service.image} alt={service.title} className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-[900ms]" />
            )}
          </div>
        </div>
        <div className={`md:col-span-6 ${reverse ? "md:order-1" : ""}`}>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[11px] tracking-[0.3em] uppercase text-red-600">{String(index + 1).padStart(2, "0")}</span>
            <span className="h-px w-12 bg-black/20" />
            <Icon className="w-4 h-4 opacity-60" />
          </div>
          <h2 className="font-editorial font-black text-4xl md:text-6xl leading-[0.95] italic">
            {service.title}
          </h2>
          <p className="mt-6 text-lg text-neutral-700 max-w-prose leading-relaxed">
            {service.description}
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase border-b border-black pb-1 hover:text-red-600 hover:border-red-600 transition-colors"
          >
            Request a proposal <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  )
}

export default function Services() {
  const { data: services = [] } = useQuery({
    queryKey: ['services', 'active'],
    queryFn: () => api.services.list(true),
  })
  const list = services.length > 0 ? services : placeholder

  return (
    <div className="min-h-screen bg-white text-black">
      <TopNav />

      <section className="border-b border-black/10">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-12 md:py-20">
          <p className="text-[11px] tracking-[0.3em] uppercase text-red-600 mb-4">Carlota Studio</p>
          <h1 className="font-editorial font-black text-6xl md:text-9xl leading-[0.85] italic">Services</h1>
          <p className="mt-6 max-w-2xl text-lg text-neutral-600">
            Construímos marcas com alma editorial. Uma equipa multidisciplinar, a mesma
            sensibilidade que define a revista.
          </p>
        </div>
      </section>

      <div>
        {list.map((s, i) => <ServiceRow key={s.id} service={s} index={i} />)}
      </div>

      <section className="bg-black text-white">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-20 md:py-28 text-center">
          <h2 className="font-editorial font-black text-4xl md:text-6xl italic leading-[0.95]">
            Vamos criar algo<br />extraordinário juntos?
          </h2>
          <Link
            to="/contact"
            className="mt-10 inline-flex items-center gap-2 bg-white text-black px-8 py-4 text-[11px] tracking-[0.25em] uppercase hover:bg-red-600 hover:text-white transition-colors"
          >
            Fala connosco <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
