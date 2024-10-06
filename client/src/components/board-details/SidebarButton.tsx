"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarButtonProps {
  href: string;
  children: ReactNode;
  isActive: boolean;
}

export const SidebarButton = ({ href, children, isActive }: SidebarButtonProps) => {
  return (
    <Button asChild variant="ghost" className={cn("p-2", isActive ? "bg-muted text-foreground" : "text-foreground")}>
      <Link href={href}>
        <div className="flex w-full items-center">{children}</div>
      </Link>
    </Button>
  );
};
