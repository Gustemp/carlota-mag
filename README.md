# Carlota Mag - Arquivo Digital de Revistas

Plataforma para upload, organização e visualização de revistas em formato PDF.

## Requisitos

- Python 3.11+
- Node.js 18+
- npm ou yarn

## Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Mac/Linux
# ou: venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

O backend estará disponível em `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

## Estrutura do Projeto

```
carlota-mag/
├── backend/           # API FastAPI
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── models/
│   │   ├── schemas/
│   │   └── routers/
│   └── uploads/       # Arquivos enviados
│
├── frontend/          # React + Vite
│   └── src/
│       ├── api/
│       ├── components/
│       ├── hooks/
│       └── pages/
│
├── DOCUMENTATION.md   # Documentação do produto
└── WINDSURFRULES.md   # Arquitetura técnica
```

## Funcionalidades

- **Home**: Visualização das revistas publicadas
- **Reader**: Leitor de PDF com zoom
- **Admin**: Painel para gerenciar edições (CRUD + upload)

## API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /api/magazines | Lista revistas |
| GET | /api/magazines/{id} | Busca revista |
| POST | /api/magazines | Cria revista |
| PUT | /api/magazines/{id} | Atualiza revista |
| DELETE | /api/magazines/{id} | Exclui revista |
| POST | /api/upload/pdf | Upload de PDF |
| POST | /api/upload/cover | Upload de capa |

## Licença

MIT
