export default function PreciosLoading() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-8 animate-pulse text-center">
        <div className="space-y-3 max-w-xl mx-auto">
          <div className="h-4 w-36 bg-ink/10 rounded-full mx-auto" />
          <div className="h-12 w-80 bg-ink/15 rounded-xl mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="h-80 rounded-3xl bg-card border border-ink/10" />
          <div className="h-88 rounded-3xl bg-card border border-accent/30" />
          <div className="h-80 rounded-3xl bg-card border border-ink/10" />
        </div>
      </div>
    </div>
  );
}
