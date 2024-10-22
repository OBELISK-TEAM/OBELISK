"use client";
import { BoardHeader } from "@/components/user-boards/BoardHeader";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import logger from "@/lib/logger";
import { usePathname } from "next/navigation";
import { ErrorPageProps } from "@/interfaces/error-page/error-page";

const Error: React.FC<ErrorPageProps> = ({ error, reset }) => {
  useEffect(() => {
    logger.log("Error while fetching boards:", error);
  }, [error]);
  const pathname = usePathname();
  let title = "Board Details";
  if (pathname.includes("permissions")) {
    title = "Board permissions";
  } else if (pathname.includes("statistics")) {
    title = "Board statistics";
  }

  return (
    <section className="rounded-lg border border-error-border bg-card p-6 shadow">
      <BoardHeader title={title} description={""} />
      <p className="mb-2 text-error-foreground">Oops! {error.message ?? "Something went wrong"}</p>
      <Button variant={"destructive"} onClick={reset}>
        Try again
      </Button>
    </section>
  );
};
export default Error;
