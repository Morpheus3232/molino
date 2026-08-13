export default function HoyLoading() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="text-center space-y-2">
          <div className="h-4 w-28 bg-ink/10 rounded-full mx-auto" />
          <div className="h-9 w-60 bg-ink/15 rounded-xl mx-auto" />
        </div>
        <div className="h-48 rounded-3xl bg-card border border-ink/10" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-40 rounded-2xl bg-card border border-ink/10" />
          <div className="h-40 rounded-2xl bg-card border border-ink/10" />
        </div>
      </div>
    </div>
  );
}
