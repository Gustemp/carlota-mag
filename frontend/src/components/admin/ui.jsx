import { useState } from "react"
import { Upload, FileText, ImageIcon, X, Loader2 } from "lucide-react"
import { api } from "@/api/client"

/** Section label + title for admin screens */
export function SectionHeader({ label, title, count, right }) {
  return (
    <div className="flex items-end justify-between border-b border-black/10 pb-4 mb-8">
      <div>
        {label && (
          <p className="text-[10px] tracking-[0.3em] uppercase text-red-600 mb-2">{label}</p>
        )}
        <h2 className="font-editorial italic font-black text-4xl md:text-5xl leading-[0.95]">
          {title}
        </h2>
      </div>
      <div className="flex items-center gap-4 text-[11px] tracking-[0.25em] uppercase text-neutral-500">
        {typeof count === "number" && <span>{count} items</span>}
        {right}
      </div>
    </div>
  )
}

/** Underlined editorial input */
export function Field({ label, required, children, hint }) {
  return (
    <label className="block">
      <span className="block text-[10px] tracking-[0.3em] uppercase text-neutral-500 mb-2">
        {label} {required && <span className="text-red-600">*</span>}
      </span>
      {children}
      {hint && <span className="block mt-1.5 text-xs text-neutral-400">{hint}</span>}
    </label>
  )
}

export function TextInput(props) {
  return (
    <input
      {...props}
      className={`w-full bg-transparent border-b border-black/30 focus:border-black outline-none py-2 text-lg font-editorial transition-colors ${props.className || ""}`}
    />
  )
}

export function TextArea(props) {
  return (
    <textarea
      {...props}
      className={`w-full bg-transparent border-b border-black/30 focus:border-black outline-none py-2 text-base leading-relaxed resize-none transition-colors ${props.className || ""}`}
    />
  )
}

export function Select({ children, ...props }) {
  return (
    <select
      {...props}
      className={`w-full bg-transparent border-b border-black/30 focus:border-black outline-none py-2 text-lg font-editorial transition-colors ${props.className || ""}`}
    >
      {children}
    </select>
  )
}

/** Editorial toggle */
export function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 group"
    >
      <span
        className={`w-10 h-6 rounded-full relative transition-colors ${
          checked ? "bg-red-600" : "bg-neutral-300"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
            checked ? "translate-x-4" : ""
          }`}
        />
      </span>
      <span className="text-sm">{label}</span>
    </button>
  )
}

export function PrimaryButton({ children, loading, ...props }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`inline-flex items-center gap-2 bg-black text-white px-6 py-3 text-[11px] tracking-[0.25em] uppercase hover:bg-red-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${props.className || ""}`}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  )
}

export function GhostButton({ children, ...props }) {
  return (
    <button
      {...props}
      className={`inline-flex items-center gap-2 px-5 py-3 text-[11px] tracking-[0.25em] uppercase border border-black/20 hover:border-black transition-colors ${props.className || ""}`}
    >
      {children}
    </button>
  )
}

export function DangerButton({ children, ...props }) {
  return (
    <button
      {...props}
      className={`inline-flex items-center gap-2 px-5 py-3 text-[11px] tracking-[0.25em] uppercase text-red-600 border border-red-600/30 hover:bg-red-600 hover:text-white transition-colors ${props.className || ""}`}
    >
      {children}
    </button>
  )
}

/** File upload box. kind = 'pdf' | 'cover' */
export function FileUploadBox({ kind, value, onChange, label, hint }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const isImage = kind === "cover"

  const onFile = async (file) => {
    if (!file) return
    setLoading(true)
    setError("")
    try {
      const uploader = isImage ? api.upload.cover : api.upload.pdf
      const { file_url } = await uploader(file)
      onChange(file_url)
    } catch (e) {
      setError(e.message || "Erro no upload")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Field label={label} hint={hint}>
      <div className="mt-1 border border-dashed border-black/20 hover:border-black/60 transition-colors">
        {value ? (
          <div className="p-4 flex items-center gap-4">
            {isImage ? (
              <img src={value} alt="" className="w-20 h-20 object-cover" />
            ) : (
              <FileText className="w-10 h-10 text-red-600" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs tracking-[0.2em] uppercase text-green-700 mb-1">
                {isImage ? "Imagem carregada" : "PDF carregado"}
              </p>
              <p className="text-xs text-neutral-500 truncate">{value}</p>
            </div>
            <button
              type="button"
              onClick={() => onChange("")}
              className="w-8 h-8 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
              aria-label="Remover"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : loading ? (
          <div className="p-8 flex items-center justify-center gap-2 text-neutral-500">
            <Loader2 className="w-5 h-5 animate-spin" /> A carregar…
          </div>
        ) : (
          <label className="cursor-pointer p-8 flex flex-col items-center justify-center text-center">
            {isImage ? (
              <ImageIcon className="w-8 h-8 mb-2 text-neutral-400" />
            ) : (
              <Upload className="w-8 h-8 mb-2 text-neutral-400" />
            )}
            <span className="text-[11px] tracking-[0.25em] uppercase text-neutral-600">
              Clica para escolher ficheiro
            </span>
            <input
              type="file"
              accept={isImage ? "image/*" : ".pdf"}
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0])}
            />
          </label>
        )}
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </Field>
  )
}

/** Centered modal shell with editorial style */
export function Modal({ open, onClose, title, children, maxWidth = "max-w-3xl" }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[80] flex items-start md:items-center justify-center p-4 md:p-8 bg-black/60 overflow-y-auto">
      <div className={`relative bg-white w-full ${maxWidth} my-8`}>
        <div className="sticky top-0 flex items-center justify-between px-6 md:px-8 py-5 border-b border-black/10 bg-white z-10">
          <h3 className="font-editorial italic font-bold text-2xl md:text-3xl">{title}</h3>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center hover:bg-black hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 md:px-8 py-6 md:py-8">
          {children}
        </div>
      </div>
    </div>
  )
}

export function ConfirmDialog({ open, title, description, onConfirm, onCancel, confirmLabel = "Excluir", loading }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/70">
      <div className="bg-white max-w-md w-full p-8">
        <h3 className="font-editorial italic font-bold text-2xl mb-3">{title}</h3>
        <p className="text-neutral-600 mb-8">{description}</p>
        <div className="flex items-center justify-end gap-3">
          <GhostButton onClick={onCancel}>Cancelar</GhostButton>
          <DangerButton onClick={onConfirm} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {confirmLabel}
          </DangerButton>
        </div>
      </div>
    </div>
  )
}

/** A compact editorial row card used in admin lists */
export function Row({ children, muted = false }) {
  return (
    <div className={`grid grid-cols-12 items-center gap-4 px-4 md:px-6 py-4 border-b border-black/10 hover:bg-neutral-50 transition-colors ${muted ? "opacity-60" : ""}`}>
      {children}
    </div>
  )
}

export function StatusDot({ active, labelOn = "Publicado", labelOff = "Rascunho" }) {
  return (
    <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase">
      <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-green-600" : "bg-neutral-400"}`} />
      {active ? labelOn : labelOff}
    </span>
  )
}
