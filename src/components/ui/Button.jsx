export function Button({
  variant = "primary",
  size = "md",
  disabled,
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-violet-400/60 disabled:opacity-60 disabled:pointer-events-none";
  const sizes = {
    sm: "text-sm px-3 py-2",
    md: "text-sm px-3.5 py-2.5",
  };
  const variants = {
    primary:
      "bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200",
    secondary:
      "bg-white/70 hover:bg-white border border-black/10 text-neutral-900 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 dark:text-white",
    danger:
      "bg-red-600 text-white hover:bg-red-500 dark:bg-red-500 dark:hover:bg-red-400",
  };

  return (
    <button
      disabled={disabled}
      className={[base, sizes[size], variants[variant], className].join(" ")}
      {...props}
    />
  );
}

