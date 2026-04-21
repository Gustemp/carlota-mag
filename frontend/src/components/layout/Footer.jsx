import { Link } from "react-router-dom"
import { Instagram, Twitter, Facebook, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Big logo band */}
      <div className="border-b border-white/10">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-10 flex items-center justify-between">
          <span className="font-editorial italic font-black text-6xl md:text-9xl leading-none">
            Carlota<span className="text-red-600">.</span>
          </span>
          <div className="hidden md:flex items-center gap-4">
            {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Columns */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase opacity-40 mb-4">Magazine</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/magazines" className="opacity-70 hover:opacity-100">Current Issue</Link></li>
            <li><Link to="/magazines" className="opacity-70 hover:opacity-100">Archive</Link></li>
            <li><a href="#" className="opacity-70 hover:opacity-100">Subscribe</a></li>
            <li><a href="#" className="opacity-70 hover:opacity-100">Shop</a></li>
          </ul>
        </div>
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase opacity-40 mb-4">Sections</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/news" className="opacity-70 hover:opacity-100">Fashion</Link></li>
            <li><Link to="/news" className="opacity-70 hover:opacity-100">Culture</Link></li>
            <li><Link to="/news" className="opacity-70 hover:opacity-100">Beauty</Link></li>
            <li><Link to="/news" className="opacity-70 hover:opacity-100">Music</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase opacity-40 mb-4">About</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/services" className="opacity-70 hover:opacity-100">Services</Link></li>
            <li><Link to="/contact" className="opacity-70 hover:opacity-100">Contact</Link></li>
            <li><a href="#" className="opacity-70 hover:opacity-100">Masthead</a></li>
            <li><a href="#" className="opacity-70 hover:opacity-100">Careers</a></li>
          </ul>
        </div>
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase opacity-40 mb-4">Newsletter</p>
          <p className="text-sm opacity-70 mb-4">Recebe o melhor da Carlota na tua caixa de entrada.</p>
          <form className="flex border border-white/20">
            <input
              type="email"
              placeholder="email@example.com"
              className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-white/40"
            />
            <button className="px-4 bg-white text-black text-[11px] tracking-[0.2em] uppercase">Sign up</button>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] tracking-[0.2em] uppercase opacity-60">
          <p>© {new Date().getFullYear()} Carlota Magazine — All rights reserved</p>
          <div className="flex gap-5">
            <a href="#" className="hover:opacity-100">Privacy</a>
            <a href="#" className="hover:opacity-100">Terms</a>
            <a href="#" className="hover:opacity-100">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
