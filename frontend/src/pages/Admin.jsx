import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"
import { 
  Plus, Upload, Trash2, Eye, EyeOff, Pencil, X, 
  FileText, Calendar, ImageIcon, Loader2, ArrowLeft, Lock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { api } from "@/api/client"

const ADMIN_USER = "Ale2026"
const ADMIN_PASS = "Joppert2026"

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginData, setLoginData] = useState({ username: "", password: "" })
  const [loginError, setLoginError] = useState("")
  
  const [showForm, setShowForm] = useState(false)
  const [editingMagazine, setEditingMagazine] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [uploadingPdf, setUploadingPdf] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)

  useEffect(() => {
    const auth = sessionStorage.getItem("carlota_admin_auth")
    if (auth === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (e) => {
    e.preventDefault()
    if (loginData.username === ADMIN_USER && loginData.password === ADMIN_PASS) {
      setIsAuthenticated(true)
      sessionStorage.setItem("carlota_admin_auth", "true")
      setLoginError("")
    } else {
      setLoginError("Usuário ou senha incorretos")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem("carlota_admin_auth")
  }

  const [formData, setFormData] = useState({
    title: "",
    edition: "",
    description: "",
    pdf_url: "",
    cover_image: "",
    publish_date: "",
    is_published: true
  })

  const queryClient = useQueryClient()

  const { data: magazines = [], isLoading } = useQuery({
    queryKey: ['admin-magazines'],
    queryFn: () => api.magazines.list(false),
  })

  const createMutation = useMutation({
    mutationFn: (data) => api.magazines.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-magazines'] })
      resetForm()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.magazines.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-magazines'] })
      resetForm()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.magazines.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-magazines'] })
      setDeleteConfirm(null)
    },
  })

  const resetForm = () => {
    setFormData({
      title: "",
      edition: "",
      description: "",
      pdf_url: "",
      cover_image: "",
      publish_date: "",
      is_published: true
    })
    setEditingMagazine(null)
    setShowForm(false)
  }

  const handleEdit = (magazine) => {
    setEditingMagazine(magazine)
    setFormData({
      title: magazine.title || "",
      edition: magazine.edition || "",
      description: magazine.description || "",
      pdf_url: magazine.pdf_url || "",
      cover_image: magazine.cover_image || "",
      publish_date: magazine.publish_date || "",
      is_published: magazine.is_published !== false
    })
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editingMagazine) {
      updateMutation.mutate({ id: editingMagazine.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const handleFileUpload = async (file, type) => {
    try {
      if (type === 'pdf') {
        setUploadingPdf(true)
        const { file_url } = await api.upload.pdf(file)
        setFormData(prev => ({ ...prev, pdf_url: file_url }))
      } else {
        setUploadingCover(true)
        const { file_url } = await api.upload.cover(file)
        setFormData(prev => ({ ...prev, cover_image: file_url }))
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setUploadingPdf(false)
      setUploadingCover(false)
    }
  }

  const togglePublish = async (magazine) => {
    updateMutation.mutate({ 
      id: magazine.id, 
      data: { is_published: !magazine.is_published } 
    })
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-12">
            <img 
              src="/logo-white.jpeg" 
              alt="Carlota" 
              className="h-12 md:h-16 mx-auto mb-4"
            />
            <p className="text-white/40 text-sm tracking-[0.2em] uppercase">
              Área Administrativa
            </p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white/60 text-xs tracking-wider uppercase">
                Usuário
              </Label>
              <Input
                id="username"
                type="text"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/30"
                placeholder="Digite seu usuário"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/60 text-xs tracking-wider uppercase">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/30"
                placeholder="Digite sua senha"
                required
              />
            </div>

            {loginError && (
              <p className="text-red-400 text-sm text-center">{loginError}</p>
            )}
            
            <Button
              type="submit"
              className="w-full bg-white text-black hover:bg-white/90 tracking-wide"
            >
              <Lock className="w-4 h-4 mr-2" />
              Entrar
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <Link 
              to="/"
              className="text-white/40 text-xs tracking-wider hover:text-white/60 transition-colors"
            >
              Voltar ao site
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-6">
              <Link 
                to="/"
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm tracking-wide">Voltar</span>
              </Link>
              <div className="h-6 w-px bg-white/20" />
              <div>
                <p className="text-xs tracking-[0.3em] text-white/50 uppercase mb-2">
                  Painel Administrativo
                </p>
                <img 
                  src="/logo-white.jpeg" 
                  alt="Carlota" 
                  className="h-8 md:h-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowForm(true)}
                className="bg-white text-black hover:bg-neutral-100 tracking-wide"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Edição
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 tracking-wide"
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                <div className="h-48 bg-neutral-100 rounded mb-4" />
                <div className="h-4 bg-neutral-100 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : magazines.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h2 className="text-xl font-light text-neutral-500 mb-2">
              Nenhuma edição criada
            </h2>
            <p className="text-neutral-400 text-sm mb-6">
              Comece adicionando sua primeira revista
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-black text-white hover:bg-neutral-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Edição
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {magazines.map((magazine) => (
                <motion.div
                  key={magazine.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-lg overflow-hidden shadow-sm border border-neutral-100 group"
                >
                  <div className="relative h-48 bg-neutral-100">
                    {magazine.cover_image ? (
                      <img
                        src={magazine.cover_image}
                        alt={magazine.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-black">
                        <span className="text-white text-xl tracking-[0.3em] font-light">
                          CARLOTA
                        </span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge
                        variant={magazine.is_published ? "default" : "secondary"}
                        className={magazine.is_published 
                          ? "bg-green-500 hover:bg-green-600" 
                          : "bg-neutral-400"
                        }
                      >
                        {magazine.is_published ? "Publicado" : "Rascunho"}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <p className="text-xs tracking-[0.2em] text-neutral-400 uppercase mb-1">
                      {magazine.edition || "Edição"}
                    </p>
                    <h3 className="font-medium text-black mb-3">{magazine.title}</h3>
                    
                    {magazine.publish_date && (
                      <div className="flex items-center gap-2 text-xs text-neutral-400 mb-4">
                        <Calendar className="w-3 h-3" />
                        {new Date(magazine.publish_date).toLocaleDateString('pt-BR')}
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-4 border-t border-neutral-100">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(magazine)}
                        className="flex-1 text-neutral-600 hover:text-black"
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePublish(magazine)}
                        className="flex-1 text-neutral-600 hover:text-black"
                      >
                        {magazine.is_published ? (
                          <>
                            <EyeOff className="w-4 h-4 mr-1" />
                            Ocultar
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-1" />
                            Publicar
                          </>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteConfirm(magazine)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-light tracking-wide">
              {editingMagazine ? "Editar Edição" : "Nova Edição"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Edição de Verão"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edition">Número da Edição</Label>
                <Input
                  id="edition"
                  value={formData.edition}
                  onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                  placeholder="Ex: Nº 01"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Breve descrição da edição..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="publish_date">Data de Publicação</Label>
              <Input
                id="publish_date"
                type="date"
                value={formData.publish_date}
                onChange={(e) => setFormData({ ...formData, publish_date: e.target.value })}
              />
            </div>

            {/* PDF Upload */}
            <div className="space-y-2">
              <Label>Arquivo PDF *</Label>
              <div className="border-2 border-dashed border-neutral-200 rounded-lg p-6 text-center hover:border-neutral-400 transition-colors">
                {formData.pdf_url ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileText className="w-8 h-8 text-green-500" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-green-600">PDF carregado</p>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, pdf_url: "" })}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ) : uploadingPdf ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
                    <span className="text-sm text-neutral-500">Carregando...</span>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                    <p className="text-sm text-neutral-500">
                      Clique para fazer upload do PDF
                    </p>
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          handleFileUpload(e.target.files[0], 'pdf')
                        }
                      }}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Cover Image Upload */}
            <div className="space-y-2">
              <Label>Imagem de Capa</Label>
              <div className="border-2 border-dashed border-neutral-200 rounded-lg p-6 text-center hover:border-neutral-400 transition-colors">
                {formData.cover_image ? (
                  <div className="relative">
                    <img
                      src={formData.cover_image}
                      alt="Capa"
                      className="max-h-48 mx-auto rounded"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, cover_image: "" })}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : uploadingCover ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
                    <span className="text-sm text-neutral-500">Carregando...</span>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <ImageIcon className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                    <p className="text-sm text-neutral-500">
                      Clique para fazer upload da capa
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          handleFileUpload(e.target.files[0], 'cover')
                        }
                      }}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-3">
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                />
                <Label htmlFor="is_published" className="cursor-pointer">
                  Publicar imediatamente
                </Label>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-black text-white hover:bg-neutral-800"
                  disabled={!formData.title || !formData.pdf_url || createMutation.isPending || updateMutation.isPending}
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {editingMagazine ? "Salvar" : "Criar"}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir edição?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir "{deleteConfirm?.title}"? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate(deleteConfirm.id)}
              className="bg-red-500 hover:bg-red-600"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
