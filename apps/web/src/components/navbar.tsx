"use client";

import Link from "next/link";

export function Navbar() {
  return (
    <nav className="container max-w-screen-sm mb-16 pt-12">
      <Link href="/" className="uppercase text-sm text-muted-foreground">
        The<span className="font-bold text-white">Forum</span>
      </Link>
    </nav>
  );
}
