"use client";

import Link from "next/link";
import { Icons } from "@/components/icons";
import { usePathname } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export function Menu() {
  const { toast } = useToast();
  const pathname = usePathname();

  const routes: { route: string; icon: "home" | "info" | "write" }[] = [
    {
      route: "/",
      icon: "home",
    },
    {
      route: "/info",
      icon: "info",
    },
    {
      route: "/compose",
      icon: "write",
    },
  ];

  return (
    <div className="fixed bottom-0 flex justify-evenly items-center py-6 bg-background max-w-screen-sm left-[50%] translate-x-[-50%] w-full">
      {routes.map(({ route, icon }) => {
        const Icon = Icons[icon];
        const IconSolid = Icons[`${icon}Solid`];

        return (
          <Link key={route} href={route}>
            {pathname === route ? (
              <IconSolid className="w-6 h-6" />
            ) : (
              <Icon className="w-6 h-6" />
            )}
          </Link>
        );
      })}

      <button
        type="button"
        onClick={() => {
          toast({
            title: "Feature: Notifications 🔔",
            description: "Coming soon!",
          });
        }}
      >
        <Icons.bell className="w-6 h-6" />
      </button>

      <Link href="/register">
        <Icons.user className="w-6 h-6" />
      </Link>
    </div>
  );
}
