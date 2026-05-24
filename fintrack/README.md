# 💰 FinTrack — Controle Financeiro Pessoal

App web de gestão financeira pessoal. Mobile-first, dark mode, PWA-ready. Rode localmente ou publique de graça na Vercel.

---

## 🚀 Rodando localmente

### Pré-requisitos
- **Node.js 18+** — [nodejs.org](https://nodejs.org)
- **npm** (já vem com o Node)

### 1. Instale as dependências
```bash
npm install
```

### 2. Configure o banco de dados
```bash
npx prisma db push
```
Isso cria o arquivo `prisma/dev.db` (SQLite local).

### 3. Popule com dados de exemplo (opcional)
```bash
npm run db:seed
```

### 4. Inicie o servidor
```bash
npm run dev
```

Acesse em: **http://localhost:3000**

---

## 📱 Usar no iPhone como app (PWA)

1. Abra **Safari** no iPhone
2. Acesse a URL do app (local ou Vercel)
3. Toque no ícone de **Compartilhar** (quadrado com seta)
4. Selecione **"Adicionar à Tela de Início"**
5. Toque em **"Adicionar"**

O app vai aparecer na sua tela inicial e abrir em tela cheia, igual a um app nativo! 🎉

---

## ☁️ Publicar grátis na Vercel

### Passo a passo

**1. Crie uma conta na Vercel**
- Acesse [vercel.com](https://vercel.com)
- Crie conta gratuita (pode usar o GitHub)

**2. Suba o projeto no GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
gh repo create fintrack --public --push
# ou use a interface do GitHub
```

**3. Importe na Vercel**
- No painel da Vercel, clique em "Add New Project"
- Selecione seu repositório `fintrack`
- Clique em "Deploy"

**⚠️ Importante sobre o banco de dados na Vercel:**

O SQLite local **não funciona na Vercel** (serverless). Para deploy gratuito, use uma das opções:

**Opção A: Turso (recomendado — SQLite na nuvem, gratuito)**
1. Acesse [turso.tech](https://turso.tech) → crie conta
2. Crie um banco: `turso db create fintrack`
3. Pegue a URL: `turso db show fintrack --url`
4. Pegue o token: `turso db tokens create fintrack`
5. No `prisma/schema.prisma`, troque para:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("TURSO_DATABASE_URL")
   }
   ```
6. Adicione nas variáveis da Vercel:
   - `TURSO_DATABASE_URL` = sua URL do Turso

**Opção B: PlanetScale / Neon (PostgreSQL gratuito)**
- Crie banco em [neon.tech](https://neon.tech) (gratuito)
- Troque o provider do Prisma para `postgresql`
- Adicione `DATABASE_URL` nas env vars da Vercel

**Opção C: Rodar só local**  
Perfeito para uso pessoal! SQLite local é rápido e simples. Basta rodar `npm run dev` e usar no seu computador.

---

## 🛠️ Comandos úteis

```bash
npm run dev          # Inicia em desenvolvimento
npm run build        # Gera build de produção
npm run db:push      # Cria/atualiza o banco
npm run db:seed      # Popula com dados de exemplo
npm run db:studio    # Abre o Prisma Studio (UI do banco)
```

---

## 📂 Estrutura do projeto

```
fintrack/
├── prisma/
│   ├── schema.prisma    # Modelos do banco
│   └── seed.ts          # Dados de exemplo
├── src/
│   ├── app/
│   │   ├── api/         # Rotas da API (Next.js)
│   │   ├── page.tsx     # Dashboard
│   │   ├── transactions/ # Página de transações
│   │   └── categories/  # Página de categorias
│   ├── components/
│   │   ├── ui/          # Componentes shadcn/ui
│   │   ├── layout/      # Navegação
│   │   └── transactions/ # Cards e formulários
│   ├── lib/             # Utilitários
│   ├── hooks/           # useToast
│   └── types/           # TypeScript types
└── public/
    └── manifest.json    # Config PWA
```

---

## ✨ Funcionalidades

- ✅ **Dashboard** com saldo, receitas, gastos e economia do mês
- ✅ **Gráfico de pizza** de gastos por categoria
- ✅ **Insights** automáticos ("você gastou mais com X")
- ✅ **Adicionar/editar/excluir** transações
- ✅ **Filtros** por mês, categoria e tipo
- ✅ **Categorias** padrão + criação de categorias customizadas
- ✅ **Navegação por mês** no dashboard e transações
- ✅ **Dark mode** por padrão
- ✅ **Mobile-first** com bottom navigation
- ✅ **PWA** — adicionar à tela inicial do iPhone
- ✅ **Toasts** de feedback
- ✅ **Confirmação** antes de excluir

---

## 🔧 Backup do banco

O banco é o arquivo `prisma/dev.db`. Para fazer backup:

```bash
cp prisma/dev.db prisma/dev.db.backup
```

Simples assim! É um arquivo SQLite comum.

---

## 📝 Licença

MIT — use, modifique e distribua livremente.
