import { cx } from "class-variance-authority";

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        className,
        "flex cursor-default items-center justify-center",
      )}
    >
      <div className="flex-none animate-spin text-2xl">🌀</div>
    </div>
  );
}
