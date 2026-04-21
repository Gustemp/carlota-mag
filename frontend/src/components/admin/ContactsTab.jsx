import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Mail, Trash2, Check, ChevronDown, Reply } from "lucide-react"
import { api } from "@/api/client"
import { SectionHeader, ConfirmDialog } from "./ui"

function formatDateTime(d) {
  return new Date(d).toLocaleString("pt-PT", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  })
}

export default function ContactsTab() {
  const qc = useQueryClient()
  const [expanded, setExpanded] = useState(null)
  const [confirmDel, setConfirmDel] = useState(null)

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ["admin-contacts"],
    queryFn: () => api.contacts.list(false),
  })

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => api.contacts.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-contacts"] }),
  })
  const deleteMut = useMutation({
    mutationFn: (id) => api.contacts.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-contacts"] }); setConfirmDel(null) },
  })

  const toggleExpand = (c) => {
    setExpanded(expanded === c.id ? null : c.id)
    if (!c.is_read) updateMut.mutate({ id: c.id, data: { is_read: true } })
  }

  const unreadCount = contacts.filter((c) => !c.is_read).length

  return (
    <>
      <SectionHeader
        label="Inbox"
        title="Contacts"
        count={contacts.length}
        right={unreadCount > 0 && (
          <span className="text-red-600 font-semibold">{unreadCount} não lidas</span>
        )}
      />

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-neutral-100 animate-pulse" />
          ))}
        </div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-black/20">
          <Mail className="w-10 h-10 text-neutral-300 mx-auto mb-4" />
          <h3 className="font-editorial italic text-2xl mb-2">Sem mensagens</h3>
          <p className="text-sm text-neutral-500">Quando alguém enviar pelo formulário de contato, aparece aqui.</p>
        </div>
      ) : (
        <div className="border-t border-black/10">
          {contacts.map((c) => {
            const isOpen = expanded === c.id
            return (
              <div key={c.id} className={`border-b border-black/10 ${!c.is_read ? "bg-red-50/30" : ""}`}>
                <button
                  onClick={() => toggleExpand(c)}
                  className="w-full grid grid-cols-12 items-center gap-4 px-2 md:px-4 py-4 text-left hover:bg-neutral-50 transition-colors"
                >
                  <div className="col-span-1 flex justify-center">
                    {!c.is_read ? (
                      <span className="w-2 h-2 rounded-full bg-red-600" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-neutral-300" />
                    )}
                  </div>
                  <div className="col-span-3 md:col-span-3">
                    <p className={`text-sm ${!c.is_read ? "font-bold" : ""}`}>{c.name}</p>
                    <p className="text-xs text-neutral-500 truncate">{c.email}</p>
                  </div>
                  <div className="col-span-6 md:col-span-6 min-w-0">
                    {c.subject && (
                      <p className="font-editorial italic text-base truncate">{c.subject}</p>
                    )}
                    <p className="text-xs text-neutral-600 truncate">{c.message}</p>
                  </div>
                  <div className="col-span-2 md:col-span-2 flex items-center justify-end gap-2 text-[10px] tracking-[0.2em] uppercase text-neutral-500">
                    <span className="hidden md:inline">{formatDateTime(c.created_at)}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 md:px-8 pb-6 pt-2 bg-neutral-50 border-t border-black/5">
                    <div className="grid md:grid-cols-3 gap-6 mb-5 text-sm">
                      <InfoItem label="Nome" value={c.name} />
                      <InfoItem label="Email" value={<a href={`mailto:${c.email}`} className="underline">{c.email}</a>} />
                      <InfoItem label="Telefone" value={c.phone || "—"} />
                      <InfoItem label="Assunto" value={c.subject || "—"} />
                      <InfoItem label="Recebido" value={formatDateTime(c.created_at)} />
                    </div>
                    <div>
                      <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 mb-2">Mensagem</p>
                      <p className="text-base leading-relaxed whitespace-pre-wrap border-l-2 border-black pl-4">
                        {c.message}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-6">
                      <a
                        href={`mailto:${c.email}?subject=Re:%20${encodeURIComponent(c.subject || "contato")}`}
                        className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 text-[11px] tracking-[0.25em] uppercase hover:bg-red-600 transition-colors"
                      >
                        <Reply className="w-4 h-4" /> Responder
                      </a>
                      {c.is_read ? (
                        <button
                          onClick={() => updateMut.mutate({ id: c.id, data: { is_read: false } })}
                          className="inline-flex items-center gap-2 px-4 py-2.5 text-[11px] tracking-[0.25em] uppercase border border-black/20 hover:border-black transition-colors"
                        >
                          Marcar como não lida
                        </button>
                      ) : (
                        <button
                          onClick={() => updateMut.mutate({ id: c.id, data: { is_read: true } })}
                          className="inline-flex items-center gap-2 px-4 py-2.5 text-[11px] tracking-[0.25em] uppercase border border-black/20 hover:border-black transition-colors"
                        >
                          <Check className="w-4 h-4" /> Marcar como lida
                        </button>
                      )}
                      <button
                        onClick={() => setConfirmDel(c)}
                        className="ml-auto inline-flex items-center gap-2 px-4 py-2.5 text-[11px] tracking-[0.25em] uppercase text-red-600 border border-red-600/30 hover:bg-red-600 hover:text-white transition-colors"
                      >
                        <Trash2 className="w-4 h-4" /> Excluir
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmDel}
        title="Excluir mensagem?"
        description={`Tens a certeza que queres excluir a mensagem de ${confirmDel?.name}?`}
        onCancel={() => setConfirmDel(null)}
        onConfirm={() => deleteMut.mutate(confirmDel.id)}
        loading={deleteMut.isPending}
      />
    </>
  )
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 mb-1">{label}</p>
      <p>{value}</p>
    </div>
  )
}
