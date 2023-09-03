"use client"

import Link from "next/link";
import { Icons } from "@/components/icons";
import { useToast } from "@/components/ui/use-toast";

export function Menu() {
  const { toast } = useToast();
  return (
    <div className="fixed bottom-0 flex justify-evenly items-center py-6 bg-background max-w-screen-sm left-[50%] translate-x-[-50%] w-full">
      <Link href="/">
        <Icons.home className="w-6 h-6" />
      </Link>

      <Link href="/info">
        <Icons.info className="w-6 h-6" />
      </Link>

      <Link href="/compose">
        <Icons.write className="w-6 h-6" />
      </Link>

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

      <Link href="/profile">
        <Icons.user className="w-6 h-6" />
      </Link>
    </div>
  );
}
