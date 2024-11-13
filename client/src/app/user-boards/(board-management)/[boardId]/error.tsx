"use client";
import { SectionHeader } from "@/components/common/headers/section-header/SectionHeader";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ErrorComponentProps } from "@/interfaces/error-component/error-component";
import logger from "@/lib/logger";

function Error({ error }: ErrorComponentProps) {
  useEffect(() => {
    logger.error(error);
  }, [error]);
  const title = "Board Details";

  return (
    <section className="rounded-lg border border-error-border bg-card p-6 shadow">
      <SectionHeader title={title} description="" />
      <p className="mb-2 text-error-foreground">Oops! {error.message || "An error occured!"}</p>
      <div className="mt-4 flex gap-4">
        <Link href={"/user-boards"} passHref>
          <Button className="w-48">Return to your boards</Button>
        </Link>
      </div>
    </section>
  );
}

export default Error;
