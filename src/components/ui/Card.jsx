export function Card({ title, subtitle, actions, children }) {
  return (
    <section className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/5 shadow-sm">
      {(title || subtitle || actions) && (
        <header className="px-5 py-4 border-b border-black/5 dark:border-white/10 flex items-start justify-between gap-3">
          <div>
            {title ? (
              <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
                {title}
              </h2>
            ) : null}
            {subtitle ? (
              <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">
                {subtitle}
              </p>
            ) : null}
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

