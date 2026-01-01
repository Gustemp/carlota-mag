# Carlota Mag - Arquivo Digital de Revistas

## Visão Geral

**Carlota Mag** é uma plataforma de arquivo digital para revistas, permitindo upload, organização e visualização de edições em formato PDF.

---

## Funcionalidades do MVP

### 1. Página Inicial (Home)
- Hero section com nome "CARLOTA" em destaque
- Grid de capas das revistas publicadas
- Animações suaves ao carregar
- Link para visualização de cada edição

### 2. Visualizador de Revista (Reader)
- Exibição do PDF em iframe
- Controles de zoom (aumentar, diminuir, resetar)
- Botão de download do PDF
- Navegação para voltar à home

### 3. Painel Administrativo (Admin)
- Listagem de todas as edições (publicadas e rascunhos)
- Criar nova edição com:
  - Título (obrigatório)
  - Número da edição
  - Descrição
  - Data de publicação
  - Upload de PDF (obrigatório)
  - Upload de imagem de capa
  - Toggle publicar/rascunho
- Editar edição existente
- Excluir edição
- Publicar/ocultar edição

---

## Modelo de Dados

### Magazine (Revista)
```
{
  id: string (UUID)
  title: string (obrigatório)
  edition: string (ex: "Nº 01")
  description: string
  pdf_url: string (caminho do arquivo PDF)
  cover_image: string (caminho da imagem de capa)
  publish_date: date
  is_published: boolean (default: true)
  created_at: datetime
  updated_at: datetime
}
```

---

## Fluxo do Usuário

### Visitante
1. Acessa a home → vê grid de revistas publicadas
2. Clica em uma capa → abre o visualizador
3. Lê o PDF ou faz download

### Administrador
1. Acessa /admin
2. Faz login (MVP: senha simples ou sem auth)
3. Gerencia edições (CRUD completo)
4. Upload de arquivos PDF e imagens

---

## Estética e Design

### Paleta de Cores
- **Fundo**: Branco (#FFFFFF)
- **Texto principal**: Preto (#000000)
- **Texto secundário**: Neutro (#9CA3AF, #6B7280)
- **Acentos**: Preto/branco com transparências

### Tipografia
- **Fonte**: System UI / Inter
- **Títulos**: `font-extralight`, `tracking-[0.3em]` a `tracking-[0.4em]`
- **Subtítulos**: `text-xs`, `tracking-[0.2em]`, `uppercase`
- **Corpo**: `font-light`, `tracking-wide`

### Componentes Visuais
- Cards de revista com aspect-ratio 3/4
- Hover effects com overlay escuro e ícone de seta
- Animações com Framer Motion (fade-in, slide-up)
- Bordas sutis (`border-neutral-100`)
- Sombras leves em cards (`shadow-sm`, `shadow-2xl` no reader)

### Layout
- Container máximo: `max-w-7xl`
- Padding horizontal: `px-6 md:px-12`
- Grid responsivo: 1 coluna mobile, 2 tablet, 3 desktop
- Espaçamento vertical generoso (`py-20 md:py-32`)

---

## Páginas e Rotas

| Rota | Página | Descrição |
|------|--------|-----------|
| `/` | Home | Página inicial com grid de revistas |
| `/reader?id={id}` | Reader | Visualizador de PDF |
| `/admin` | Admin | Painel administrativo |

---

## Integrações Futuras (Pós-MVP)

- [ ] Autenticação real (JWT)
- [ ] Upload para S3/Cloudinary
- [ ] Busca e filtros por data/edição
- [ ] Categorias/tags
- [ ] Analytics de visualizações
- [ ] Modo escuro
- [ ] PWA para leitura offline
