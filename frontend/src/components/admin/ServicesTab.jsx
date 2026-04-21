import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Pencil, Eye, EyeOff, Trash2, Plus, Briefcase,
  Megaphone, BookOpen, Palette, Camera, Users, Award, ArrowUp, ArrowDown } from "lucide-react"
import { api } from "@/api/client"
import {
  SectionHeader, Field, TextInput, TextArea, Select, Toggle,
  PrimaryButton, GhostButton, FileUploadBox, Modal, ConfirmDialog,
  StatusDot,
} from "./ui"

const ICONS = { Megaphone, BookOpen, Palette, Camera, Users, Award }
const ICON_NAMES = Object.keys(ICONS)

const empty = {
  title: "", slug: "", description: "",
  icon: "Megaphone", image: "", order: 0, is_active: true,
}

function slugify(s) {
  return s.toString().toLowerCase().normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80)
}

export default function ServicesTab() {
  const qc = useQueryClient()
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)
  const [confirmDel, setConfirmDel] = useState(null)

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["admin-services"],
    queryFn: () => api.services.list(false),
  })

  const createMut = useMutation({
    mutationFn: (data) => api.services.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-services"] }); close() },
  })
  const updateMut = useMutation({
    mutationFn: ({ id, data }) => api.services.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-services"] }); close() },
  })
  const deleteMut = useMutation({
    mutationFn: (id) => api.services.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-services"] }); setConfirmDel(null) },
  })

  const open = (s) => {
    setEditing(s || {})
    setForm(s ? {
      title: s.title || "",
      slug: s.slug || "",
      description: s.description || "",
      icon: s.icon || "Megaphone",
      image: s.image || "",
      order: s.order || 0,
      is_active: s.is_active !== false,
    } : empty)
  }
  const close = () => { setEditing(null); setForm(empty) }

  const onTitleChange = (v) => {
    setForm((f) => ({
      ...f, title: v,
      slug: f.slug && editing?.id ? f.slug : slugify(v),
    }))
  }

  const submit = (e) => {
    e.preventDefault()
    const data = {
      ...form,
      slug: form.slug || slugify(form.title),
      description: form.description || null,
      icon: form.icon || null,
      image: form.image || null,
      order: Number(form.order) || 0,
    }
    if (editing?.id) updateMut.mutate({ id: editing.id, data })
    else createMut.mutate(data)
  }

  const toggleActive = (s) => updateMut.mutate({ id: s.id, data: { is_active: !s.is_active } })
  const moveOrder = (s, delta) => updateMut.mutate({ id: s.id, data: { order: (s.order || 0) + delta } })

  return (
    <>
      <SectionHeader
        label="Carlota Studio"
        title="Services"
        count={services.length}
        right={
          <button
            onClick={() => open(null)}
            className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 text-[11px] tracking-[0.25em] uppercase hover:bg-red-600 transition-colors"
          >
            <Plus className="w-4 h-4" /> Novo serviço
          </button>
        }
      />

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 bg-neutral-100 animate-pulse" />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-black/20">
          <Briefcase className="w-10 h-10 text-neutral-300 mx-auto mb-4" />
          <h3 className="font-editorial italic text-2xl mb-2">Nenhum serviço ainda</h3>
          <p className="text-sm text-neutral-500 mb-6">Adiciona o que o studio oferece.</p>
          <PrimaryButton onClick={() => open(null)}><Plus className="w-4 h-4" /> Novo serviço</PrimaryButton>
        </div>
      ) : (
        <div className="border-t border-black/10">
          {services.map((s, idx) => {
            const Icon = ICONS[s.icon] || Briefcase
            return (
              <div key={s.id} className="grid grid-cols-12 items-center gap-4 px-2 md:px-4 py-4 border-b border-black/10 hover:bg-neutral-50 transition-colors">
                <div className="col-span-1 text-center">
                  <span className="font-editorial italic text-3xl text-neutral-300">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="col-span-1">
                  <div className="w-10 h-10 bg-black text-white flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="col-span-6 md:col-span-6">
                  <h3 className="font-editorial font-bold text-lg leading-tight">{s.title}</h3>
                  <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">{s.description || "—"}</p>
                </div>
                <div className="col-span-2 hidden md:block">
                  <StatusDot active={s.is_active} labelOn="Ativo" labelOff="Inativo" />
                </div>
                <div className="col-span-4 md:col-span-2 flex items-center justify-end gap-1">
                  <button onClick={() => moveOrder(s, -1)} className="w-8 h-8 flex items-center justify-center border border-black/20 hover:border-black transition-colors" title="Subir">
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => moveOrder(s, 1)} className="w-8 h-8 flex items-center justify-center border border-black/20 hover:border-black transition-colors" title="Descer">
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => toggleActive(s)} className="w-8 h-8 flex items-center justify-center border border-black/20 hover:border-black transition-colors">
                    {s.is_active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button onClick={() => open(s)} className="w-8 h-8 flex items-center justify-center border border-black/20 hover:border-black transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setConfirmDel(s)} className="w-8 h-8 flex items-center justify-center border border-red-600/30 text-red-600 hover:bg-red-600 hover:text-white transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal open={!!editing} onClose={close} title={editing?.id ? "Editar serviço" : "Novo serviço"}>
        <form onSubmit={submit} className="space-y-7">
          <Field label="Título" required>
            <TextInput value={form.title} onChange={(e) => onTitleChange(e.target.value)} required />
          </Field>
          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Slug">
              <TextInput value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} />
            </Field>
            <Field label="Ordem">
              <TextInput type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
            </Field>
          </div>
          <Field label="Descrição">
            <TextArea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
          <Field label="Ícone">
            <div className="grid grid-cols-6 gap-2 mt-2">
              {ICON_NAMES.map((name) => {
                const Icon = ICONS[name]
                const active = form.icon === name
                return (
                  <button
                    type="button"
                    key={name}
                    onClick={() => setForm({ ...form, icon: name })}
                    className={`aspect-square flex items-center justify-center border transition-colors ${active ? "bg-black text-white border-black" : "border-black/20 hover:border-black"}`}
                    title={name}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                )
              })}
            </div>
          </Field>
          <FileUploadBox kind="cover" value={form.image} onChange={(v) => setForm({ ...form, image: v })} label="Imagem" />
          <Toggle checked={form.is_active} onChange={(v) => setForm({ ...form, is_active: v })} label="Ativo" />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/10">
            <GhostButton type="button" onClick={close}>Cancelar</GhostButton>
            <PrimaryButton type="submit" loading={createMut.isPending || updateMut.isPending} disabled={!form.title}>
              {editing?.id ? "Guardar" : "Criar"}
            </PrimaryButton>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirmDel}
        title="Excluir serviço?"
        description={`Tens a certeza que queres excluir "${confirmDel?.title}"?`}
        onCancel={() => setConfirmDel(null)}
        onConfirm={() => deleteMut.mutate(confirmDel.id)}
        loading={deleteMut.isPending}
      />
    </>
  )
}
