import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Pencil, Eye, EyeOff, Trash2, Plus, Star, Newspaper } from "lucide-react"
import { api } from "@/api/client"
import {
  SectionHeader, Field, TextInput, TextArea, Select, Toggle,
  PrimaryButton, GhostButton, FileUploadBox, Modal, ConfirmDialog,
  StatusDot,
} from "./ui"

const CATEGORIES = ["Fashion", "Culture", "Beauty", "Music", "Art", "Cover Story"]

const empty = {
  title: "", slug: "", excerpt: "", content: "",
  cover_image: "", category: "", author: "",
  publish_date: "", is_published: false, is_featured: false,
}

function slugify(s) {
  return s
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}

export default function ArticlesTab() {
  const qc = useQueryClient()
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)
  const [confirmDel, setConfirmDel] = useState(null)

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["admin-articles"],
    queryFn: () => api.articles.list(false),
  })

  const createMut = useMutation({
    mutationFn: (data) => api.articles.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-articles"] }); close() },
  })
  const updateMut = useMutation({
    mutationFn: ({ id, data }) => api.articles.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-articles"] }); close() },
  })
  const deleteMut = useMutation({
    mutationFn: (id) => api.articles.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-articles"] }); setConfirmDel(null) },
  })

  const open = (a) => {
    setEditing(a || {})
    setForm(a ? {
      title: a.title || "",
      slug: a.slug || "",
      excerpt: a.excerpt || "",
      content: a.content || "",
      cover_image: a.cover_image || "",
      category: a.category || "",
      author: a.author || "",
      publish_date: a.publish_date || "",
      is_published: !!a.is_published,
      is_featured: !!a.is_featured,
    } : empty)
  }
  const close = () => { setEditing(null); setForm(empty) }

  const onTitleChange = (v) => {
    setForm((f) => ({
      ...f,
      title: v,
      slug: f.slug && editing?.id ? f.slug : slugify(v),
    }))
  }

  const submit = (e) => {
    e.preventDefault()
    const data = {
      ...form,
      slug: form.slug || slugify(form.title),
      publish_date: form.publish_date || null,
      excerpt: form.excerpt || null,
      content: form.content || null,
      cover_image: form.cover_image || null,
      category: form.category || null,
      author: form.author || null,
    }
    if (editing?.id) updateMut.mutate({ id: editing.id, data })
    else createMut.mutate(data)
  }

  const togglePublish = (a) => updateMut.mutate({ id: a.id, data: { is_published: !a.is_published } })
  const toggleFeatured = (a) => updateMut.mutate({ id: a.id, data: { is_featured: !a.is_featured } })

  return (
    <>
      <SectionHeader
        label="Dispatches"
        title="Articles"
        count={articles.length}
        right={
          <button
            onClick={() => open(null)}
            className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 text-[11px] tracking-[0.25em] uppercase hover:bg-red-600 transition-colors"
          >
            <Plus className="w-4 h-4" /> Novo artigo
          </button>
        }
      />

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-neutral-100 animate-pulse" />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-black/20">
          <Newspaper className="w-10 h-10 text-neutral-300 mx-auto mb-4" />
          <h3 className="font-editorial italic text-2xl mb-2">Nenhum artigo ainda</h3>
          <p className="text-sm text-neutral-500 mb-6">Escreve o primeiro artigo da revista.</p>
          <PrimaryButton onClick={() => open(null)}><Plus className="w-4 h-4" /> Novo artigo</PrimaryButton>
        </div>
      ) : (
        <div className="border-t border-black/10">
          {articles.map((a) => (
            <div key={a.id} className="grid grid-cols-12 items-center gap-4 px-2 md:px-4 py-4 border-b border-black/10 hover:bg-neutral-50 transition-colors">
              <div className="col-span-1">
                <div className="aspect-[4/5] bg-neutral-100 overflow-hidden">
                  {a.cover_image && <img src={a.cover_image} alt="" className="w-full h-full object-cover" />}
                </div>
              </div>
              <div className="col-span-7 md:col-span-6">
                <div className="flex items-center gap-2 mb-1">
                  {a.category && (
                    <span className="text-[9px] tracking-[0.25em] uppercase text-red-600">{a.category}</span>
                  )}
                  {a.is_featured && (
                    <span className="text-[9px] tracking-[0.25em] uppercase bg-black text-white px-1.5 py-0.5">Featured</span>
                  )}
                </div>
                <h3 className="font-editorial font-bold text-lg leading-tight">{a.title}</h3>
                <p className="text-xs text-neutral-500 mt-1">
                  {a.author || "—"} · {a.publish_date || "sem data"}
                </p>
              </div>
              <div className="col-span-2 hidden md:block">
                <StatusDot active={a.is_published} />
              </div>
              <div className="col-span-4 md:col-span-3 flex items-center justify-end gap-1">
                <button onClick={() => toggleFeatured(a)} className={`w-8 h-8 flex items-center justify-center border transition-colors ${a.is_featured ? "border-red-600 text-red-600 bg-red-50" : "border-black/20 hover:border-black"}`} title="Destaque">
                  <Star className="w-3.5 h-3.5" fill={a.is_featured ? "currentColor" : "none"} />
                </button>
                <button onClick={() => togglePublish(a)} className="w-8 h-8 flex items-center justify-center border border-black/20 hover:border-black transition-colors" title={a.is_published ? "Ocultar" : "Publicar"}>
                  {a.is_published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => open(a)} className="w-8 h-8 flex items-center justify-center border border-black/20 hover:border-black transition-colors">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setConfirmDel(a)} className="w-8 h-8 flex items-center justify-center border border-red-600/30 text-red-600 hover:bg-red-600 hover:text-white transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!editing} onClose={close} title={editing?.id ? "Editar artigo" : "Novo artigo"} maxWidth="max-w-4xl">
        <form onSubmit={submit} className="space-y-7">
          <Field label="Título" required>
            <TextInput value={form.title} onChange={(e) => onTitleChange(e.target.value)} required />
          </Field>
          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Slug (URL)" hint="Gerado automaticamente — podes editar">
              <TextInput value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} />
            </Field>
            <Field label="Autor">
              <TextInput value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
            </Field>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Categoria">
              <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="">— Nenhuma —</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </Field>
            <Field label="Data de publicação">
              <TextInput type="date" value={form.publish_date || ""} onChange={(e) => setForm({ ...form, publish_date: e.target.value })} />
            </Field>
          </div>
          <Field label="Excerpt (resumo curto)">
            <TextArea rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Linha ou duas que aparecem nas listagens." />
          </Field>
          <Field label="Conteúdo" hint="HTML/Markdown suportado no futuro. Por agora, texto corrido.">
            <TextArea rows={10} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          </Field>
          <FileUploadBox kind="cover" value={form.cover_image} onChange={(v) => setForm({ ...form, cover_image: v })} label="Imagem de capa" />

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <Toggle checked={form.is_published} onChange={(v) => setForm({ ...form, is_published: v })} label="Publicar" />
            <Toggle checked={form.is_featured} onChange={(v) => setForm({ ...form, is_featured: v })} label="Em destaque" />
          </div>

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
        title="Excluir artigo?"
        description={`Tens a certeza que queres excluir "${confirmDel?.title}"?`}
        onCancel={() => setConfirmDel(null)}
        onConfirm={() => deleteMut.mutate(confirmDel.id)}
        loading={deleteMut.isPending}
      />
    </>
  )
}
