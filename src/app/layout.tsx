import type { Metadata } from 'next';
import { Rajdhani, Oswald } from "next/font/google";
import './globals.css';
import { Toaster } from 'react-hot-toast';

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rajdhani",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
});

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
      <body className={`${rajdhani.variable} ${oswald.variable} antialiased bg-[#050401] text-white selection:bg-amber-500/30 selection:text-amber-200`}>
        {children}
        <Toaster 
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#111622',
              color: '#fff',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              fontFamily: 'var(--font-rajdhani)',
            },
          }}
        />
      </body>
    </html>
  );
}
