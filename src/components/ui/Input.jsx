export function Input({ label, hint, error, className = "", ...props }) {
  return (
    <label className="block">
      {label ? (
        <div className="text-sm font-medium text-neutral-900 dark:text-white">
          {label}
        </div>
      ) : null}
      <input
        className={[
          "mt-1 w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition",
          "bg-white/70 dark:bg-black/20",
          error
            ? "border-red-400 focus:ring-2 focus:ring-red-300/60"
            : "border-black/10 dark:border-white/10 focus:ring-2 focus:ring-violet-400/50",
          "text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500",
          className,
        ].join(" ")}
        {...props}
      />
      {error ? (
        <div className="mt-1 text-xs text-red-600 dark:text-red-400">
          {error}
        </div>
      ) : hint ? (
        <div className="mt-1 text-xs text-neutral-600 dark:text-neutral-300">
          {hint}
        </div>
      ) : null}
    </label>
  );
}

