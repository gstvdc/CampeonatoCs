import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Copa Lucas Moura 2ª Edição | Campeonato CS2 2026',
  description:
    'Site oficial da Copa Lucas Moura 2ª Edição de Counter-Strike 2. Confira a contagem regressiva, regulamento, transmissão ao vivo e confirme a presença do seu time gratuitamente!',
  keywords: [
    'Copa Lucas Moura',
    'CS2',
    'Counter-Strike 2',
    'Campeonato CS2',
    'Torneio eSports',
    'Confirmação de Presença',
    'Inscrição de Time',
  ],
  openGraph: {
    title: 'Copa Lucas Moura 2ª Edição | Counter-Strike 2',
    description: 'Habilidade. Estratégia. Glória Eterna! Confirme a presença do seu time na 2ª Edição.',
    images: ['/trophy.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className="antialiased bg-[#06080e] text-slate-100 min-h-screen selection:bg-[#00f0ff] selection:text-black">
        {children}
      </body>
    </html>
  );
}
