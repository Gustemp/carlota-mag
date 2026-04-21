# Deploy AWS — Carlota Mag

Este guia leva-te de **zero AWS** ao site completo em produção com **auto-deploy via GitHub push**.

## Arquitetura final

```
GitHub (push main)
    │
    ├─→ AWS Amplify Hosting ──→ Frontend (React)   [auto-deploy]
    │
    └─→ AWS App Runner ───────→ Backend (FastAPI)  [auto-deploy]
          │
          ├──→ RDS PostgreSQL  ──→ DB (persiste sempre)
          └──→ S3 Bucket       ──→ PDFs + imagens
```

**Custo estimado mensal:** ~$20-25
- RDS `db.t4g.micro`: ~$13 (grátis 12 meses com Free Tier)
- App Runner: ~$5-8 (scale-to-zero opcional)
- S3: ~$1-2 (depende do tráfego)
- Amplify: ~$0 (free tier generoso)

---

## Ordem de execução

1. [S3 Bucket](#1-s3-bucket-storage-de-pdfs-e-imagens)
2. [IAM User (credenciais S3)](#2-iam-user)
3. [RDS PostgreSQL](#3-rds-postgresql)
4. [App Runner (backend)](#4-app-runner-backend-fastapi)
5. [Amplify (frontend)](#5-amplify-hosting-frontend)
6. [Migração de dados (opcional)](#6-migra%C3%A7%C3%A3o-de-dados-do-railway)

---

## 1. S3 Bucket (storage de PDFs e imagens)

1. Entra em **AWS Console → S3 → Create bucket**
2. **Bucket name:** `carlota-mag-files`
3. **Region:** escolhe perto (ex: `eu-west-1` Irlanda)
4. **Block Public Access:** **DESLIGA** a opção "Block all public access" (os PDFs precisam ser lidos publicamente)
   - Confirma a caixa de aviso
5. Create bucket
6. Entra no bucket → **Permissions → Bucket policy** → cola:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicRead",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::carlota-mag-files/*"
    }
  ]
}
```

7. **Permissions → CORS** → cola:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

---

## 2. IAM User

Credenciais programáticas para o backend fazer upload para o S3.

1. **IAM → Users → Create user**
2. **Name:** `carlota-mag-backend`
3. Next → **Attach policies directly** → procura e seleciona `AmazonS3FullAccess`
   - (Mais restritivo depois: criar política custom só para este bucket)
4. Create user
5. Clica no user → **Security credentials → Create access key**
6. **Use case:** "Application running outside AWS" → Next → Create
7. **GUARDA:**
   - `Access key ID`
   - `Secret access key`
   - (Só vês o secret uma vez!)

---

## 3. RDS PostgreSQL

A base de dados persistente.

1. **RDS → Create database**
2. **Engine:** PostgreSQL
3. **Template:** **Free tier** (se elegível) ou Dev/Test
4. **DB instance identifier:** `carlota-mag-db`
5. **Master username:** `carlota`
6. **Master password:** gera um forte e guarda
7. **Instance class:** `db.t4g.micro`
8. **Storage:** 20 GB gp3
9. **Connectivity:**
   - **Public access:** **YES** (simplifica; mais tarde podes restringir via VPC)
   - **VPC security group:** Create new → nome `carlota-rds-sg`
10. **Additional configuration → Initial database name:** `carlota`
11. Create database (demora ~5 min)
12. Depois de criado → clica no DB → **Connectivity & security** → clica no **Security group** → **Edit inbound rules** → Add rule:
    - Type: PostgreSQL (5432)
    - Source: **Anywhere-IPv4** (0.0.0.0/0)  ← só enquanto testas; depois restringir
13. **Anota o Endpoint:** algo como `carlota-mag-db.abcdefg.eu-west-1.rds.amazonaws.com`

**Connection string final:**
```
postgresql://carlota:TUA_PASSWORD@carlota-mag-db.abcdefg.eu-west-1.rds.amazonaws.com:5432/carlota
```

---

## 4. App Runner (Backend FastAPI)

O backend, com auto-deploy do GitHub.

1. **App Runner → Create service**
2. **Source:** Source code repository
3. **Connect to GitHub** → autoriza a tua conta → seleciona o repo `Gustemp/carlota-mag`
4. **Branch:** `main`
5. **Source directory:** `backend`
6. **Deployment trigger:** **Automatic** ← ESTE é o teu "push GitHub = deploy"
7. Next → **Configure build:**
   - **Configuration file:** Use a configuration file (`apprunner.yaml`) ← já está no repo
   - OU **Configure here manually:**
     - Runtime: Python 3.11
     - Build command: `pip install -r requirements.txt`
     - Start command: `uvicorn app.main:app --host 0.0.0.0 --port 8080`
     - Port: `8080`
8. **Service settings:**
   - Service name: `carlota-mag-backend`
   - CPU: 0.25 vCPU, Memory: 0.5 GB
9. **Environment variables** (cola tudo):

| Chave | Valor |
|---|---|
| `DATABASE_URL` | `postgresql://carlota:PASSWORD@ENDPOINT:5432/carlota` |
| `CORS_ORIGINS` | `https://carlota-mag-archive.netlify.app,https://main.XXXXX.amplifyapp.com` (atualiza depois do Amplify) |
| `AWS_S3_BUCKET` | `carlota-mag-files` |
| `AWS_S3_REGION` | `eu-west-1` (a tua região) |
| `AWS_ACCESS_KEY_ID` | do IAM user (passo 2) |
| `AWS_SECRET_ACCESS_KEY` | do IAM user (passo 2) |

10. **Health check:** Path `/health`
11. Create & deploy (demora ~5-10 min primeira vez)
12. **Anota o URL:** algo como `https://xxxxx.eu-west-1.awsapprunner.com`

**Testar:**
```bash
curl https://xxxxx.eu-west-1.awsapprunner.com/health
# { "status": "healthy" }

curl https://xxxxx.eu-west-1.awsapprunner.com/debug/storage
# { "use_s3": true, ... }
```

**Popular DB inicial** (corre uma vez):
App Runner não tem shell direto. Opções:
- **A:** SSH para a RDS via um EC2 temporário + correr `seed.py`
- **B (mais fácil):** Localmente, com o `DATABASE_URL` da RDS no `.env` do backend, correr:
  ```bash
  cd backend
  ./venv/bin/python seed.py
  ```

---

## 5. Amplify Hosting (Frontend)

Frontend React, com auto-deploy do GitHub.

1. **AWS Amplify → New app → Host web app**
2. **Source:** GitHub → autoriza → repo `Gustemp/carlota-mag` → branch `main`
3. **App name:** `carlota-mag`
4. **Build settings:** vai detetar o `amplify.yml` na raiz do repo automaticamente
5. **Environment variables:**
   | Chave | Valor |
   |---|---|
   | `VITE_API_URL` | `https://xxxxx.eu-west-1.awsapprunner.com/api` (URL do passo 4) |
6. Save & deploy
7. **Anota o URL:** `https://main.abcdefg.amplifyapp.com`

**Depois disto:**
- Volta ao **App Runner → env vars** e atualiza `CORS_ORIGINS` para incluir o URL do Amplify.
- Redeploy do App Runner (um clique).

---

## 6. Migração de dados do Railway

Se tens dados importantes no SQLite do Railway:

### Opção A — Dump & load

1. Railway → Shell no serviço:
   ```bash
   cp /app/carlota_mag.db /tmp/
   ```
   Download do ficheiro via Railway Files UI.

2. Localmente, com o DB baixado:
   ```bash
   cd backend
   # Instala um helper
   pip install sqlalchemy-utils

   # Script simples: copia tabela a tabela de SQLite para Postgres
   # (Podes usar pgloader ou escrever um mini-script)
   ```

### Opção B — Só re-criar (mais simples)

Corre o `seed.py` contra a RDS (8 artigos + 6 serviços) e depois usa o admin para criar os reais.

```bash
# Localmente, .env do backend apontando para RDS
export DATABASE_URL="postgresql://carlota:PASS@ENDPOINT:5432/carlota"
./venv/bin/python seed.py
```

---

## Workflow diário depois disto

```bash
# Fazes uma alteração no código localmente
git add .
git commit -m "feat: nova secção"
git push origin main

# Automaticamente:
# ✓ Amplify detecta push → rebuild frontend → deploy
# ✓ App Runner detecta push → rebuild backend → deploy
# ✓ DB e S3 permanecem intocados — dados seguros
```

Vais ver dois builds em paralelo nos dashboards Amplify e App Runner. Ambos ~3-5 min.

---

## Domínio próprio (opcional)

Quando tiveres um domínio (ex: `carlotamag.com`):

1. **Amplify → Domain management → Add domain** → segue o wizard
2. Registar DNS: CNAME `www` → Amplify URL, A record raiz → Amplify
3. **App Runner → Custom domains → Link domain** → `api.carlotamag.com`
4. Atualizar env vars:
   - Amplify `VITE_API_URL` = `https://api.carlotamag.com/api`
   - App Runner `CORS_ORIGINS` = `https://carlotamag.com,https://www.carlotamag.com`

---

## Troubleshooting

**App Runner falha build:**
- Logs → verifica se `requirements.txt` está correto
- Confirma que `apprunner.yaml` está em `backend/` e o source directory está configurado

**Frontend não liga ao backend:**
- Browser DevTools → Network: vês CORS error? → adiciona URL ao `CORS_ORIGINS` no App Runner
- `VITE_API_URL` precisa acabar em `/api`

**RDS "connection refused":**
- Security Group permite inbound na 5432 de 0.0.0.0/0?
- Database tem `Publicly accessible = Yes`?
- App Runner e RDS na mesma região?

**Uploads não aparecem:**
- `curl https://BACKEND/debug/storage` — `use_s3` deve ser `true`
- Bucket policy permite `s3:GetObject` público?
- CORS do bucket configurado?
