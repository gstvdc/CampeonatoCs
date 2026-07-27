# 🏆 Copa Lucas Moura - 2ª Edição (CS2)

Plataforma oficial da **2ª Edição da Copa Lucas Moura** de Counter-Strike 2. 
O sistema foi desenvolvido para apresentar os capitães oficiais do torneio e permitir que os jogadores da comunidade se inscrevam e demonstrem interesse em participar do **Draft ao vivo**.

## 🚀 Tecnologias Utilizadas

Este projeto foi construído com as melhores e mais modernas tecnologias do ecossistema web:

- **[Next.js](https://nextjs.org/)** (App Router)
- **[React](https://react.dev/)**
- **[Tailwind CSS](https://tailwindcss.com/)** para estilização visual rápida e responsiva
- **[Lucide Icons](https://lucide.dev/)** para a iconografia
- **[Supabase](https://supabase.com/)** como Banco de Dados e API (PostgreSQL)

## ⚙️ Funcionalidades

- **Mural de Capitães:** Exibição dos 4 capitães oficiais (Gusta, HPS, Léo, Zane) com suas pontuações e perfis.
- **Sistema de Inscrição no Draft:** Formulário para jogadores se cadastrarem com seus Nicks, Steam ID, WhatsApp e função (Role) preferida no CS2.
- **Integração Real-time:** As inscrições vão diretamente para o banco de dados oficial no Supabase.
- **Design Premium:** UI temática de Counter-Strike 2, dark mode, animações e responsividade.

## 🛠️ Como rodar o projeto localmente

Para rodar este projeto na sua máquina, você precisará ter o [Node.js](https://nodejs.org/) instalado.

1. **Clone o repositório**
   ```bash
   git clone https://github.com/gstvdc/CampeonatoCs.git
   cd CampeonatoCs
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente (Supabase)**
   Crie um arquivo chamado `.env.local` na raiz do projeto e adicione as suas chaves do Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=sua_url_do_projeto
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_public
   ```

4. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

5. **Acesse no navegador**
   Abra [http://localhost:3000](http://localhost:3000) e veja o projeto rodando!

## 🗄️ Estrutura do Banco de Dados (Supabase SQL)

Se for criar um banco novo, rode este comando no **SQL Editor** do Supabase para criar a tabela de jogadores interessados:

```sql
CREATE TABLE IF NOT EXISTS public.interested_players (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  captain_name text NOT NULL,
  player_name text NOT NULL,
  contact_phone text NOT NULL,
  steam_id text NOT NULL,
  role text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.interested_players ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leitura publica de jogadores" ON public.interested_players FOR SELECT USING (true);
CREATE POLICY "Insercao publica de jogadores" ON public.interested_players FOR INSERT WITH CHECK (true);
```

---
*Desenvolvido para a comunidade de CS2.* 🎮
