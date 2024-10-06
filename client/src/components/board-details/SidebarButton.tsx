"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarButtonProps {
  href: string;
  children: ReactNode;
}

export const SidebarButton = ({ href, children }: SidebarButtonProps) => {
  const pathname = usePathname();
  const isActive = () => {
    const normalizedPath = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
    const normalizedHref = href.endsWith("/") ? href.slice(0, -1) : href;

    return normalizedPath === normalizedHref;
  };

  return (
    <Button asChild variant="ghost" className={cn("p-2", isActive() ? "bg-muted text-foreground" : "text-foreground")}>
      <Link href={href}>
        <div className="flex w-full items-center">{children}</div>
      </Link>
    </Button>
  );
};
