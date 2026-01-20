import { useState, useRef } from "react"
import { Link } from "react-router-dom"
import { motion, useScroll, useTransform } from "framer-motion"
import { useMutation } from "@tanstack/react-query"
import { Mail, Phone, MapPin, Send, Check } from "lucide-react"
import { api } from "@/api/client"
import SideMenu from "@/components/layout/SideMenu"
import { Button } from "@/components/ui/button"

function HeroSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section ref={ref} className="relative h-[50vh] flex items-center justify-center overflow-hidden">
      <motion.div 
        style={{ y }}
        className="absolute inset-0"
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&q=80')] bg-cover bg-center" />
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
          Contact
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-20 h-px bg-white/40 mx-auto"
        />
      </motion.div>
    </section>
  )
}

function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const mutation = useMutation({
    mutationFn: (data) => api.contacts.create(data),
    onSuccess: () => {
      setSubmitted(true)
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate(formData)
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16"
      >
        <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-light text-black mb-4">Mensagem Enviada!</h3>
        <p className="text-neutral-500 mb-8">
          Obrigado pelo seu contato. Responderemos em breve.
        </p>
        <Button
          onClick={() => setSubmitted(false)}
          variant="outline"
          className="border-black text-black hover:bg-black hover:text-white"
        >
          Enviar outra mensagem
        </Button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs tracking-[0.1em] uppercase text-neutral-500 mb-2">
            Nome *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-neutral-200 focus:border-black outline-none transition-colors text-sm"
            placeholder="Seu nome"
          />
        </div>
        <div>
          <label className="block text-xs tracking-[0.1em] uppercase text-neutral-500 mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-neutral-200 focus:border-black outline-none transition-colors text-sm"
            placeholder="seu@email.com"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs tracking-[0.1em] uppercase text-neutral-500 mb-2">
            Telefone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-neutral-200 focus:border-black outline-none transition-colors text-sm"
            placeholder="+351 000 000 000"
          />
        </div>
        <div>
          <label className="block text-xs tracking-[0.1em] uppercase text-neutral-500 mb-2">
            Assunto
          </label>
          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-neutral-200 focus:border-black outline-none transition-colors text-sm bg-white"
          >
            <option value="">Selecione um assunto</option>
            <option value="Assessoria de Imprensa">Assessoria de Imprensa</option>
            <option value="Patrocínio">Patrocínio</option>
            <option value="Parceria">Parceria</option>
            <option value="Publicidade">Publicidade</option>
            <option value="Outro">Outro</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs tracking-[0.1em] uppercase text-neutral-500 mb-2">
          Mensagem *
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          className="w-full px-4 py-3 border border-neutral-200 focus:border-black outline-none transition-colors text-sm resize-none"
          placeholder="Como podemos ajudar?"
        />
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white text-xs tracking-[0.2em] uppercase hover:bg-neutral-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        {mutation.isPending ? "Enviando..." : "Enviar Mensagem"}
        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>

      {mutation.isError && (
        <p className="text-red-500 text-sm">
          Erro ao enviar mensagem. Tente novamente.
        </p>
      )}
    </form>
  )
}

function ContactInfo() {
  const contactDetails = [
    {
      icon: Mail,
      label: "Email",
      value: "contato@carlotamag.com",
      href: "mailto:contato@carlotamag.com",
    },
    {
      icon: Phone,
      label: "Telefone",
      value: "+351 000 000 000",
      href: "tel:+351000000000",
    },
    {
      icon: MapPin,
      label: "Localização",
      value: "Lisboa, Portugal",
      href: null,
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-light text-black mb-4">Fale Conosco</h3>
        <p className="text-neutral-500 leading-relaxed">
          Estamos sempre abertos a novas parcerias, colaborações e ideias. 
          Entre em contato e vamos criar algo extraordinário juntos.
        </p>
      </div>

      <div className="space-y-6">
        {contactDetails.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="flex items-start gap-4"
          >
            <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
              <item.icon className="w-5 h-5 text-neutral-600" />
            </div>
            <div>
              <p className="text-xs tracking-[0.1em] uppercase text-neutral-400 mb-1">
                {item.label}
              </p>
              {item.href ? (
                <a 
                  href={item.href}
                  className="text-black hover:text-neutral-600 transition-colors"
                >
                  {item.value}
                </a>
              ) : (
                <p className="text-black">{item.value}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="pt-8 border-t border-neutral-100">
        <p className="text-xs tracking-[0.1em] uppercase text-neutral-400 mb-4">
          Horário de Atendimento
        </p>
        <p className="text-neutral-600">
          Segunda a Sexta: 9h - 18h<br />
          Sábado: 10h - 14h
        </p>
      </div>
    </div>
  )
}

export default function Contact() {
  return (
    <div className="min-h-screen bg-white">
      <SideMenu />
      <HeroSection />

      {/* Contact Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-16 md:gap-24">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <p className="text-xs tracking-[0.3em] text-neutral-400 uppercase mb-3">
                Formulário
              </p>
              <h2 className="text-3xl md:text-4xl font-extralight tracking-wide text-black mb-10">
                Envie sua Mensagem
              </h2>
              <ContactForm />
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="lg:pl-12 lg:border-l border-neutral-100"
            >
              <ContactInfo />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-[400px] bg-neutral-100 relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548707309-dcebeab9ea9b?w=1920&q=80')] bg-cover bg-center opacity-50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-black mx-auto mb-4" />
            <p className="text-lg font-light text-black">Lisboa, Portugal</p>
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
