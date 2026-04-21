import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Pencil, Eye, EyeOff, Trash2, Plus, FileText, Download } from "lucide-react"
import { api } from "@/api/client"
import {
  SectionHeader, Field, TextInput, TextArea, Toggle,
  PrimaryButton, GhostButton, FileUploadBox, Modal, ConfirmDialog,
  Row, StatusDot,
} from "./ui"

const emptyMagazine = {
  title: "", edition: "", description: "",
  pdf_url: "", cover_image: "", publish_date: "",
  is_published: true,
}

export default function MagazinesTab() {
  const qc = useQueryClient()
  const [editing, setEditing] = useState(null) // null | {} | magazine
  const [form, setForm] = useState(emptyMagazine)
  const [confirmDel, setConfirmDel] = useState(null)

  const { data: magazines = [], isLoading } = useQuery({
    queryKey: ["admin-magazines"],
    queryFn: () => api.magazines.list(false),
  })

  const createMut = useMutation({
    mutationFn: (data) => api.magazines.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-magazines"] }); close() },
  })
  const updateMut = useMutation({
    mutationFn: ({ id, data }) => api.magazines.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-magazines"] }); close() },
  })
  const deleteMut = useMutation({
    mutationFn: (id) => api.magazines.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-magazines"] }); setConfirmDel(null) },
  })

  const open = (mag) => {
    setEditing(mag || {})
    setForm(mag ? {
      title: mag.title || "",
      edition: mag.edition || "",
      description: mag.description || "",
      pdf_url: mag.pdf_url || "",
      cover_image: mag.cover_image || "",
      publish_date: mag.publish_date || "",
      is_published: mag.is_published !== false,
    } : emptyMagazine)
  }
  const close = () => { setEditing(null); setForm(emptyMagazine) }

  const submit = (e) => {
    e.preventDefault()
    const data = {
      ...form,
      publish_date: form.publish_date || null,
      edition: form.edition || null,
      description: form.description || null,
      cover_image: form.cover_image || null,
    }
    if (editing?.id) updateMut.mutate({ id: editing.id, data })
    else createMut.mutate(data)
  }

  const togglePublish = (m) => {
    updateMut.mutate({ id: m.id, data: { is_published: !m.is_published } })
  }

  return (
    <>
      <SectionHeader
        label="The Archive"
        title="Magazines"
        count={magazines.length}
        right={
          <button
            onClick={() => open(null)}
            className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 text-[11px] tracking-[0.25em] uppercase hover:bg-red-600 transition-colors"
          >
            <Plus className="w-4 h-4" /> Nova edição
          </button>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-neutral-100 animate-pulse" />
          ))}
        </div>
      ) : magazines.length === 0 ? (
        <EmptyState onNew={() => open(null)} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {magazines.map((m) => (
            <div key={m.id} className="group">
              <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden mb-3">
                {m.cover_image ? (
                  <img src={m.cover_image} alt={m.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-editorial italic text-3xl text-neutral-400">
                    {m.edition || "—"}
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <StatusDot active={m.is_published} />
                </div>
                {m.pdf_url && (
                  <a
                    href={m.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-2 right-2 w-8 h-8 bg-white/90 flex items-center justify-center hover:bg-white"
                    title="Ver PDF"
                  >
                    <FileText className="w-4 h-4" />
                  </a>
                )}
              </div>
              <p className="text-[10px] tracking-[0.25em] uppercase text-red-600 mb-1">
                {m.edition || "Edição"}
              </p>
              <h3 className="font-editorial font-bold text-lg leading-tight mb-3">{m.title}</h3>
              <div className="flex items-center gap-1 text-[10px] tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => open(m)} className="flex-1 py-2 border border-black/20 hover:bg-black hover:text-white transition-colors">
                  <Pencil className="w-3 h-3 inline mr-1" /> Editar
                </button>
                <button onClick={() => togglePublish(m)} className="flex-1 py-2 border border-black/20 hover:bg-black hover:text-white transition-colors" title={m.is_published ? "Ocultar" : "Publicar"}>
                  {m.is_published ? <EyeOff className="w-3 h-3 inline" /> : <Eye className="w-3 h-3 inline" />}
                </button>
                <button onClick={() => setConfirmDel(m)} className="py-2 px-3 border border-red-600/30 text-red-600 hover:bg-red-600 hover:text-white transition-colors">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!editing} onClose={close} title={editing?.id ? "Editar edição" : "Nova edição"}>
        <form onSubmit={submit} className="space-y-7">
          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Título" required>
              <TextInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="Issue 24 — The Lore Issue" />
            </Field>
            <Field label="Número da edição">
              <TextInput value={form.edition} onChange={(e) => setForm({ ...form, edition: e.target.value })} placeholder="Nº 24" />
            </Field>
          </div>
          <Field label="Descrição">
            <TextArea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Breve descrição da edição…" />
          </Field>
          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Data de publicação">
              <TextInput type="date" value={form.publish_date || ""} onChange={(e) => setForm({ ...form, publish_date: e.target.value })} />
            </Field>
            <div className="flex items-end pb-2">
              <Toggle checked={form.is_published} onChange={(v) => setForm({ ...form, is_published: v })} label="Publicar imediatamente" />
            </div>
          </div>
          <FileUploadBox kind="pdf" value={form.pdf_url} onChange={(v) => setForm({ ...form, pdf_url: v })} label="Ficheiro PDF *" />
          <FileUploadBox kind="cover" value={form.cover_image} onChange={(v) => setForm({ ...form, cover_image: v })} label="Imagem de capa" />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/10">
            <GhostButton type="button" onClick={close}>Cancelar</GhostButton>
            <PrimaryButton
              type="submit"
              loading={createMut.isPending || updateMut.isPending}
              disabled={!form.title || !form.pdf_url}
            >
              {editing?.id ? "Guardar" : "Criar"}
            </PrimaryButton>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirmDel}
        title="Excluir edição?"
        description={`Tens a certeza que queres excluir "${confirmDel?.title}"? Esta ação não pode ser desfeita.`}
        onCancel={() => setConfirmDel(null)}
        onConfirm={() => deleteMut.mutate(confirmDel.id)}
        loading={deleteMut.isPending}
      />
    </>
  )
}

function EmptyState({ onNew }) {
  return (
    <div className="text-center py-24 border border-dashed border-black/20">
      <FileText className="w-10 h-10 text-neutral-300 mx-auto mb-4" />
      <h3 className="font-editorial italic text-2xl mb-2">Nenhuma edição ainda</h3>
      <p className="text-sm text-neutral-500 mb-6">Começa a montar o arquivo da Carlota.</p>
      <PrimaryButton onClick={onNew}><Plus className="w-4 h-4" /> Nova edição</PrimaryButton>
    </div>
  )
}
