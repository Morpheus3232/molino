export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="text-center space-y-3">
          <div className="h-4 w-32 bg-ink/10 rounded-full mx-auto" />
          <div className="h-10 w-64 bg-ink/15 rounded-xl mx-auto" />
          <div className="h-4 w-48 bg-ink/10 rounded-full mx-auto" />
        </div>

        {/* Tab Strip Skeleton */}
        <div className="flex justify-center gap-2 max-w-md mx-auto">
          <div className="h-9 flex-1 bg-ink/10 rounded-xl" />
          <div className="h-9 flex-1 bg-ink/10 rounded-xl" />
          <div className="h-9 flex-1 bg-ink/10 rounded-xl" />
        </div>

        {/* Big Archetype Card Skeleton */}
        <div className="p-8 rounded-3xl bg-card border border-ink/10 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-ink/15" />
            <div className="space-y-2 flex-1">
              <div className="h-6 w-1/3 bg-ink/15 rounded-lg" />
              <div className="h-4 w-1/2 bg-ink/10 rounded" />
            </div>
          </div>
          <div className="space-y-2 pt-4 border-t border-ink/5">
            <div className="h-4 w-full bg-ink/10 rounded" />
            <div className="h-4 w-5/6 bg-ink/10 rounded" />
            <div className="h-4 w-4/6 bg-ink/10 rounded" />
          </div>
        </div>

        {/* 3 Columns Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-40 rounded-2xl bg-card border border-ink/10 p-5 space-y-3">
            <div className="h-4 w-20 bg-ink/15 rounded" />
            <div className="h-8 w-12 bg-ink/20 rounded" />
            <div className="h-3 w-full bg-ink/10 rounded" />
          </div>
          <div className="h-40 rounded-2xl bg-card border border-ink/10 p-5 space-y-3">
            <div className="h-4 w-20 bg-ink/15 rounded" />
            <div className="h-8 w-12 bg-ink/20 rounded" />
            <div className="h-3 w-full bg-ink/10 rounded" />
          </div>
          <div className="h-40 rounded-2xl bg-card border border-ink/10 p-5 space-y-3">
            <div className="h-4 w-20 bg-ink/15 rounded" />
            <div className="h-8 w-12 bg-ink/20 rounded" />
            <div className="h-3 w-full bg-ink/10 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
