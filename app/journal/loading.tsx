export default function JournalLoading() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
        <div className="space-y-2 pb-6 border-b border-ink/10">
          <div className="h-4 w-32 bg-ink/10 rounded-full" />
          <div className="h-10 w-72 bg-ink/15 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 h-96 rounded-2xl bg-card border border-ink/10" />
          <div className="lg:col-span-7 h-96 rounded-2xl bg-card border border-ink/10" />
        </div>
      </div>
    </div>
  );
}
