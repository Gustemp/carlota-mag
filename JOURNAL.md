# Carlota Mag - Journal de Desenvolvimento

> **Última atualização:** 5 de Janeiro de 2026  
> **Status:** Em produção (parcial) - aguardando configuração AWS S3

---

## Visão Geral do Projeto

**Carlota Mag** é uma plataforma de arquivo digital para revistas, permitindo upload, organização e visualização de edições em formato PDF.

### Stack Tecnológica

| Camada | Tecnologia | Hospedagem |
|--------|------------|------------|
| **Frontend** | React 18 + Vite + TailwindCSS | Netlify |
| **Backend** | FastAPI (Python 3.11) + SQLAlchemy | Railway |
| **Banco de Dados** | SQLite | Railway (local no container) |
| **Storage** | Cloudinary (configurado) / AWS S3 (pendente) | - |

### URLs de Produção

- **Frontend:** https://carlota-mag-archive.netlify.app
- **Backend API:** https://carlota-mag-production-b630.up.railway.app
- **Admin:** https://carlota-mag-archive.netlify.app/admin

### Credenciais Admin

- **Usuário:** `Ale2026`
- **Senha:** `Joppert2026`
- **Localização no código:** `frontend/src/pages/Admin.jsx` (linhas 33-34)

---

## Histórico de Deploy - 5 de Janeiro de 2026

### Fase 1: Análise Inicial

**Problema identificado:** Projeto fullstack (backend + frontend separados) precisava de deploy em duas plataformas diferentes.

**Arquivos de documentação revisados:**
- `DOCUMENTATION.md` - Documentação do produto
- `README.md` - Instruções de setup
- `WINDSURFRULES.md` - Arquitetura técnica

### Fase 2: Deploy do Frontend (Netlify)

**Ações realizadas:**

1. Modificado `frontend/src/api/client.js` para usar variável de ambiente:
   ```javascript
   // Antes
   const API_BASE = '/api'
   
   // Depois
   const API_BASE = import.meta.env.VITE_API_URL || '/api'
   ```

2. Criado arquivo `frontend/netlify.toml`:
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

3. Deploy via Netlify CLI:
   ```bash
   npx netlify-cli sites:create --name carlota-mag-archive
   npx netlify-cli deploy --prod --dir=dist
   ```

4. Configurada variável de ambiente no Netlify:
   ```
   VITE_API_URL=https://carlota-mag-production-b630.up.railway.app/api
   ```

### Fase 3: Deploy do Backend (Railway)

**Desafio 1:** Erro de porta - `Invalid value for '--port': '$PORT'`

O Railway não estava expandindo a variável `$PORT` corretamente no comando de start.

**Solução:** Modificado `backend/railway.json` para usar script shell:
```json
{
  "deploy": {
    "startCommand": "sh start.sh"
  }
}
```

O `start.sh` já existia e fazia a expansão correta:
```bash
#!/bin/bash
PORT="${PORT:-8000}"
exec uvicorn app.main:app --host 0.0.0.0 --port "$PORT"
```

**Desafio 2:** Porta incorreta no domínio público

O servidor estava rodando na porta 8080, mas o domínio público estava configurado para 8000.

**Solução:** Atualizada a porta no Railway Settings → Networking → de 8000 para 8080.

**Variáveis de ambiente configuradas no Railway:**
```
CORS_ORIGINS=https://carlota-mag-archive.netlify.app
DATABASE_URL=sqlite:///./carlota_mag.db
```

### Fase 4: Configuração de Storage (Cloudinary)

**Problema:** Arquivos salvos localmente no container do Railway são perdidos a cada redeploy.

**Solução inicial:** Integração com Cloudinary.

**Arquivos modificados:**

1. `backend/app/config.py` - Adicionadas configurações:
   ```python
   CLOUDINARY_CLOUD_NAME: str = ""
   CLOUDINARY_API_KEY: str = ""
   CLOUDINARY_API_SECRET: str = ""
   
   @property
   def use_cloudinary(self) -> bool:
       return bool(self.CLOUDINARY_CLOUD_NAME and ...)
   ```

2. `backend/app/routers/upload.py` - Integração com Cloudinary:
   ```python
   import cloudinary
   import cloudinary.uploader
   
   async def upload_to_cloudinary(file, resource_type, folder):
       content = await file.read()
       result = cloudinary.uploader.upload(content, ...)
       return result["secure_url"]
   ```

3. `backend/requirements.txt` - Adicionado:
   ```
   cloudinary==1.36.0
   ```

**Variáveis adicionadas no Railway:**
```
CLOUDINARY_CLOUD_NAME=di2dew4xi
CLOUDINARY_API_KEY=276953242627584
CLOUDINARY_API_SECRET=MZkOD9MuKTBYd7QZDmAxuwy6JFw
```

### Fase 5: Limite de Upload (Problema Atual)

**Problema:** Cloudinary tem limite de **10MB por arquivo** no plano gratuito. PDFs das revistas têm ~64MB.

**Erro retornado:**
```
File size too large. Got 64181283. Maximum is 10485760.
```

**Status:** Aguardando cliente criar conta AWS para configurar S3.

---

## Pendências Técnicas

### 1. Configurar AWS S3 (PRIORITÁRIO)

Quando o cliente fornecer credenciais AWS:

1. Criar bucket S3 com nome `carlota-mag-files`
2. Configurar políticas de acesso público para leitura
3. Modificar `backend/app/routers/upload.py` para usar boto3
4. Adicionar `boto3` ao `requirements.txt`
5. Adicionar variáveis no Railway:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_S3_BUCKET`
   - `AWS_S3_REGION`

### 2. Persistência do Banco de Dados

**Problema atual:** SQLite roda localmente no container. Dados são perdidos em redeploys.

**Solução futura:** Migrar para PostgreSQL (Railway oferece gratuitamente).

### 3. Segurança das Credenciais Admin

**Problema:** Login/senha hardcoded no frontend (`Admin.jsx` linhas 33-34).

**Solução futura:** Implementar autenticação real no backend com JWT.

---

## Estrutura de Arquivos Relevantes

```
carlota-mag/
├── backend/
│   ├── app/
│   │   ├── config.py          # Configurações (Cloudinary, DB, CORS)
│   │   ├── main.py            # Entry point FastAPI
│   │   ├── routers/
│   │   │   ├── magazines.py   # CRUD de revistas
│   │   │   └── upload.py      # Upload de arquivos (Cloudinary/local)
│   │   └── ...
│   ├── railway.json           # Configuração Railway
│   ├── start.sh               # Script de inicialização
│   └── requirements.txt       # Dependências Python
│
├── frontend/
│   ├── src/
│   │   ├── api/client.js      # Cliente HTTP (usa VITE_API_URL)
│   │   ├── pages/Admin.jsx    # Painel admin (credenciais hardcoded)
│   │   └── ...
│   ├── netlify.toml           # Configuração Netlify
│   └── ...
│
├── DOCUMENTATION.md           # Documentação do produto
├── WINDSURFRULES.md          # Arquitetura técnica
├── README.md                  # Instruções de setup
└── JOURNAL.md                 # Este arquivo
```

---

## Comandos Úteis

### Redeploy Frontend (Netlify)
```bash
cd frontend
npm run build
npx netlify-cli deploy --prod --dir=dist
```

### Ver logs do Backend (Railway)
Acessar Railway Dashboard → Deployments → View Logs

### Testar API
```bash
curl https://carlota-mag-production-b630.up.railway.app/health
# Resposta esperada: {"status":"healthy"}
```

---

## Contatos e Recursos

- **Netlify Dashboard:** https://app.netlify.com/projects/carlota-mag-archive
- **Railway Dashboard:** https://railway.app (projeto: carlota-mag)
- **Cloudinary Dashboard:** https://console.cloudinary.com
- **GitHub Repo:** https://github.com/Gustemp/carlota-mag

---

## Próximos Passos

1. ⏳ Aguardar cliente criar conta AWS e enviar credenciais
2. 🔧 Configurar AWS S3 para upload de PDFs grandes
3. 🧪 Testar upload de PDF completo
4. 📦 (Futuro) Migrar SQLite para PostgreSQL
5. 🔐 (Futuro) Implementar autenticação JWT no backend
