import { twMerge } from "tailwind-merge";

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={twMerge(
        "flex cursor-default items-center justify-center",
        className,
      )}
    >
      <div className="flex-none animate-spin text-2xl">🌀</div>
    </div>
  );
}
