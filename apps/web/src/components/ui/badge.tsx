import { cn } from "@/lib/utils";
import { useCallback } from "react";
import { Icons } from "../icons";

export function Badge({
  name,
  className,
  withRemove,
}: {
  name: string;
  className?: string;
  withRemove?: boolean;
}) {
  const tag = useCallback((_tag: string) => _tag === name, [name]);

  return (
    <div
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
        },
        {
          "flex space-x-[6px] items-center": withRemove,
        }
      )}
    >
      <p>{name}</p>
      {withRemove && <Icons.xMark className="text-gray-300" />}
    </div>
  );
}
