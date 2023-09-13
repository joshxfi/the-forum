"use client";

import { Button } from "./ui/button";
import { signOut } from "next-auth/react";

export function Navbar() {
  return (
    <nav className="container max-w-screen-sm mb-16 pt-12 flex justify-between items-center">
      <h1 className="uppercase text-sm text-muted-foreground">
        The<span className="font-bold text-white">Forum</span>
      </h1>

      <Button type="button" onClick={() => signOut()}>
        Logout
      </Button>
    </nav>
  );
}
