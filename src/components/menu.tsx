import Link from "next/link";
import { Icons } from "@/components/icons";

export function Menu() {
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

      <Link href="/notifications">
        <Icons.bell className="w-6 h-6" />
      </Link>

      <Link href="/profile">
        <Icons.user className="w-6 h-6" />
      </Link>
    </div>
  );
}
