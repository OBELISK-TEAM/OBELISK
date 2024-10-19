"use client";
import { BoardHeader } from "@/components/user-boards/BoardHeader";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import logger from "@/lib/logger";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}
const Error: React.FC<ErrorPageProps> = ({ error, reset }) => {
  useEffect(() => {
    logger.log("Error while fetching boards:", error);
  }, [error]);

  return (
    <section className="rounded-lg border border-error-border bg-card p-6 shadow">
      <BoardHeader title="Board Details" description="Board Information" />
      <p className="mb-2 text-error-foreground">Oops! {error.message ?? "Something went wrong"}</p>
      <Button variant={"destructive"} onClick={reset}>
        Try again
      </Button>
    </section>
  );
};
export default Error;
