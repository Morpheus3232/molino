export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[1200px] px-4 sm:px-8 pt-16 sm:pt-24 pb-24 animate-pulse">
        <div className="mb-12 space-y-4">
          <div className="h-12 w-3/4 max-w-xl bg-ink/10 rounded-xl" />
          <div className="h-4 w-full max-w-2xl bg-ink/5 rounded-lg" />
        </div>
        <div className="flex flex-wrap gap-2 mb-10">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-9 w-20 bg-ink/5 rounded-sm border border-ink/10" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="card overflow-hidden">
              <div className="aspect-[16/9] bg-ink/10" />
              <div className="p-6 space-y-3">
                <div className="h-3 w-1/3 bg-ink/10 rounded" />
                <div className="h-5 w-4/5 bg-ink/10 rounded" />
                <div className="h-3 w-full bg-ink/5 rounded" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
