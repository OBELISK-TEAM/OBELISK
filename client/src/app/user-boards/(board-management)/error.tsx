"use client";

import React, { useEffect } from "react";
import logger from "@/lib/logger";
import { ErrorComponentProps } from "@/interfaces/error-component/error-component";

export default function Error({ error }: ErrorComponentProps) {
  useEffect(() => {
    logger.error(error);
  }, [error]);
  return (
    <section
      className="ms-center flex w-screen justify-center rounded-lg border bg-card p-4"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <p className="mb-2 text-error-foreground">{"Oops! " + (error.message || "Error while fetching boards")}</p>
    </section>
  );
}
