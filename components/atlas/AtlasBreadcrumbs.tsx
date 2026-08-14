import Link from "next/link";

interface Crumb {
  href?: string;
  label: string;
}

/**
 * Atlas breadcrumbs: `Atlas / País / Categoría`. Server-rendered (no client
 * interactivity needed beyond links).
 */
export default function AtlasBreadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav className="flex items-center gap-2 text-xs text-muted mb-6 flex-wrap" aria-label="Breadcrumb">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={crumb.label} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">›</span>}
            {crumb.href && !isLast ? (
              <Link
                href={crumb.href}
                className="underline decoration-ink/25 underline-offset-2 hover:text-foreground hover:decoration-foreground transition-colors"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className={isLast ? "text-foreground font-medium" : "text-muted"}>{crumb.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
