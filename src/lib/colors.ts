export function getPremierRatingColors(points: number): { text: string, bg: string, border: string } {
  if (points < 5000) return { text: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30' }; // Grey
  if (points < 10000) return { text: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' }; // Light Blue
  if (points < 15000) return { text: 'text-blue-500', bg: 'bg-blue-600/10', border: 'border-blue-600/30' }; // Blue
  if (points < 20000) return { text: 'text-purple-500', bg: 'bg-purple-600/10', border: 'border-purple-600/30' }; // Purple
  if (points < 25000) return { text: 'text-fuchsia-500', bg: 'bg-fuchsia-600/10', border: 'border-fuchsia-600/30' }; // Pink/Magenta
  if (points < 30000) return { text: 'text-red-500', bg: 'bg-red-600/10', border: 'border-red-600/30' }; // Red
  return { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' }; // Gold/Yellow
}
