"use client";

import Link from "next/link";
import { nanoid } from "nanoid";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

import { Icons } from "@/components/icons";
import { useToast } from "@/components/ui/use-toast";

import { PostForm } from "./post/post-form";
import { DialogDrawer } from "./dialog-drawer";

export function Menu() {
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const { status } = useSession();
  const [postDialog, setPostDialog] = useState(false);

  const routes: {
    route?: string;
    icon: "home" | "info" | "write" | "user" | "bell";
    path?: string;
    onClick?: () => void;
  }[] = [
    {
      route: "/",
      icon: "home",
      path: "/",
    },
    {
      route: "/info",
      icon: "info",
      path: "/info",
    },
    {
      icon: "write",
      onClick: () => {
        if (status === "unauthenticated") {
          router.push("/login");
          return;
        }

        if (pathname !== "/") {
          router.push("/");
          setTimeout(() => setPostDialog(true), 500);
          return;
        }
        setPostDialog(true);
      },
    },
    {
      icon: "bell",
      onClick: () => {
        toast({
          title: "Notifications 🔔",
          description: "Coming soon!",
        });
      },
    },
    {
      route: status === "unauthenticated" ? "/login" : "/profile",
      icon: "user",
      path: "/profile",
    },
  ];

  return (
    <div className="fixed bottom-0 flex justify-evenly items-center py-6 bg-background max-w-screen-sm left-[50%] translate-x-[-50%] w-full">
      {routes.map(({ route, icon, path, onClick }) => {
        const Icon = Icons[icon];
        const IconSolid = Icons[`${icon}Solid`];

        return onClick ? (
          <button key={nanoid()} type="button" onClick={onClick}>
            <Icon className="w-6 h-6" />
          </button>
        ) : (
          <Link key={nanoid()} href={route!}>
            {pathname === path ? (
              <IconSolid className="w-6 h-6" />
            ) : (
              <Icon className="w-6 h-6" />
            )}
          </Link>
        );
      })}

      <DialogDrawer open={postDialog} setOpen={setPostDialog}>
        <PostForm setOpen={setPostDialog} />
      </DialogDrawer>
    </div>
  );
}
