"use client";

import Link from "next/link";
import Logo from "@/components/navbar/Logo";
import AuthButtons from "./AuthButtons";
import { Separator } from "@/components/ui/separator";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">

        <div className="flex items-center gap-8">
          <Logo />

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/results"
              className="transition-colors hover:text-foreground/80"
            >
              Results
            </Link>

            <Link
              href="/algo"
              className="transition-colors hover:text-foreground/80"
            >
              Algo
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <AuthButtons />
        </div>
      </div>

      <Separator />
    </header>
  );
}