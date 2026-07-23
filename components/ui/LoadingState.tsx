interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingState({ message = "Cargando...", fullScreen = true }: LoadingStateProps) {
  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-border border-t-accent rounded-full animate-spin mx-auto mb-4" aria-hidden="true" />
          <p className="text-sm text-muted" role="status" aria-label={message}>{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="w-6 h-6 border-2 border-border border-t-accent rounded-full animate-spin mx-auto mb-3" aria-hidden="true" />
        <p className="text-xs text-muted" role="status" aria-label={message}>{message}</p>
      </div>
    </div>
  );
}
