export default function BlogArticleLoading() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[1200px] px-4 sm:px-8 pt-16 sm:pt-24 pb-24 animate-pulse">
        <div className="h-3 w-40 bg-ink/5 rounded mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
          <div className="min-w-0">
            <div className="mb-10 space-y-3">
              <div className="h-3 w-24 bg-ink/10 rounded" />
              <div className="h-10 w-3/4 bg-ink/10 rounded-xl" />
              <div className="h-4 w-full max-w-2xl bg-ink/5 rounded" />
            </div>
            <div className="aspect-[16/9] bg-ink/10 rounded-md mb-10" />
            <div className="space-y-3 max-w-prose">
              <div className="h-4 w-full bg-ink/5 rounded" />
              <div className="h-4 w-full bg-ink/5 rounded" />
              <div className="h-4 w-5/6 bg-ink/5 rounded" />
            </div>
          </div>
          <aside className="hidden lg:block space-y-3">
            <div className="h-4 w-32 bg-ink/5 rounded" />
            <div className="h-3 w-full bg-ink/5 rounded" />
            <div className="h-3 w-4/5 bg-ink/5 rounded" />
          </aside>
        </div>
      </main>
    </div>
  );
}
