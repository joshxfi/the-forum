import { twMerge } from "tailwind-merge";

export function Badge({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      className={twMerge(
        "py-1 px-2 text-secondary-foreground text-xs bg-secondary border border-muted-foreground rounded-full leading-none",
        className
      )}
    >
      {children}
    </p>
  );
}
