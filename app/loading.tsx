export default function RootLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-background px-4">
      <div className="relative flex items-center justify-center mb-6">
        <div className="w-12 h-12 rounded-full border-2 border-accent/20 border-t-accent animate-spin" />
        <span className="absolute text-accent text-sm font-serif">✦</span>
      </div>
      <p className="font-mono text-xs text-muted tracking-widest uppercase animate-pulse">
        Calculando patrones…
      </p>
    </div>
  );
}
