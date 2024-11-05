import { BoardHeader } from "@/components/user-boards/BoardHeader";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BoardDetailsErrorProps {
  error: any;
}

const BoardDetailsError = ({ error }: BoardDetailsErrorProps) => {
  const title = "Board Details";

  return (
    <section className="rounded-lg border border-error-border bg-card p-6 shadow">
      <BoardHeader title={title} description="" />
      <p className="mb-2 text-error-foreground">Oops! {error.message}</p>
      <div className="mt-4 flex gap-4">
        <Link href={"/user-boards"} passHref>
          <Button className="w-48">Return to your boards</Button>
        </Link>
      </div>
    </section>
  );
};

export default BoardDetailsError;
