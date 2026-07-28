export function getPremierRatingColors(points: number): { text: string, bg: string, border: string } {
  if (points < 5000) return { text: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30' }; 
  if (points < 10000) return { text: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' }; 
  if (points < 15000) return { text: 'text-blue-500', bg: 'bg-blue-600/10', border: 'border-blue-600/30' }; 
  if (points < 20000) return { text: 'text-purple-500', bg: 'bg-purple-600/10', border: 'border-purple-600/30' }; 
  if (points < 25000) return { text: 'text-fuchsia-500', bg: 'bg-fuchsia-600/10', border: 'border-fuchsia-600/30' }; 
  if (points < 30000) return { text: 'text-red-500', bg: 'bg-red-600/10', border: 'border-red-600/30' }; 
  return { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' }; 
}

export function getCS2ColorHex(points: number): string {
  if (points < 5000) return '#b0b5c1'; 
  if (points < 10000) return '#6faae6'; 
  if (points < 15000) return '#4a6ee3'; 
  if (points < 20000) return '#8f46e3'; 
  if (points < 25000) return '#e318e3'; 
  if (points < 30000) return '#e32626'; 
  return '#e8b600'; 
}
