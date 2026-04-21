import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Check, ArrowUpRight, Mail, MapPin, Phone } from "lucide-react"
import { api } from "@/api/client"
import TopNav from "@/components/layout/TopNav"
import Footer from "@/components/layout/Footer"

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" })
  const [done, setDone] = useState(false)

  const mutation = useMutation({
    mutationFn: (data) => api.contacts.create(data),
    onSuccess: () => {
      setDone(true)
      setForm({ name: "", email: "", phone: "", subject: "", message: "" })
    },
  })

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  const onSubmit = (e) => {
    e.preventDefault()
    mutation.mutate(form)
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <TopNav />

      <section className="border-b border-black/10">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-12 md:py-20">
          <p className="text-[11px] tracking-[0.3em] uppercase text-red-600 mb-4">Say hi</p>
          <h1 className="font-editorial font-black text-6xl md:text-9xl leading-[0.85] italic">Contact</h1>
          <p className="mt-6 max-w-2xl text-lg text-neutral-600">
            Parcerias, colaborações, propostas editoriais ou só porque te apetece.
            Respondemos em 48h.
          </p>
        </div>
      </section>

      <section className="max-w-[1600px] mx-auto px-4 md:px-8 py-16 md:py-24 grid md:grid-cols-12 gap-12 md:gap-16">
        {/* Form */}
        <div className="md:col-span-7">
          {done ? (
            <div className="border border-black/10 p-10 md:p-14">
              <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center mb-6">
                <Check className="w-6 h-6" />
              </div>
              <h2 className="font-editorial font-black text-4xl md:text-5xl italic">Obrigado.</h2>
              <p className="mt-4 text-neutral-600 max-w-md">
                A tua mensagem foi recebida. A nossa equipa responde o mais breve possível.
              </p>
              <button
                onClick={() => setDone(false)}
                className="mt-8 inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase border-b border-black pb-1"
              >
                Enviar outra mensagem <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <Field label="Nome *" name="name" value={form.name} onChange={onChange} required />
                <Field label="Email *" name="email" type="email" value={form.email} onChange={onChange} required />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <Field label="Telefone" name="phone" value={form.phone} onChange={onChange} />
                <div>
                  <label className="block text-[10px] tracking-[0.3em] uppercase text-neutral-500 mb-2">Assunto</label>
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={onChange}
                    className="w-full bg-transparent border-b border-black/30 focus:border-black outline-none py-2 text-lg font-editorial"
                  >
                    <option value="">Seleciona</option>
                    <option>Assessoria de Imprensa</option>
                    <option>Patrocínio</option>
                    <option>Parceria</option>
                    <option>Publicidade</option>
                    <option>Outro</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.3em] uppercase text-neutral-500 mb-2">Mensagem *</label>
                <textarea
                  name="message"
                  rows={6}
                  value={form.message}
                  onChange={onChange}
                  required
                  className="w-full bg-transparent border-b border-black/30 focus:border-black outline-none py-2 text-lg resize-none"
                  placeholder="Como podemos ajudar?"
                />
              </div>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="inline-flex items-center gap-2 bg-black text-white px-7 py-4 text-[11px] tracking-[0.25em] uppercase hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {mutation.isPending ? "A enviar..." : "Enviar mensagem"} <ArrowUpRight className="w-4 h-4" />
              </button>
              {mutation.isError && (
                <p className="text-red-600 text-sm">Erro ao enviar. Tenta novamente.</p>
              )}
            </form>
          )}
        </div>

        {/* Info */}
        <aside className="md:col-span-5 md:border-l border-black/10 md:pl-12 space-y-10">
          <InfoBlock icon={Mail} label="Email" value="ola@carlotamag.com" href="mailto:ola@carlotamag.com" />
          <InfoBlock icon={Phone} label="Phone" value="+351 000 000 000" href="tel:+351000000000" />
          <InfoBlock icon={MapPin} label="Studio" value="Lisboa, Portugal" />
          <div className="pt-8 border-t border-black/10">
            <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 mb-3">Office hours</p>
            <p className="text-neutral-700 leading-relaxed">
              Seg — Sex · 10h — 19h<br />
              Sábado · sob marcação
            </p>
          </div>
        </aside>
      </section>

      <Footer />
    </div>
  )
}

function Field({ label, ...props }) {
  return (
    <div>
      <label className="block text-[10px] tracking-[0.3em] uppercase text-neutral-500 mb-2">{label}</label>
      <input
        {...props}
        className="w-full bg-transparent border-b border-black/30 focus:border-black outline-none py-2 text-lg font-editorial"
      />
    </div>
  )
}

function InfoBlock({ icon: Icon, label, value, href }) {
  const content = (
    <div className="flex items-start gap-4 group">
      <Icon className="w-5 h-5 mt-1 opacity-60 group-hover:opacity-100 transition-opacity" />
      <div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 mb-1">{label}</p>
        <p className="font-editorial italic text-2xl">{value}</p>
      </div>
    </div>
  )
  return href ? <a href={href} className="block">{content}</a> : <div>{content}</div>
}
