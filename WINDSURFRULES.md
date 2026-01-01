# Carlota Mag - Regras de Arquitetura Técnica

> **IMPORTANTE**: Sempre consulte este arquivo antes de fazer qualquer alteração no projeto.

---

## Estrutura do Projeto

```
carlota-mag/
├── backend/                    # API FastAPI (Python)
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py            # Entry point da API
│   │   ├── config.py          # Configurações e variáveis de ambiente
│   │   ├── database.py        # Conexão com banco de dados
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── magazine.py    # Modelo Magazine
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   └── magazine.py    # Pydantic schemas
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   └── magazines.py   # Endpoints de revistas
│   │   └── services/
│   │       ├── __init__.py
│   │       └── upload.py      # Serviço de upload de arquivos
│   ├── uploads/               # Pasta para arquivos enviados
│   │   ├── pdfs/
│   │   └── covers/
│   ├── requirements.txt
│   └── .env
│
├── frontend/                   # React + Vite
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js      # Cliente HTTP (axios/fetch)
│   │   ├── components/
│   │   │   ├── ui/            # Componentes base (shadcn style)
│   │   │   └── magazines/     # Componentes específicos
│   │   ├── hooks/
│   │   │   └── useMagazines.js
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Reader.jsx
│   │   │   ├── Admin.jsx
│   │   │   └── index.jsx      # Router
│   │   ├── lib/
│   │   │   └── utils.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css          # Tailwind + CSS variables
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env
│
├── DOCUMENTATION.md           # Documentação do produto
├── WINDSURFRULES.md          # Este arquivo (arquitetura técnica)
└── README.md                  # Instruções de setup
```

---

## Stack Tecnológica

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Banco de Dados**: SQLite (MVP) → PostgreSQL (produção)
- **ORM**: SQLAlchemy
- **Validação**: Pydantic
- **Upload**: Arquivos salvos localmente em `/uploads`
- **CORS**: Habilitado para localhost:5173

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Estilização**: TailwindCSS
- **Componentes UI**: Radix UI primitives (shadcn style)
- **Ícones**: Lucide React
- **Animações**: Framer Motion
- **Roteamento**: React Router DOM
- **HTTP Client**: Fetch API nativo
- **State**: React Query (TanStack Query)

---

## Regras de Código

### Backend (Python)

1. **Estrutura de arquivos**
   - Um arquivo por modelo em `models/`
   - Um arquivo por schema em `schemas/`
   - Um arquivo por recurso em `routers/`

2. **Nomenclatura**
   - Funções: `snake_case`
   - Classes: `PascalCase`
   - Constantes: `UPPER_SNAKE_CASE`

3. **Endpoints REST**
   ```
   GET    /api/magazines          # Listar todas
   GET    /api/magazines/{id}     # Buscar uma
   POST   /api/magazines          # Criar
   PUT    /api/magazines/{id}     # Atualizar
   DELETE /api/magazines/{id}     # Excluir
   POST   /api/upload/pdf         # Upload de PDF
   POST   /api/upload/cover       # Upload de capa
   ```

4. **Respostas de erro**
   - Sempre retornar JSON com `{"detail": "mensagem"}`
   - Usar status codes HTTP apropriados

### Frontend (React)

1. **Estrutura de componentes**
   - Componentes em `PascalCase`
   - Um componente por arquivo
   - Componentes UI genéricos em `components/ui/`
   - Componentes específicos em `components/{feature}/`

2. **Nomenclatura**
   - Componentes: `PascalCase`
   - Funções/hooks: `camelCase`
   - Constantes: `UPPER_SNAKE_CASE`
   - Arquivos de componente: `PascalCase.jsx`

3. **Estilização**
   - Usar apenas TailwindCSS
   - Seguir a paleta de cores definida em `index.css`
   - Manter consistência com a estética minimalista

4. **Estado**
   - React Query para dados do servidor
   - useState para estado local de UI
   - Evitar prop drilling excessivo

---

## Regras de Estilo Visual

### CSS Variables (index.css)
```css
:root {
  --background: 0 0% 100%;      /* Branco */
  --foreground: 0 0% 3.9%;      /* Quase preto */
  --primary: 0 0% 9%;           /* Preto */
  --muted: 0 0% 96.1%;          /* Cinza claro */
  --muted-foreground: 0 0% 45%; /* Cinza médio */
  --border: 0 0% 89.8%;         /* Borda sutil */
}
```

### Classes Tailwind Padrão
- **Container**: `max-w-7xl mx-auto px-6 md:px-12`
- **Títulos grandes**: `text-5xl md:text-7xl font-extralight tracking-[0.4em]`
- **Subtítulos**: `text-xs tracking-[0.2em] text-neutral-400 uppercase`
- **Cards de revista**: `aspect-[3/4]`
- **Animações**: Usar Framer Motion com `duration: 0.5-0.8`

### Componentes Obrigatórios
- Todos os botões devem usar o componente `Button`
- Inputs devem usar o componente `Input`
- Diálogos devem usar o componente `Dialog`
- Manter consistência visual em todo o app

---

## Regras de Upload

1. **PDFs**
   - Extensão permitida: `.pdf`
   - Tamanho máximo: 200MB
   - Salvar em: `backend/uploads/pdfs/`
   - Nome do arquivo: `{uuid}_{original_name}.pdf`

2. **Imagens de Capa**
   - Extensões permitidas: `.jpg`, `.jpeg`, `.png`, `.webp`
   - Tamanho máximo: 5MB
   - Salvar em: `backend/uploads/covers/`
   - Nome do arquivo: `{uuid}_{original_name}.{ext}`

3. **Servir arquivos estáticos**
   - Montar `/uploads` como rota estática no FastAPI
   - URLs retornadas: `/uploads/pdfs/{filename}`

---

## Comandos de Desenvolvimento

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev  # Porta 5173
```

### Produção
```bash
# Backend
uvicorn app.main:app --host 0.0.0.0 --port 8000

# Frontend
npm run build
npm run preview
```

---

## Checklist de Implementação

### Fase 1 - Setup
- [ ] Criar estrutura de pastas
- [ ] Configurar backend FastAPI
- [ ] Configurar frontend Vite + React
- [ ] Configurar TailwindCSS
- [ ] Criar componentes UI base

### Fase 2 - Backend
- [ ] Modelo Magazine (SQLAlchemy)
- [ ] Schemas Pydantic
- [ ] CRUD endpoints
- [ ] Upload de arquivos
- [ ] Servir arquivos estáticos

### Fase 3 - Frontend
- [ ] Página Home com grid de revistas
- [ ] Página Reader com visualizador PDF
- [ ] Página Admin com formulário
- [ ] Integração com API
- [ ] Animações e polish

### Fase 4 - Testes e Deploy
- [ ] Testar fluxo completo
- [ ] Documentar README
- [ ] Preparar para deploy

---

## Notas Importantes

1. **Sempre consultar DOCUMENTATION.md** para entender o produto
2. **Sempre consultar este arquivo** para decisões técnicas
3. **Manter a estética minimalista** - menos é mais
4. **Priorizar funcionalidade** sobre features extras no MVP
5. **Código limpo e legível** - evitar complexidade desnecessária
