import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { BookOpen, Newspaper, Briefcase, Mail, Lock, LogOut, ArrowLeft } from "lucide-react"
import MagazinesTab from "@/components/admin/MagazinesTab"
import ArticlesTab from "@/components/admin/ArticlesTab"
import ServicesTab from "@/components/admin/ServicesTab"
import ContactsTab from "@/components/admin/ContactsTab"

const ADMIN_USER = "Ale2026"
const ADMIN_PASS = "Joppert2026"
const AUTH_KEY = "carlota_admin_auth"

const TABS = [
  { id: "magazines", label: "Magazines", icon: BookOpen, Component: MagazinesTab },
  { id: "articles", label: "Articles", icon: Newspaper, Component: ArticlesTab },
  { id: "services", label: "Services", icon: Briefcase, Component: ServicesTab },
  { id: "contacts", label: "Contacts", icon: Mail, Component: ContactsTab },
]

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [tab, setTab] = useState("magazines")

  useEffect(() => {
    if (sessionStorage.getItem(AUTH_KEY) === "true") setAuthed(true)
  }, [])

  if (!authed) return <LoginScreen onSuccess={() => { sessionStorage.setItem(AUTH_KEY, "true"); setAuthed(true) }} />

  const logout = () => { sessionStorage.removeItem(AUTH_KEY); setAuthed(false) }
  const ActiveTab = TABS.find((t) => t.id === tab).Component

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black text-white border-b border-white/10">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-[72px] gap-4">
            <div className="flex items-center gap-4">
              <span className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-editorial italic font-black text-xl">
                C
              </span>
              <div className="leading-tight hidden sm:block">
                <p className="text-[10px] tracking-[0.3em] uppercase opacity-50">Painel</p>
                <p className="font-editorial italic font-bold text-xl">
                  carlota<span className="text-red-500">.</span> <span className="opacity-60 text-sm">admin</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="hidden md:inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase opacity-70 hover:opacity-100"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Ver site
              </Link>
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 border border-white/20 px-4 py-2 text-[11px] tracking-[0.25em] uppercase hover:bg-white hover:text-black transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" /> Sair
              </button>
            </div>
          </div>
          {/* Tabs */}
          <nav className="flex gap-1 overflow-x-auto border-t border-white/10">
            {TABS.map((t) => {
              const Icon = t.icon
              const active = t.id === tab
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-[11px] tracking-[0.25em] uppercase whitespace-nowrap transition-colors border-b-2 ${
                    active ? "border-red-500 text-white" : "border-transparent text-white/50 hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {t.label}
                </button>
              )
            })}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-[1600px] mx-auto px-4 md:px-8 py-10 md:py-14">
        <ActiveTab />
      </main>
    </div>
  )
}

function LoginScreen({ onSuccess }) {
  const [user, setUser] = useState("")
  const [pass, setPass] = useState("")
  const [err, setErr] = useState("")

  const submit = (e) => {
    e.preventDefault()
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      setErr("")
      onSuccess()
    } else {
      setErr("Credenciais inválidas")
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative huge italic watermark */}
      <span className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.04]">
        <span className="font-editorial italic font-black text-[40vw] leading-none">C.</span>
      </span>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-10">
          <span className="inline-flex w-14 h-14 rounded-full bg-white text-black items-center justify-center font-editorial italic font-black text-3xl mb-6">
            C
          </span>
          <h1 className="font-editorial italic font-black text-5xl mb-3">
            carlota<span className="text-red-500">.</span>
          </h1>
          <p className="text-[11px] tracking-[0.3em] uppercase opacity-50">
            Painel Administrativo
          </p>
        </div>

        <form onSubmit={submit} className="space-y-7">
          <label className="block">
            <span className="block text-[10px] tracking-[0.3em] uppercase opacity-60 mb-2">Utilizador</span>
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
              autoFocus
              className="w-full bg-transparent border-b border-white/30 focus:border-white outline-none py-2 text-lg font-editorial transition-colors"
            />
          </label>
          <label className="block">
            <span className="block text-[10px] tracking-[0.3em] uppercase opacity-60 mb-2">Senha</span>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
              className="w-full bg-transparent border-b border-white/30 focus:border-white outline-none py-2 text-lg font-editorial transition-colors"
            />
          </label>

          {err && <p className="text-red-500 text-sm">{err}</p>}

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 bg-white text-black py-3.5 text-[11px] tracking-[0.3em] uppercase hover:bg-red-500 hover:text-white transition-colors"
          >
            <Lock className="w-3.5 h-3.5" /> Entrar
          </button>
        </form>

        <div className="mt-10 text-center">
          <Link to="/" className="text-[11px] tracking-[0.25em] uppercase opacity-50 hover:opacity-100">
            ← Voltar ao site
          </Link>
        </div>
      </div>
    </div>
  )
}
