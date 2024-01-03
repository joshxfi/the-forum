import { cn } from "@/lib/utils";
import { useCallback } from "react";

export function Badge({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const tag = useCallback((_tag: string) => _tag === name, [name]);

  return (
    <p
      className={cn(
        "py-1 px-2 text-secondary-foreground text-xs bg-secondary border border-muted-foreground rounded-full leading-none",
        className,
        {
          "bg-gray-900": tag("you"),
          "bg-cyan-900": tag("story"),
          "bg-lime-900": tag("insight"),
          "bg-amber-900": tag("rant"),
          "bg-fuchsia-900": tag("confession"),
          "bg-indigo-900": tag("question"),
        }
      )}
    >
      {name}
    </p>
  );
}
